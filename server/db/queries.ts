"use server"

import type { Action, Prisma, Message as PrismaMessage } from "@prisma/client"
import type { JsonValue } from "@prisma/client/runtime/library"
import _ from "lodash"

import prisma from "@/lib/prisma"
import { convertToUIMessages } from "@/lib/utils"
import type { NewAction } from "@/types/db"

export async function dbGetConversation({
  conversationId,
  includeMessages,
  isServer,
}: {
  conversationId: string
  includeMessages?: boolean
  isServer?: boolean
}) {
  try {
    if (!isServer) {
      return await prisma.conversation.update({
        where: { id: conversationId },
        data: { lastReadAt: new Date() },
        include: includeMessages ? { messages: true } : undefined,
      })
    } else {
      return await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: includeMessages ? { messages: true } : undefined,
      })
    }
  } catch (error) {
    console.error("[DB Error] Failed to get conversation:", {
      conversationId,
      error,
    })
    return null
  }
}

export async function dbCreateConversation({
  conversationId,
  userId,
  title,
}: {
  conversationId: string
  userId: string
  title: string
}) {
  try {
    return await prisma.conversation.create({
      data: { id: conversationId, userId, title },
    })
  } catch (error) {
    console.error("[DB Error] Failed to create conversation:", {
      conversationId,
      userId,
      error,
    })
    return null
  }
}

export async function dbCreateMessages({
  messages,
}: {
  messages: Omit<PrismaMessage, "id" | "createdAt">[]
}) {
  try {
    const lastMessage = messages[messages.length - 1]

    if (lastMessage) {
      await prisma.conversation.update({
        where: { id: lastMessage.conversationId },
        data: { lastMessageAt: new Date() },
      })
    }

    return await prisma.message.createManyAndReturn({
      data: messages as Prisma.MessageCreateManyInput[],
    })
  } catch (error) {
    console.error("[DB Error] Failed to create messages:", {
      messageCount: messages.length,
      error,
    })
    return null
  }
}

export async function dbUpdateMessageToolInvocations({
  messageId,
  toolInvocations,
}: {
  messageId: string
  toolInvocations: JsonValue
}) {
  if (!toolInvocations) {
    return null
  }

  try {
    return await prisma.message.update({
      where: { id: messageId },
      data: {
        toolInvocations,
      },
    })
  } catch (error) {
    console.error("[DB Error] Failed to update message:", {
      messageId,
      error,
    })
    return null
  }
}

export async function dbGetConversationMessages({
  conversationId,
  limit,
  isServer,
}: {
  conversationId: string
  limit?: number
  isServer?: boolean
}) {
  try {
    if (!isServer) {
      console.log("Marking conversation as read", conversationId)
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { lastReadAt: new Date() },
      })
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: limit ? { createdAt: "desc" } : [{ createdAt: "asc" }, { role: "asc" }],
      take: limit,
    })

    const uiMessages = convertToUIMessages(messages)

    if (limit && uiMessages.length && uiMessages[uiMessages.length - 1].role !== "user") {
      const lastMessageAt = uiMessages[uiMessages.length - 1].createdAt || new Date(1)
      uiMessages.push({
        id: "fake",
        createdAt: new Date(lastMessageAt.getTime() - 1),
        role: "user",
        content: "user message",
        toolInvocations: [],
        experimental_attachments: [],
      })
    }

    return uiMessages
  } catch (error) {
    console.error("[DB Error] Failed to get conversation messages:", {
      conversationId,
      error,
    })
    return null
  }
}

export async function dbDeleteConversation({
  conversationId,
  userId,
}: {
  conversationId: string
  userId: string
}) {
  try {
    await prisma.$transaction([
      prisma.action.deleteMany({
        where: { conversationId },
      }),
      prisma.message.deleteMany({
        where: { conversationId },
      }),
      prisma.conversation.delete({
        where: {
          id: conversationId,
          userId,
        },
      }),
    ])
  } catch (error) {
    console.error("[DB Error] Failed to delete conversation:", {
      conversationId,
      userId,
      error,
    })
    throw error
  }
}

export async function dbGetConversations({ userId }: { userId: string }) {
  try {
    return await prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("[DB Error] Failed to get user conversations:", {
      userId,
      error,
    })
    return []
  }
}

export async function dbGetActions({
  triggered = true,
  paused = false,
  completed = false,
}: {
  triggered: boolean
  paused: boolean
  completed: boolean
}) {
  try {
    return await prisma.action.findMany({
      where: {
        triggered,
        paused,
        completed,
        OR: [{ startTime: { lte: new Date() } }, { startTime: null }],
      },
      orderBy: { createdAt: "desc" },
      include: { user: { include: { wallets: true, subscription: true } } },
    })
  } catch (error) {
    console.error("[DB Error] Failed to get actions:", {
      error,
    })
    return []
  }
}

export async function dbCreateAction(action: NewAction) {
  try {
    return await prisma.action.create({
      data: {
        ..._.omit(action, "conversationId", "userId"),
        params: action.params as Prisma.JsonObject,
        user: {
          connect: {
            id: action.userId,
          },
        },
        conversation: {
          connect: {
            id: action.conversationId,
          },
        },
      },
    })
  } catch (error) {
    console.error("[DB Error] Failed to create action:", {
      error,
    })
    return undefined
  }
}

