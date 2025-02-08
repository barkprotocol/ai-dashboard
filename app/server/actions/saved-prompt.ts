"use server"

import { z } from "zod"
import { type ActionResponse, actionClient } from "@/lib/safe-action"
import type { SavedPrompt } from "@prisma/client"
import prisma from "@/lib/prisma"
import { verifyUser } from "./user"

const createPromptSchema = z.object({
  name: z.string().min(1),
  prompt: z.string().min(1),
})

export const createSavedPrompt = actionClient
  .schema(createPromptSchema)
  .action<ActionResponse<SavedPrompt>>(async ({ parsedInput: { name, prompt } }) => {
    const authResult = await verifyUser()
    const userId = authResult?.data?.data?.id

    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    try {
      const newPrompt = await prisma.savedPrompt.create({
        data: {
          name,
          prompt,
          userId,
        },
      })

      return { success: true, data: newPrompt }
    } catch (error) {
      console.error("Error creating saved prompt:", error)
      return { success: false, error: "Failed to create saved prompt" }
    }
  })

export const getSavedPrompts = actionClient.action<ActionResponse<SavedPrompt[]>>(async () => {
  const authResult = await verifyUser()
  const userId = authResult?.data?.data?.id

  if (!userId) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    const prompts = await prisma.savedPrompt.findMany({
      where: {
        userId,
      },
    })

    return { success: true, data: prompts }
  } catch (error) {
    console.error("Error fetching saved prompts:", error)
    return { success: false, error: "Failed to fetch saved prompts" }
  }
})

export const deleteSavedPrompt = actionClient
  .schema(z.object({ promptId: z.string() }))
  .action<ActionResponse<boolean>>(async ({ parsedInput: { promptId } }) => {
    const authResult = await verifyUser()
    const userId = authResult?.data?.data?.id

    if (!userId) {
      return { success: false, error: "Unauthorized" }
    }

    try {
      const prompt = await prisma.savedPrompt.findFirst({
        where: {
          id: promptId,
          userId,
        },
      })

      if (!prompt) {
        return { success: false, error: "Prompt not found" }
      }

      await prisma.savedPrompt.delete({
        where: {
          id: promptId,
        },
      })

      return { success: true, data: true }
    } catch (error) {
      console.error("Error deleting saved prompt:", error)
      return { success: false, error: "Failed to delete saved prompt" }
    }
  })

