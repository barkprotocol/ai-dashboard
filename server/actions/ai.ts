"use server"

import { revalidatePath } from "next/cache"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { deepseek } from "@ai-sdk/deepseek"

export async function generateAIResponse(prompt: string, model: string) {
  try {
    let aiModel

    switch (model) {
      case "gpt-4o":
        aiModel = openai("gpt-4o")
        break
      case "claude-3-opus":
        aiModel = anthropic("claude-3-opus")
        break
      case "deepseek-coder":
        aiModel = deepseek("deepseek-coder")
        break
      default:
        aiModel = openai("gpt-4o")
    }

    const { text } = await generateText({
      model: aiModel,
      prompt: prompt,
      maxTokens: 2000,
    })

    // Save to database in a real implementation

    return { success: true, text }
  } catch (error) {
    console.error("AI generation error:", error)
    return {
      success: false,
      error: "Failed to generate AI response. Please try again.",
    }
  }
}

export async function saveConversation(conversationId: string, messages: any[]) {
  try {
    // In a real implementation, this would save to a database
    console.log(`Saving conversation ${conversationId} with ${messages.length} messages`)

    // Revalidate the history page
    revalidatePath("/history")

    return { success: true }
  } catch (error) {
    console.error("Error saving conversation:", error)
    return {
      success: false,
      error: "Failed to save conversation. Please try again.",
    }
  }
}

export async function getModelUsage(userId: string) {
  try {
    // In a real implementation, this would fetch from a database
    return {
      success: true,
      usage: [
        {
          model: "gpt-4o",
          tokens: 10000,
          cost: 0.25,
          lastUsed: new Date(2023, 3, 28),
        },
        {
          model: "claude-3-opus",
          tokens: 12000,
          cost: 0.3,
          lastUsed: new Date(2023, 3, 27),
        },
        {
          model: "deepseek-coder",
          tokens: 7500,
          cost: 0.15,
          lastUsed: new Date(2023, 3, 26),
        },
      ],
    }
  } catch (error) {
    console.error("Error fetching model usage:", error)
    return {
      success: false,
      error: "Failed to fetch model usage. Please try again.",
    }
  }
}

export async function getConversationHistory(userId: string, limit = 10) {
  try {
    // In a real implementation, this would fetch from a database
    return {
      success: true,
      conversations: Array(limit)
        .fill(null)
        .map((_, i) => ({
          id: `conv-${i}`,
          title: `Conversation ${i + 1}`,
          date: new Date(Date.now() - i * 86400000),
          model: ["gpt-4o", "claude-3-opus", "deepseek-coder"][i % 3],
          tokens: Math.floor(Math.random() * 2000) + 500,
          tags: ["blockchain", "defi", "nft", "solana", "token"][Math.floor(Math.random() * 5)].split(),
          preview: "This is a preview of the conversation...",
        })),
    }
  } catch (error) {
    console.error("Error fetching conversation history:", error)
    return {
      success: false,
      error: "Failed to fetch conversation history. Please try again.",
    }
  }
}

