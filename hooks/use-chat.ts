"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Message as AIMessage } from "ai"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

import { generateChatResponse, searchToken } from "@/app/actions/chat"
import { useUser } from "@/hooks/use-user"

interface Message extends AIMessage {
  attachments?: Attachment[]
}

interface Attachment {
  url: string
  name: string
  contentType: string
}

interface UseChatOptions {
  initialMessages?: Message[]
  onResponse?: (response: Message) => void | Promise<void>
  onFinish?: (message: Message) => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export function useChat({ initialMessages = [], onResponse, onFinish, onError }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()
  const router = useRouter()
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const append = useCallback(
    async (message: Message) => {
      if (!user) {
        router.push("/login")
        return
      }

      setIsLoading(true)
      setError(null)

      const newMessages = [...messages, message]
      setMessages(newMessages)

      try {
        // Handle token search if message starts with /search
        if (message.content.startsWith("/search")) {
          const query = message.content.replace("/search", "").trim()
          const result = await searchToken({ query })

          if (!result.success) {
            throw new Error(result.error || "Failed to search token")
          }

          // Format token search results
          const formattedResponse = formatTokenSearchResults(result.data)
          setMessages([
            ...newMessages,
            {
              id: uuidv4(),
              role: "assistant",
              content: formattedResponse,
            },
          ])
          return
        }

        // Regular chat response
        const result = await generateChatResponse({
          messages: newMessages,
        })

        if (!result.success || !result.data) {
          throw new Error(result.error || "Failed to generate response")
        }

        const response = result.data
        setMessages([...newMessages, response])

        if (onResponse) {
          await onResponse(response)
        }

        if (onFinish) {
          await onFinish(response)
        }
      } catch (err) {
        const error = err as Error
        setError(error.message)
        if (onError) {
          await onError(error)
        }
      } finally {
        setIsLoading(false)
      }
    },
    [messages, onResponse, onFinish, onError, router, user],
  )

  const reload = useCallback(async () => {
    if (messages.length === 0) return

    const lastUserMessage = messages[messages.length - 1]
    if (lastUserMessage.role !== "user") return

    // Remove last assistant message if it exists
    const newMessages =
      messages[messages.length - 2]?.role === "assistant" ? messages.slice(0, -2) : messages.slice(0, -1)

    setMessages(newMessages)
    await append(lastUserMessage)
  }, [append, messages])

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  const clear = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    append,
    reload,
    stop,
    clear,
    isLoading,
    error,
  }
}

function formatTokenSearchResults(data: any) {
  let response = "Here are the search results:\n\n"

  // Format DexScreener results
  if (data.dexScreener?.length) {
    response += "**DexScreener Pairs:**\n"
    data.dexScreener.forEach((pair: any) => {
      response += `- ${pair.baseToken.symbol}/${pair.quoteToken.symbol}\n`
      response += `  Price: $${pair.priceUsd}\n`
      response += `  24h Volume: $${Math.round(pair.volume.h24).toLocaleString()}\n`
      response += `  Market Cap: $${Math.round(pair.marketCap).toLocaleString()}\n\n`
    })
  }

  // Format Defined.fi results
  if (data.definedFi?.length) {
    response += "**Defined.fi Tokens:**\n"
    data.definedFi.forEach((token: any) => {
      response += `- ${token.token.name} (${token.token.symbol})\n`
      response += `  Price: $${Number.parseFloat(token.priceUSD).toFixed(6)}\n`
      response += `  24h Volume: $${Math.round(Number.parseFloat(token.volume24)).toLocaleString()}\n`
      response += `  Market Cap: $${Math.round(Number.parseFloat(token.marketCap)).toLocaleString()}\n\n`
    })
  }

  // Format portfolio data if available
  if (data.portfolio) {
    response += "**Wallet Portfolio:**\n"
    response += `Total Balance: $${data.portfolio.totalBalance.toLocaleString()}\n`
    response += "Top Tokens:\n"
    data.portfolio.tokens.slice(0, 5).forEach((token: any) => {
      response += `- ${token.symbol}: ${token.balance.toFixed(4)} ($${(
        token.balance * token.pricePerToken
      ).toLocaleString()})\n`
    })
  }

  return response
}

