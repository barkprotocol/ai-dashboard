"use client"

import { useState, useRef, useEffect } from "react"
import { ImageIcon, SendHorizontal, Link2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatSkeleton } from "@/components/chat-skeleton"
import { defaultSystemPrompt, defaultModel, openAiModel, claude35Sonnet, deepseekModel } from "@/lib/ai-config"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Message {
  role: "user" | "ai" | "system"
  content: string
}

interface AIModel {
  name: string
  model: typeof defaultModel
}

const aiModels: AIModel[] = [
  { name: "Default", model: defaultModel },
  { name: "OpenAI", model: openAiModel },
  { name: "Claude", model: claude35Sonnet },
  { name: "DeepSeek", model: deepseekModel },
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([{ role: "system", content: defaultSystemPrompt }])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<AIModel>(aiModels[0])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [scrollAreaRef]) //Fixed useEffect dependency

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await selectedModel.model.generateText({
        prompt: input,
        messages: messages,
      })

      const aiMessage: Message = { role: "ai", content: response.text }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error generating AI response:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = () => {
    // Implement image upload logic here
    console.log("Image upload clicked")
  }

  const handleLinkInsert = () => {
    // Implement link insert logic here
    console.log("Link insert clicked")
  }

  if (isLoading && messages.length === 1) {
    return <ChatSkeleton />
  }

  return (
    <div className="flex flex-col h-full bg-background border-l">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Chat Interface</h2>
          <p className="text-sm text-muted-foreground">
            Ask questions and get AI-powered responses about BARK and Solana DeFi
          </p>
        </div>
        <Select
          value={selectedModel.name}
          onValueChange={(value) => setSelectedModel(aiModels.find((model) => model.name === value) || aiModels[0])}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select AI Model" />
          </SelectTrigger>
          <SelectContent>
            {aiModels.map((model) => (
              <SelectItem key={model.name} value={model.name}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.slice(1).map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "ai" && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/ai-avatar.png" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg p-3 max-w-[70%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {message.content}
              </div>
              {message.role === "user" && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/user-avatar.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="animate-pulse">Thinking...</div>
            </div>
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-center space-x-2 bg-muted rounded-md p-2">
          <Input
            className="flex-1 bg-transparent border-none focus:ring-0"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleImageUpload}>
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleLinkInsert}>
            <Link2 className="h-5 w-5" />
          </Button>
          <Button type="submit" size="icon" className="h-8 w-8">
            <SendHorizontal className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  )
}

