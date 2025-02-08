import { convertToUIMessages } from "@/lib/utils"
import type { NewAction } from "@/types/db"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Mock data
const mockUsers = [
  { id: "1", name: "User 1", email: "user1@example.com" },
  { id: "2", name: "User 2", email: "user2@example.com" },
]

const mockConversations = [
  { id: "1", title: "Conversation 1", userId: "1" },
  { id: "2", title: "Conversation 2", userId: "1" },
]

// Mock data structures
let mockMessages: Message[] = []
const mockActions: Action[] = []
const mockTokenStats: TokenStat[] = []
const mockTelegramChats: TelegramChat[] = []
const mockSavedPrompts: SavedPrompt[] = []

// Helper function to simulate database errors
const simulateDbError = (chance = 0.1) => {
  if (Math.random() < chance) {
    throw new Error("Simulated database error")
  }
}

/**
 * Retrieves a conversation by its ID
 * @param {Object} params - The parameters object
 * @param {string} params.conversationId - The unique identifier of the conversation
 * @returns {Promise<Conversation | null>} The conversation object or null if not found/error occurs
 */
export async function dbGetConversation({
  conversationId,
  includeMessages,
  isServer,
}: {
  conversationId: string
  includeMessages?: boolean
  isServer?: boolean
}): Promise<Conversation | null> {
  try {
    simulateDbError()
    const conversation = mockConversations.find((c) => c.id === conversationId)
    if (conversation && includeMessages) {
      conversation.messages = mockMessages.filter((m) => m.conversationId === conversationId)
    }
    return conversation || null
  } catch (error) {
    console.error("[DB Error] Failed to get conversation:", error)
    return null
  }
}

/**
 * Creates a new conversation
 * @param {Object} params - The parameters object
 * @param {string} params.conversationId - The unique identifier for the new conversation
 * @param {string} params.userId - The user who owns the conversation
 * @param {string} params.title - The title of the conversation
 * @returns {Promise<Conversation | null>} The created conversation or null if creation fails
 */