export async function dbCreateTokenStat({
  userId,
  messageIds,
  totalTokens,
  promptTokens,
  completionTokens,
}: {
  userId: string
  messageIds: string[]
  totalTokens: number
  promptTokens: number
  completionTokens: number
}) {
  try {
    return await prisma.tokenStat.create({
      data: {
        userId,
        messageIds,
        totalTokens,
        promptTokens,
        completionTokens,
      },
    })
  } catch (error) {
    console.error("[DB Error] Failed to create token stats:", {
      error,
    })
    return null
  }
}

export async function dbGetUserTelegramChat({ userId }: { userId: string }) {
  try {
    return await prisma.telegramChat.findUnique({
      where: { userId },
      select: { username: true, chatId: true },
    })
  } catch (error) {
    console.error("[DB Error] Failed to get user Telegram Chat:", {
      userId,
      error,
    })
    return null
  }
}

export async function dbUpdateUserTelegramChat({
  userId,
  username,
  chatId,
}: {
  userId: string
  username: string
  chatId?: string
}) {
  try {
    return await prisma.telegramChat.upsert({
      where: { userId },
      update: { username, chatId },
      create: { userId, username, chatId },
    })
  } catch (error) {
    console.error("[DB Error] Failed to update user Telegram Chat:", {
      userId,
      username,
      error: `${error}`,
    })
    return null
  }
}

export async function dbGetUserActions({ userId }: { userId: string }) {
  try {
    const actions = await prisma.action.findMany({
      where: {
        userId,
        completed: false,
      },
      orderBy: { createdAt: "desc" },
    })
    return actions
  } catch (error) {
    console.error("[DB Error] Failed to get user actions:", {
      userId,
      error,
    })
    return []
  }
}

export async function dbDeleteAction({
  id,
  userId,
}: {
  id: string
  userId: string
}) {
  try {
    return await prisma.action.delete({
      where: {
        id,
        userId,
      },
    })
  } catch (error) {
    console.error("[DB Error] Failed to delete action:", { id, userId, error })
    throw error
  }
}

export async function dbUpdateAction({
  id,
  userId,
  data,
}: {
  id: string
  userId: string
  data: Partial<Action>
}) {
  try {
    const validData = {
      name: data.name,
      description: data.description,
      frequency: data.frequency === 0 ? null : data.frequency,
      maxExecutions: data.maxExecutions === 0 ? null : data.maxExecutions,
    } as const

    return await prisma.action.update({
      where: {
        id,
        userId,
      },
      data: validData,
    })
  } catch (error) {
    console.error("[DB Error] Failed to update action:", { id, userId, error })
    return null
  }
}

export async function dbGetSavedPrompts({ userId }: { userId: string }) {
  try {
    const prompts = await prisma.savedPrompt.findMany({
      where: { userId },
      orderBy: [
        { isFavorite: "desc" },
        {
          lastUsedAt: {
            sort: "desc",
            nulls: "last",
          },
        },
      ],
    })
    return prompts
  } catch (error) {
    console.error("[DB Error] Failed to fetch Saved Prompt:", {
      userId,
      error,
    })
    return []
  }
}

export async function dbCreateSavedPrompt({
  userId,
  title,
  content,
}: {
  userId: string
  title: string
  content: string
}) {
  try {
    const prompt = await prisma.savedPrompt.create({
      data: {
        userId,
        title,
        content,
      },
    })
    return prompt
  } catch (error) {
    console.error("[DB Error] Failed to create Saved Prompt:", {
      userId,
      error,
    })
    return null
  }
}

export async function dbUpdateSavedPrompt({
  id,
  title,
  content,
}: {
  id: string
  title: string
  content: string
}) {
  try {
    return await prisma.savedPrompt.update({
      where: { id },
      data: { title, content, updatedAt: new Date() },
    })
  } catch (error) {
    console.error("[DB Error] Failed to update Saved Prompt:", {
      id,
      title,
      error,
    })
  }
}

export async function dbUpdateSavedPromptIsFavorite({
  id,
  isFavorite,
}: {
  id: string
  isFavorite: boolean
}) {
  try {
    return await prisma.savedPrompt.update({
      where: { id },
      data: { isFavorite },
    })
  } catch (error) {
    console.error("[DB Error] Failed to update status -isFavorite- of saved prompt:", {
      id,
      error,
    })
  }
}

export async function dbUpdateSavedPromptLastUsedAt({ id }: { id: string }) {
  try {
    const prompt = await prisma.savedPrompt.update({
      where: { id },
      data: {
        usageFrequency: {
          increment: 1,
        },
        lastUsedAt: new Date(),
      },
    })
    return prompt
  } catch (error) {
    console.error("[DB Error] Failed to update -lastUsedAt- of prompt:", {
      id,
      error,
    })
    return null
  }
}

export async function dbDeleteSavedPrompt({ id }: { id: string }) {
  try {
    const deletedPrompt = await prisma.savedPrompt.delete({
      where: { id },
    })

    return !!deletedPrompt
  } catch (error) {
    console.error("[DB Error] Failed to delete Saved Prompt:", {
      id,
    })

    return false
  }
}

