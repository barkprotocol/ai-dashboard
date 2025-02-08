"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { type Message, useChat as useVercelChat } from "ai/react"
import { v4 as uuidv4 } from "uuid"

import { useUser } from "@/hooks/use-user"
import { useConversations } from "@/hooks/use-conversations"
import { useAction } from "@/hooks/use-action"

export function useChat() {
  const router = useRouter()
  const { user } = useUser()
  const { addConversation, removeConversation } = useConversations()
  const [conversationId, setConversationId] = useState<string | null>(null)
  const { dispatchAction } = useAction()

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
    append,
    reload,
    stop,
    setInput,
  } = useVercelChat({
    api: conversationId ? `/api/chat/${conversationId}` : "/api/chat",
    id: conversationId ?? undefined,
    body: { userId: user?.id },
    onResponse: (response) => {
      if (response.status === 401) {
        router.push("/login")
      }
    },
    onFinish: () => {
      if (!conversationId) {
        router.refresh()
      }
    },
  })

  const appendMessage = useCallback(
    (message: Message) => {
      append(message)
    },
    [append],
  )

  const startNewConversation = useCallback(() => {
    const newId = uuidv4()
    setConversationId(newId)
    setMessages([])
    addConversation({ id: newId, messages: [] })
    router.push(`/chat/${newId}`)
  }, [addConversation, router, setMessages])

  const deleteConversation = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/chat/${id}`, { method: "DELETE" })
        removeConversation(id)
        if (id === conversationId) {
          startNewConversation()
        }
      } catch (error) {
        console.error("Failed to delete conversation:", error)
      }
    },
    [conversationId, removeConversation, startNewConversation],
  )

  useEffect(() => {
    const currentPath = window.location.pathname
    const match = currentPath.match(/^\/chat\/(.+)/)
    if (match) {
      setConversationId(match[1])
    } else {
      startNewConversation()
    }
  }, [startNewConversation])

  const contextValue = {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    append: appendMessage,
    reload,
    stop,
    setInput,
    conversationId,
    startNewConversation,
    deleteConversation,
  }

  return contextValue
}

export type ChatContextType = ReturnType<typeof useChat>