export async function dbCreateConversation({
  conversationId,
  userId,
  title,
}: {
  conversationId: string
  userId: string
  title: string
}): Promise<Conversation | null> {
  try {
    simulateDbError()
    const newConversation: Conversation = {
      id: conversationId,
      userId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockConversations.push(newConversation)
    return newConversation
  } catch (error) {
    console.error("[DB Error] Failed to create conversation:", error)
    return null
  }
}

/**
 * Creates multiple messages in bulk
 * @param {Object} params - The parameters object
 * @param {Array<Omit<Message, 'id' | 'createdAt'>>} params.messages - Array of message objects to create
 * @returns {Promise<{ count: number } | null>} The result of the bulk creation or null if it fails
 */
export async function dbCreateMessages({
  messages,
}: {
  messages: Omit<Message, "id" | "createdAt">[]
}): Promise<{ count: number } | null> {
  try {
    simulateDbError()
    const newMessages = messages.map((message) => ({
      ...message,
      id: `msg_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }))
    mockMessages.push(...newMessages)
    return { count: newMessages.length }
  } catch (error) {
    console.error("[DB Error] Failed to create messages:", error)
    return null
  }
}

/**
 * Updates the toolInvocations for a message
 */
export async function dbUpdateMessageToolInvocations({
  messageId,
  toolInvocations,
}: {
  messageId: string
  toolInvocations: JsonValue
}): Promise<Message | null> {
  try {
    simulateDbError()
    const message = mockMessages.find((m) => m.id === messageId)
    if (message) {
      message.toolInvocations = toolInvocations
      return message
    }
    return null
  } catch (error) {
    console.error("[DB Error] Failed to update message tool invocations:", error)
    return null
  }
}

/**
 * Retrieves all messages for a specific conversation
 * @param {Object} params - The parameters object
 * @param {string} params.conversationId - The conversation ID to fetch messages for
 * @returns {Promise<Message[] | null>} Array of messages or null if query fails
 */
export async function dbGetConversationMessages({
  conversationId,
  limit,
  isServer,
}: {
  conversationId: string
  limit?: number
  isServer?: boolean
}): Promise<Message[] | null> {
  try {
    simulateDbError()
    let messages = mockMessages.filter((m) => m.conversationId === conversationId)
    if (limit) {
      messages = messages.slice(-limit)
    }
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
    console.error("[DB Error] Failed to get conversation messages:", error)
    return null
  }
}

/**
 * Deletes a conversation and all its associated messages
 * @param {Object} params - The parameters object
 * @param {string} params.conversationId - The ID of the conversation to delete
 * @param {string} params.userId - The user ID who owns the conversation
 * @returns {Promise<void>}
 */
export async function dbDeleteConversation({
  conversationId,
  userId,
}: {
  conversationId: string
  userId: string
}): Promise<void> {
  try {
    simulateDbError()
    const index = mockConversations.findIndex((c) => c.id === conversationId && c.userId === userId)
    if (index !== -1) {
      mockConversations.splice(index, 1)
      mockMessages = mockMessages.filter((m) => m.conversationId !== conversationId)
    }
  } catch (error) {
    console.error("[DB Error] Failed to delete conversation:", error)
  }
}

/**
 * Retrieves all conversations for a specific user
 * @param {Object} params - The parameters object
 * @param {string} params.userId - The ID of the user
 * @returns {Promise<Conversation[]>} Array of conversations
 */
export async function dbGetConversations({ userId }: { userId: string }): Promise<Conversation[]> {
  try {
    simulateDbError()
    return mockConversations.filter((c) => c.userId === userId)
  } catch (error) {
    console.error("[DB Error] Failed to get user conversations:", error)
    return []
  }
}

/**
 * Retrieves all actions that match the specified filters
 * @param {Object} params - The parameters object
 * @param {boolean} params.triggered - Boolean to filter triggered actions
 * @param {boolean} params.paused - Boolean to filter paused actions
 * @param {boolean} params.completed - Boolean to filter completed actions
 * @param {number} params.frequency - The frequency of the action
 * @returns {Promise<Action[]>} Array of actions
 */
export async function dbGetActions({
  triggered = true,
  paused = false,
  completed = false,
}: {
  triggered: boolean
  paused: boolean
  completed: boolean
}): Promise<Action[]> {
  try {
    simulateDbError()
    return mockActions.filter((a) => a.triggered === triggered && a.paused === paused && a.completed === completed)
  } catch (error) {
    console.error("[DB Error] Failed to get actions:", error)
    return []
  }
}

export async function dbCreateAction(action: NewAction): Promise<Action | undefined> {
  try {
    simulateDbError()
    const newAction: Action = {
      ...action,
      id: `action_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockActions.push(newAction)
    return newAction
  } catch (error) {
    console.error("[DB Error] Failed to create action:", error)
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
}): Promise<TokenStat | null> {
  try {
    simulateDbError()
    const newTokenStat: TokenStat = {
      id: `tokenstat_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      messageIds,
      totalTokens,
      promptTokens,
      completionTokens,
      createdAt: new Date(),
    }
    mockTokenStats.push(newTokenStat)
    return newTokenStat
  } catch (error) {
    console.error("[DB Error] Failed to create token stats:", error)
    return null
  }
}

/**
 * Retrieves the Telegram ID for a user
 */
export async function dbGetUserTelegramChat({ userId }: { userId: string }): Promise<TelegramChat | null> {
  try {
    simulateDbError()
    return mockTelegramChats.find((chat) => chat.userId === userId) || null
  } catch (error) {
    console.error("[DB Error] Failed to get user Telegram Chat:", error)
    return null
  }
}

/**
 * Updates the Telegram Chat for a user
 */
export async function dbUpdateUserTelegramChat({
  userId,
  username,
  chatId,
}: {
  userId: string
  username: string
  chatId?: string
}): Promise<TelegramChat | null> {
  try {
    simulateDbError()
    let chat = mockTelegramChats.find((c) => c.userId === userId)
    if (chat) {
      chat.username = username
      chat.chatId = chatId
    } else {
      chat = { userId, username, chatId }
      mockTelegramChats.push(chat)
    }
    return chat
  } catch (error) {
    console.error("[DB Error] Failed to update user Telegram Chat:", error)
    return null
  }
}

export async function dbGetUserActions({ userId }: { userId: string }): Promise<Action[]> {
  try {
    simulateDbError()
    return mockActions.filter((action) => action.userId === userId)
  } catch (error) {
    console.error("[DB Error] Failed to get user actions:", error)
    return []
  }
}

export async function dbDeleteAction({
  id,
  userId,
}: {
  id: string
  userId: string
}): Promise<void> {
  try {
    simulateDbError()
    const index = mockActions.findIndex((a) => a.id === id && a.userId === userId)
    if (index !== -1) {
      mockActions.splice(index, 1)
    }
  } catch (error) {
    console.error("[DB Error] Failed to delete action:", error)
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
}): Promise<Action | null> {
  try {
    simulateDbError()
    const action = mockActions.find((a) => a.id === id && a.userId === userId)
    if (action) {
      Object.assign(action, data)
      action.updatedAt = new Date()
      return action
    }
    return null
  } catch (error) {
    console.error("[DB Error] Failed to update action:", error)
    return null
  }
}

/**
 * Retrieves the Saved Prompts for a user
 */
export async function dbGetSavedPrompts({ userId }: { userId: string }): Promise<SavedPrompt[]> {
  try {
    simulateDbError()
    return mockSavedPrompts.filter((prompt) => prompt.userId === userId)
  } catch (error) {
    console.error("[DB Error] Failed to fetch Saved Prompts:", error)
    return []
  }
}

/**
 * Creates a Saved Prompt for a user
 */
export async function dbCreateSavedPrompt({
  userId,
  title,
  content,
}: {
  userId: string
  title: string
  content: string
}): Promise<SavedPrompt | null> {
  try {
    simulateDbError()
    const newPrompt: SavedPrompt = {
      id: `prompt_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false,
      lastUsedAt: null,
      usageFrequency: 0,
    }
    mockSavedPrompts.push(newPrompt)
    return newPrompt
  } catch (error) {
    console.error("[DB Error] Failed to create Saved Prompt:", error)
    return null
  }
}

/**
 * Updates a Saved Prompt for a user
 */
export async function dbUpdateSavedPrompt({
  id,
  title,
  content,
}: {
  id: string
  title: string
  content: string
}): Promise<SavedPrompt | null> {
  try {
    simulateDbError()
    const prompt = mockSavedPrompts.find((p) => p.id === id)
    if (prompt) {
      prompt.title = title
      prompt.content = content
      prompt.updatedAt = new Date()
      return prompt
    }
    return null
  } catch (error) {
    console.error("[DB Error] Failed to update Saved Prompt:", error)
    return null
  }
}

/**
 * Updates status 'isFavorite' of saved prompt for a user
 */
export async function dbUpdateSavedPromptIsFavorite({
  id,
  isFavorite,
}: {
  id: string
  isFavorite: boolean
}): Promise<SavedPrompt | null> {
  try {
    simulateDbError()
    const prompt = mockSavedPrompts.find((p) => p.id === id)
    if (prompt) {
      prompt.isFavorite = isFavorite
      return prompt
    }
    return null
  } catch (error) {
    console.error("[DB Error] Failed to update status -isFavorite- of saved prompt:", error)
    return null
  }
}

/**
 * Updates status 'lastUsedAt' of saved prompt for a user
 */
export async function dbUpdateSavedPromptLastUsedAt({ id }: { id: string }): Promise<SavedPrompt | null> {
  try {
    simulateDbError()
    const prompt = mockSavedPrompts.find((p) => p.id === id)
    if (prompt) {
      prompt.lastUsedAt = new Date()
      prompt.usageFrequency += 1
      return prompt
    }
    return null
  } catch (error) {
    console.error("[DB Error] Failed to update -lastUsedAt- of prompt:", error)
    return null
  }
}

/**
 * Deletes a Saved Prompt for a user
 */
export async function dbDeleteSavedPrompt({ id }: { id: string }): Promise<boolean> {
  try {
    simulateDbError()
    const index = mockSavedPrompts.findIndex((p) => p.id === id)
    if (index !== -1) {
      mockSavedPrompts.splice(index, 1)
      return true
    }
    return false
  } catch (error) {
    console.error("[DB Error] Failed to delete Saved Prompt:", error)
    return false
  }
}

// Type definitions (these should match your actual types)
type Conversation = {
  id: string
  userId: string
  title: string
  createdAt: Date
  updatedAt: Date
  messages?: Message[]
}

type Message = {
  id: string
  conversationId: string
  createdAt: Date
  role: string
  content: string
  toolInvocations: any[]
  experimental_attachments: any[]
}

type Action = {
  id: string
  userId: string
  triggered: boolean
  paused: boolean
  completed: boolean
  createdAt: Date
  updatedAt: Date
  // Add other necessary fields
}

type TokenStat = {
  id: string
  userId: string
  messageIds: string[]
  totalTokens: number
  promptTokens: number
  completionTokens: number
  createdAt: Date
}

type TelegramChat = {
  userId: string
  username: string
  chatId?: string
}

type SavedPrompt = {
  id: string
  userId: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  isFavorite: boolean
  lastUsedAt: Date | null
  usageFrequency: number
}

type User = {
  id: string
  name: string
  email: string
}

// Export types if needed
export type { Conversation, Message, Action, TokenStat, TelegramChat, SavedPrompt, User }

type JsonValue = any // Replace 'any' with the actual type of JsonValue if known.  This is a guess.

export async function getUser(userId: string) {
  return mockUsers.find((user) => user.id === userId)
}

export async function getConversations(userId: string) {
  return mockConversations.filter((conv) => conv.userId === userId)
}

// Add more mock query functions as needed

