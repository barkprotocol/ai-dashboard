import { type LanguageModelUsage, type Message, generateObject } from "ai"
import { z } from "zod"

import { orchestratorModel, orchestrationPrompt } from "@/ai/providers"
import { createSafeAction } from "@/lib/safe-action"

export const getToolsFromOrchestrator = createSafeAction(
  async (
    messages: Message[] | undefined,
    excludeConfirmationTool: boolean,
  ): Promise<{ usage: LanguageModelUsage; toolsRequired: string[] | undefined }> => {
    const system = excludeConfirmationTool
      ? orchestrationPrompt.replace(/(requires confirmation)/g, "")
      : orchestrationPrompt

    const { object: toolsRequired, usage } = await generateObject({
      model: orchestratorModel,
      system,
      output: "array",
      schema: z.string().describe("The tool name, describing the tool needed to handle the user request."),
      experimental_telemetry: {
        isEnabled: true,
        functionId: "generate-object",
      },
      messages,
    })

    if (toolsRequired.length === 0) {
      return { usage, toolsRequired: undefined }
    } else {
      const allTools = new Set(["searchToken", ...toolsRequired])
      const filteredTools = [...allTools].filter((tool) => tool !== "askForConfirmation" || !excludeConfirmationTool)
      return {
        usage,
        toolsRequired: filteredTools,
      }
    }
  },
)

