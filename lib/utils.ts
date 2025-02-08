import { Message as PrismaMessage } from '@prisma/client';
import {
  Attachment,
  CoreToolMessage,
  LanguageModelUsage,
  Message,
  ToolInvocation,
} from 'ai';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { EmbeddedWallet } from '@/types/db';
import { SOL_MINT } from '@/types/helius/portfolio';

import { searchWalletAssets } from './solana/helius';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  return value.toFixed(2);
}

export function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export const isValidTokenUsage = (usage: LanguageModelUsage) =>
  usage &&
  !isNaN(usage.promptTokens) &&
  !isNaN(usage.completionTokens) &&
  !isNaN(usage.totalTokens);

export function formatDate(date: Date | string) {
  if (typeof date === 'string') {
    date = new Date(date.replace(' ', 'T'));
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: CoreToolMessage;
  messages: Array<Message>;
}): Array<Message> {
  return messages.map((message) => {
    if (!message.toolInvocations) return message;

    return {
      ...message,
      toolInvocations: message.toolInvocations.map((toolInvocation) => {
        const toolResult = toolMessage.content.find(
          (tool) => tool.toolCallId === toolInvocation.toolCallId,
        );

        if (toolResult) {
          return {
            ...toolInvocation,
            state: 'result',
            result: toolResult.result,
          };
        }

        return toolInvocation;
      }),
    };
  });
}

export function convertToUIMessages(
  messages: Array<PrismaMessage>,
): Array<Message> {
  return messages.reduce((chatMessages: Array<Message>, rawMessage) => {
    const message = rawMessage;

    let parsedContent = message.content as any;

    try {
      parsedContent = JSON.parse(parsedContent);
    } catch (error) {
      if (
        message.content ||
        (Array.isArray(message.toolInvocations) &&
          message.toolInvocations.length > 0)
      ) {
        chatMessages.push({
          id: message.id,
          role: message.role as Message['role'],
          content: message.content ?? '',
          toolInvocations:
            message.toolInvocations as unknown as ToolInvocation[],
          experimental_attachments:
            message.experimental_attachments as unknown as Attachment[],
          createdAt: message.createdAt,
        });
      }

      return chatMessages;
    }

    message.content = parsedContent;

    if (message.role === 'tool') {
      return addToolMessageToChat({
        toolMessage: message as unknown as CoreToolMessage,
        messages: chatMessages,
      });
    }

    let textContent = '';
    const toolInvocations: Array<ToolInvocation> = [];
    const attachments: Array<Attachment> = [];

    if (
      typeof message.content === 'object' &&
      message.content &&
      'content' in message.content
    ) {
      message.content = (message.content as any)?.content || [];
    }

    if (typeof message.content === 'string') {
      textContent = message.content;
    } else if (Array.isArray(message.content)) {
      for (const c of message.content as any) {
        if (!c) continue;
        const content = c as any;

        switch (content.type) {
          case 'text':
            textContent += content.text;
            break;
          case 'tool-call':
            toolInvocations.push({
              state: 'call',
              toolCallId: content.toolCallId,
              toolName: content.toolName,
              args: content.args,
            });
            break;
          case 'image':
            attachments.push({
              url: content.image,
              name: 'image.png',
              contentType: 'image/png',
            });
            break;
        }
      }
    }

    chatMessages.push({
      id: message.id,
      role: message.role as Message['role'],
      content: textContent,
      toolInvocations,
      experimental_attachments: attachments,
      createdAt: message.createdAt,
    });

    return chatMessages;
  }, []);
}

export function logWithTiming(startTime: number, message: string) {
  const elapsedTime = (performance.now() - startTime).toFixed(1);

  console.log(`${message} (${elapsedTime}ms)`);
}

export function canAffordSubscription(
  walletPortfolio?: Awaited<ReturnType<typeof searchWalletAssets>>,
): boolean {
  const solBalanceInfo = walletPortfolio?.fungibleTokens?.find(
    (t) => t.id === SOL_MINT,
  );

  const balance = solBalanceInfo
    ? solBalanceInfo.token_info.balance
    : undefined;

  const subscriptionPriceLamports = Number(
    process.env.NEXT_PUBLIC_SUB_LAMPORTS,
  );

  const hasEnoughBalance = balance && balance >= subscriptionPriceLamports;

  return !!hasEnoughBalance;
}

export function getSubPriceFloat(): number {
  const lamports = Number(process.env.NEXT_PUBLIC_SUB_LAMPORTS!);

  return lamports / 1_000_000_000;
}

export function getTrialTokensFloat(): number {
  const lamports = Number(process.env.NEXT_PUBLIC_TRIAL_LAMPORTS || 0);

  return lamports / 1_000_000_000;
}

export const IS_SUBSCRIPTION_ENABLED =
  `${process.env.NEXT_PUBLIC_SUB_ENABLED}` === 'true';
export const IS_TRIAL_ENABLED =
  `${process.env.NEXT_PUBLIC_TRIAL_ENABLED}` === 'true';