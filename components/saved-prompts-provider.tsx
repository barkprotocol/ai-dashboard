"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface SavedPrompt {
  id: string
  title: string
  content: string
}

interface SavedPromptsContextType {
  savedPrompts: SavedPrompt[]
  setSavedPrompts: (prompts: SavedPrompt[]) => void
  addPrompt: (title: string, content: string) => void
  deletePrompt: (id: string) => void
}

const SavedPromptsContext = createContext<SavedPromptsContextType | undefined>(undefined)

interface SavedPromptsProviderProps {
  children: ReactNode
}

export function SavedPromptsProvider({ children }: SavedPromptsProviderProps) {
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([])

  const addPrompt = (title: string, content: string) => {
    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      title,
      content,
    }
    setSavedPrompts((prev) => [...prev, newPrompt])
  }

  const deletePrompt = (id: string) => {
    setSavedPrompts((prev) => prev.filter((prompt) => prompt.id !== id))
  }

  return (
    <SavedPromptsContext.Provider
      value={{
        savedPrompts,
        setSavedPrompts,
        addPrompt,
        deletePrompt,
      }}
    >
      {children}
    </SavedPromptsContext.Provider>
  )
}

export function useSavedPrompts() {
  const context = useContext(SavedPromptsContext)
  if (context === undefined) {
    throw new Error("useSavedPrompts must be used within a SavedPromptsProvider")
  }
  return context
}

