import { revalidatePath } from 'next/cache';
import {
  CoreTool,
  Message,
  NoSuchToolError,
  appendResponseMessages,
  createDataStreamResponse,
  generateObject,
  smoothStream,
  streamText,
} from 'ai';
import { performance } from 'perf_hooks';
import { z } from 'zod';
import {
  defaultModel,
  defaultSystemPrompt,
  defaultTools,
  getToolsFromRequiredTools,
} from '@/ai/providers';
import { MAX_TOKEN_MESSAGES } from '@/lib/constants';
import { isValidTokenUsage, logWithTiming } from '@/lib/utils';
import {
  getConfirmationResult,
  getUnconfirmedConfirmationMessage,
  handleConfirmation,
} from '@/lib/utils/ai';
import { generateTitleFromUserMessage } from '@/server/actions/ai';
import { getToolsFromOrchestrator } from '@/server/actions/orchestrator';
import { verifyUser } from '@/server/actions/user';
import {
  dbCreateConversation,
  dbCreateMessages,
  dbCreateTokenStat,
  dbDeleteConversation,
  dbGetConversationMessages,
} from '@/server/db/queries';

export const maxDuration = 120;

const messageSchema = z.object({
  id: z.string(),
  message: z.object({
    role: z.enum(['user', 'system', 'assistant']),
    content: z.string(),
    experimental_attachments: z.array(z.object({
      contentType: z.string(),
      url: z.string(),
    })).optional(),
  }),
});

