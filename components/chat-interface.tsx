"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import type { Message } from "ai"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { useChat } from "@/hooks/use-chat"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ChatMessage from "@/components/chat-message"
import EmptyScreen from "@/components/empty-screen"
import ChatScrollAnchor from "@/components/chat-scroll-anchor"
import { useAction } from "@/hooks/use-action"
import { useConversations } from "@/hooks/use-conversations"
import SavedPromptsMenu from "@/components/saved-prompts-menu"

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[]
  id?: string
}

export function ChatInterface({ id, initialMessages, className }: ChatProps) {
  const router = useRouter()
  const { user } = useUser()
  const { dispatchAction } = useAction()
  const { conversations, refreshConversations } = useConversations()
  const [attachments, setAttachments] = useState<File[]>([])

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    reload,
    stop,
    isLoading,
    setInput,
    conversationId,
    startNewConversation,
  } = useChat()

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isTyping, setIsTyping] = useState<boolean>(false)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (id && !conversationId) {
      startNewConversation()
    }
  }, [id, conversationId, startNewConversation])

  useEffect(() => {
    if (initialMessages) {
      initialMessages.forEach((message) => append(message))
    }
  }, [append, initialMessages])

  const onSubmit = useCallback(
    async (value: string) => {
      if (!user) {
        toast.error("Please sign in to send messages")
        return
      }

      if (!value || value.trim() === "") {
        toast.error("Please enter a message")
        return
      }

      const attachmentUrls = await Promise.all(
        attachments.map(async (file) => {
          const formData = new FormData()
          formData.append("file", file)
          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })
          if (!response.ok) {
            throw new Error("Failed to upload file")
          }
          const data = await response.json()
          return data.url
        }),
      )

      const newMessage: Message = {
        id: Date.now().toString(),
        content: value,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      if (attachmentUrls.length > 0) {
        newMessage.attachments = attachmentUrls.map((url) => ({
          url,
          type: "image/png",
        }))
      }

      append(newMessage)

      setInput("")
      setAttachments([])

      await handleSubmit(newMessage)
      refreshConversations()
    },
    [user, attachments, append, setInput, handleSubmit, refreshConversations],
  )

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments(Array.from(event.target.files))
    }
  }, [])

  return (
    <>
      <div className={cn("pb-[200px] pt-4 md:pt-10", className)}>
        {messages.length ? (
          <>
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} isUser={message.role === "user"} />
            ))}
            <ChatScrollAnchor />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
        <div className="mx-auto sm:max-w-2xl sm:px-4">
          <div className="flex h-10 items-center justify-center">
            {isTyping ? (
              <p className="text-xs text-muted-foreground">AI Agent is typing...</p>
            ) : (
              <p className="text-xs text-muted-foreground">AI Agent is ready</p>
            )}
          </div>
          <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
            <SavedPromptsMenu
              onPromptSelect={(prompt) => {
                setInput(prompt.content)
                inputRef.current?.focus()
              }}
            />
            <form
              onSubmit={(e) => {
                e.preventDefault()
                onSubmit(input)
              }}
            >
              <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
                <Textarea
                  ref={inputRef}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      onSubmit(input)
                    }
                  }}
                  rows={1}
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Send a message."
                  spellCheck={false}
                  className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
                />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    multiple
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-sm text-muted-foreground hover:text-primary"
                  >
                    Attach files
                  </label>
                  {attachments.length > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">{attachments.length} file(s) selected</span>
                  )}
                </div>
                <Button type="submit" size="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="h-4 w-4"
                    strokeWidth="2"
                  >
                    <path
                      d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

