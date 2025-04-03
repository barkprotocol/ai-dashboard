import type { SuggestedPrompt } from "@/types/chat"

// In a real app, this would use localStorage or an API
const STORAGE_KEY = "bark-ai-saved-prompts"

export async function getSavedPrompts(): Promise<SuggestedPrompt[]> {
  // In a real app, this would call an API endpoint or use localStorage
  // For now, we'll simulate storage
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        if (typeof window !== "undefined") {
          const saved = localStorage.getItem(STORAGE_KEY)
          if (saved) {
            resolve(JSON.parse(saved))
            return
          }
        }
        resolve([])
      } catch (error) {
        console.error("Error loading saved prompts:", error)
        resolve([])
      }
    }, 100)
  })
}

export async function savePrompt(prompt: SuggestedPrompt): Promise<void> {
  // In a real app, this would call an API endpoint or use localStorage
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (typeof window !== "undefined") {
          const saved = localStorage.getItem(STORAGE_KEY)
          const prompts = saved ? JSON.parse(saved) : []

          // Check if prompt already exists
          const exists = prompts.some((p: SuggestedPrompt) => p.id === prompt.id)
          if (!exists) {
            prompts.push(prompt)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
          }

          resolve()
        } else {
          resolve()
        }
      } catch (error) {
        console.error("Error saving prompt:", error)
        reject(error)
      }
    }, 100)
  })
}

export async function deletePrompt(id: string): Promise<void> {
  // In a real app, this would call an API endpoint or use localStorage
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (typeof window !== "undefined") {
          const saved = localStorage.getItem(STORAGE_KEY)
          if (saved) {
            const prompts = JSON.parse(saved)
            const filtered = prompts.filter((p: SuggestedPrompt) => p.id !== id)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
          }

          resolve()
        } else {
          resolve()
        }
      } catch (error) {
        console.error("Error deleting prompt:", error)
        reject(error)
      }
    }, 100)
  })
}