export async function POST(req: Request) {
  const startTime = performance.now();

  // Check for valid user session and required parameters
  const session = await verifyUser();
  const userId = session?.data?.data?.id;
  const publicKey = session?.data?.data?.publicKey;
  const degenMode = session?.data?.data?.degenMode;

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (!publicKey) {
    console.error('[chat/route] No public key found');
    return new Response('No public key found', { status: 400 });
  }

  try {
    const { id: conversationId, message }: { id: string; message: Message } = await req.json();
    
    // Validate message
    try {
      messageSchema.parse({ id: conversationId, message });
    } catch (e) {
      return new Response('Invalid message data', { status: 400 });
    }

    logWithTiming(startTime, '[chat/route] message received');

    // Fetch existing messages for the conversation
    const existingMessages = (await dbGetConversationMessages({
      conversationId,
      limit: MAX_TOKEN_MESSAGES,
      isServer: true,
    })) ?? [];

    logWithTiming(startTime, '[chat/route] fetched existing messages');

    if (existingMessages.length === 0 && message.role !== 'user') {
      return new Response('No user message found', { status: 400 });
    }

    // Create a new conversation if it doesn't exist
    if (existingMessages.length === 0) {
      const title = await generateTitleFromUserMessage({
        message: message.content,
      });
      await dbCreateConversation({ conversationId, userId, title });
      revalidatePath('/api/conversations');
    }

    // Create a new user message in the DB if the current message is from the user
    const newUserMessage = message.role === 'user'
      ? await dbCreateMessages({
          messages: [
            {
              conversationId,
              role: 'user',
              content: message.content,
              toolInvocations: [],
              experimental_attachments: message.experimental_attachments
                ? JSON.parse(JSON.stringify(message.experimental_attachments))
                : undefined,
            },
          ],
        })
      : null;

    // Handle confirmation message
    const unconfirmed = getUnconfirmedConfirmationMessage(existingMessages);
    const { confirmationHandled, updates } = await handleConfirmation({
      current: message,
      unconfirmed,
    });
    logWithTiming(startTime, '[chat/route] handleConfirmation completed');

    // Build the system prompt and append the history of attachments
    const attachments = existingMessages
      .filter((m) => m.experimental_attachments)
      .flatMap((m) => m.experimental_attachments!)
      .map((a) => ({ type: a.contentType, data: a.url }));

    const systemPrompt = [
      defaultSystemPrompt,
      `History of attachments: ${JSON.stringify(attachments)}`,
      `User Solana wallet public key: ${publicKey}`,
      `User ID: ${userId}`,
      `Conversation ID: ${conversationId}`,
      `Degen Mode: ${degenMode}`,
    ].join('\n\n');

    // Filter out empty messages and ensure sorting by createdAt ascending
    const relevant = existingMessages
      .filter((m) => m.content !== '')
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));

    // Handle confirmation result
    const confirmationResult = getConfirmationResult(message);
    if (confirmationResult !== undefined) {
      relevant.push({
        id: message.id,
        content: confirmationResult,
        role: 'user',
        createdAt: new Date(),
      });
    } else {
      relevant.push(message);
    }

    logWithTiming(startTime, '[chat/route] calling createDataStreamResponse');

    // Begin the stream response
    return createDataStreamResponse({
      execute: async (dataStream) => {
        if (dataStream.onError) {
          dataStream.onError((error: any) => {
            console.error('[chat/route] createDataStreamResponse.execute dataStream error:', error);
          });
        }

        if (updates.length) {
          updates.forEach((u) => dataStream.writeData(u));
        }

        // Fetch tools dynamically based on the conversation context
        const { toolsRequired, usage: orchestratorUsage } = await getToolsFromOrchestrator(
          relevant,
          degenMode || confirmationHandled,
        );

        logWithTiming(startTime, '[chat/route] getToolsFromOrchestrator complete');

        const tools = toolsRequired
          ? getToolsFromRequiredTools(toolsRequired)
          : defaultTools;

        const result = streamText({
          model: defaultModel,
          system: systemPrompt,
          tools: tools as Record<string, CoreTool<any, any>>,
          experimental_toolCallStreaming: true,
          experimental_telemetry: { isEnabled: true, functionId: 'stream-text' },
          experimental_repairToolCall: async ({ toolCall, tools, parameterSchema, error }) => {
            if (NoSuchToolError.isInstance(error)) {
              return null;
            }
            console.log('[chat/route] repairToolCall', toolCall);
            const tool = tools[toolCall.toolName as keyof typeof tools];
            const { object: repairedArgs } = await generateObject({
              model: defaultModel,
              schema: tool.parameters as z.ZodType<any>,
              prompt: [
                `The model tried to call the tool "${toolCall.toolName}"` +
                ` with the following arguments:`,
                JSON.stringify(toolCall.args),
                `The tool accepts the following schema:`,
                JSON.stringify(parameterSchema(toolCall)),
                'Please fix the arguments.',
              ].join('\n'),
            });
            return { ...toolCall, args: JSON.stringify(repairedArgs) };
          },
          experimental_transform: smoothStream(),
          maxSteps: 15,
          messages: relevant,
          async onFinish({ response, usage }) {
            if (!userId) return;

            try {
              logWithTiming(startTime, '[chat/route] streamText.onFinish complete');

              const finalMessages = appendResponseMessages({
                messages: [],
                responseMessages: response.messages,
              }).filter(
                (m) =>
                  m.content !== '' || (m.toolInvocations || []).length !== 0,
              );

              // Increment createdAt by 1ms to avoid duplicate timestamps
              const now = new Date();
              finalMessages.forEach((m, index) => {
                if (m.createdAt) {
                  m.createdAt = new Date(m.createdAt.getTime() + index);
                } else {
                  m.createdAt = new Date(now.getTime() + index);
                }
              });

              // Save the messages to the database
              const saved = await dbCreateMessages({
                messages: finalMessages.map((m) => ({
                  conversationId,
                  createdAt: m.createdAt,
                  role: m.role,
                  content: m.content,
                  toolInvocations: m.toolInvocations
                    ? JSON.parse(JSON.stringify(m.toolInvocations))
                    : undefined,
                  experimental_attachments: m.experimental_attachments
                    ? JSON.parse(JSON.stringify(m.experimental_attachments))
                    : undefined,
                })),
              });

              logWithTiming(startTime, '[chat/route] dbCreateMessages complete');

              // Save the token stats
              if (saved && newUserMessage && isValidTokenUsage(usage)) {
                let { promptTokens, completionTokens, totalTokens } = usage;

                if (isValidTokenUsage(orchestratorUsage)) {
                  promptTokens += orchestratorUsage.promptTokens;
                  completionTokens += orchestratorUsage.completionTokens;
                  totalTokens += orchestratorUsage.totalTokens;
                }

                const messageIds = [...newUserMessage, ...saved].map(
                  (m) => m.id,
                );

                await dbCreateTokenStat({
                  userId,
                  messageIds,
                  promptTokens,
                  completionTokens,
                  totalTokens,
                });

                logWithTiming(startTime, '[chat/route] dbCreateTokenStat complete');
              }

              revalidatePath('/api/conversations');
            } catch (error) {
              console.error('[chat/route] Error in onFinish:', error);
            }
          },
        });

        return result;
      },
    });
  } catch (error) {
    console.error('[chat/route] POST error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
