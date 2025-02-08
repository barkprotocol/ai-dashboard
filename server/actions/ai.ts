import { z } from "zod"

import { defaultModel } from "../../ai/providers"
import { actionClient } from "../../lib/safe-action"
import { generateText } from "../../lib/utils/ai"
import { defaultTools } from "../../ai/providers"

export const aiAction = actionClient
  .schema(
    z.object({
      message: z.string(),
      conversationId: z.string().optional(),
      tools: z.array(z.string()).optional(),
    }),
  )
  .action(async ({ parsedInput: { message, conversationId, tools } }) => {
    try {
      const { text } = await generateText({
        model: defaultModel,
        system: `You are an AI assistant. Respond to the user's message.`,
        prompt: message,
        tools: tools || defaultTools,
      })

      return { success: true, data: { text } }
    } catch (error) {
      console.error("AI action error:", error)
      return { success: false, error: "AI_ERROR" }
    }
  })

