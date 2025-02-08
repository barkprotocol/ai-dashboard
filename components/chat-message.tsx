import type React from "react"
import type { Message } from "ai"
import { cn } from "@/lib/utils"
import { Brevity } from "@/components/brevity"

interface ChatMessageProps {
  message: Message
  isUser: boolean
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
  return (
    <div className={cn("flex w-full items-center", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn("rounded-lg px-4 py-2 max-w-[80%]", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}
      >
        <Brevity content={message.content} />
      </div>
    </div>
  )
}

export default ChatMessage

