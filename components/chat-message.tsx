import type React from "react"
import { Brevity } from "./brevity"

const ChatMessage: React.FC<{ message: string; isUser: boolean }> = ({ message, isUser }) => {
  return (
    <div className={`chat-message ${isUser ? "user" : "bot"}`}>
      <div className="message-content">
        <Brevity message={message} />
      </div>
    </div>
  )
}

export default ChatMessage

