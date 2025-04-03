"use server"

import { validateEnvironment } from "@/lib/server/validate-env"
import { serverEnv } from "@/lib/env"

/**
 * Initialize the application with environment validation
 * This is called during application startup
 */
export async function initializeApp() {
  try {
    validateEnvironment()
    return { success: true }
  } catch (error) {
    console.error("Failed to initialize app:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Get AI model configuration for the client
 * This safely exposes only what the client needs to know
 */
export async function getAIModelConfig() {
  return {
    defaultModel: serverEnv.openaiModelName,
    availableModels: serverEnv.anthropicApiKey ? ["gpt-4o", "claude-3"] : ["gpt-4o"],
  }
}

