"use server"

import { z } from "zod"

import { type ActionResponse, actionClient } from "@/lib/safe-action"

import { verifyUser } from "./user"

// Mock conversation data
const mockConversations = [
  {
    id: "1",
    title: "Mock Conversation",
    lastReadAt: new Date(),
  },
]

export const markConversationAsRead = actionClient
  .schema(z.object({ id: z.string() }))
  .action<ActionResponse<any>>(async ({ parsedInput: { id } }) => {
    const authResult = await verifyUser()
    const userId = authResult?.data?.data?.id

    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    // Mock update conversation last read timestamp
    const updatedConversation = mockConversations.find((conv) => conv.id === id)
    if (updatedConversation) {
      updatedConversation.lastReadAt = new Date()
    }

    return { success: true }
  })

