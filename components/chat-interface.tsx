"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { type Message, experimental_useAssistant as useAssistant } from "ai/react"
import { AlertCircle, ArrowRight, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"
import { ActionEmitter } from "@/components/action-emitter"
import { ConversationInput } from "@/components/conversation-input"
import { SavedPromptsModal } from "@/components/saved-prompts-modal"
import { SavedPromptsProvider } from "@/components/saved-prompts-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { MessageContent } from "@/components/message/message-content"
import { ToolResult } from "@/components/message/tool-result"
import { WalletPortfolio } from "@/components/message/wallet-portfolio"

interface ChatInterfaceProps {
  id?: string
}

export function ChatInterface({ id }: ChatInterfaceProps) {
  const router = useRouter()
  const { user } = useUser()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [savedPrompts, setSavedPrompts] = useState([])
  const [isSavedPromptsModalOpen, setIsSavedPromptsModalOpen] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, data } = useAssistant({
    api: `/api/chat/${id}`,
    initialMessages: [],
    id,
    onResponse: (response) => {
      if (response.status === 401) {
        toast.error("Unauthorized. Please log in.")
        router.push("/login")
      }
    },
    onFinish: (message) => {
      if (!id && message.id) {
        router.push(`/chat/${message.id}`)
      }
    },
  })

  const handleNewChat = useCallback(() => {
    router.push("/chat")
  }, [router])

  const handleDeleteChat = useCallback(async () => {
    if (!id) return

    try {
      const response = await fetch(`/api/chat/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete chat")
      }

      router.push("/chat")
      toast.success("Chat deleted successfully")
    } catch (error) {
      console.error("Error deleting chat:", error)
      toast.error("Failed to delete chat")
    }
  }, [id, router])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [scrollAreaRef])

  return (
    <SavedPromptsProvider>
      <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="mx-auto max-w-3xl">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <h2 className="mb-4 text-2xl font-bold">Welcome to AI Trading Assistant</h2>
                    <p className="mb-4 text-muted-foreground">Start a conversation by typing a message below.</p>
                  </div>
                </div>
              ) : (
                messages.map((message: Message, index: number) => (
                  <div
                    key={index}
                    className={cn("mb-4 flex", {
                      "justify-end": message.role === "user",
                    })}
                  >
                    <div
                      className={cn("flex max-w-[80%] items-end", {
                        "flex-row-reverse": message.role === "user",
                      })}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={message.role === "user" ? user?.image || "/placeholder.svg" : "/ai-avatar.png"}
                          alt={message.role === "user" ? "User Avatar" : "AI Avatar"}
                        />
                        <AvatarFallback>{message.role === "user" ? "U" : "AI"}</AvatarFallback>
                      </Avatar>
                      <div
                        className={cn("mx-2 rounded-lg px-4 py-2", {
                          "bg-primary text-primary-foreground": message.role === "user",
                          "bg-muted": message.role !== "user",
                        })}
                      >
                        <MessageContent content={message.content} />
                        {message.toolResults?.map((result, index) => (
                          <ToolResult key={index} result={result} />
                        ))}
                        {message.walletPortfolio && <WalletPortfolio portfolio={message.walletPortfolio} />}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="mb-4 flex">
                  <div className="flex max-w-[80%] items-end">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/ai-avatar.png" alt="AI Avatar" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="mx-2 rounded-lg bg-muted px-4 py-2">
                      <TypingAnimation />
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="mb-4 flex items-center justify-center">
                  <AlertCircle className="mr-2 h-4 w-4 text-destructive" />
                  <p className="text-sm text-destructive">An error occurred. Please try again.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="border-t p-4">
          <div className="mx-auto max-w-3xl">
            <ConversationInput
              value={input}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              onChat={true}
              savedPrompts={savedPrompts}
              setSavedPrompts={setSavedPrompts}
            />
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={handleNewChat}>
                New Chat
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              {id && (
                <Button variant="outline" onClick={handleDeleteChat}>
                  Delete Chat
                  <Trash2 className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsSavedPromptsModalOpen(true)}>
                Saved Prompts
              </Button>
            </div>
          </div>
        </div>
      </div>
      <SavedPromptsModal
        isOpen={isSavedPromptsModalOpen}
        onClose={() => setIsSavedPromptsModalOpen(false)}
        savedPrompts={savedPrompts}
        setSavedPrompts={setSavedPrompts}
      />
      <ActionEmitter />
    </SavedPromptsProvider>
  )
}

