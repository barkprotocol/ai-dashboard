import React from "react"
import { ChatForm } from "@/components/chat/chat-form"

export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center">BARK | AI Chatbot</h1>
      <p className="mt-4 text-lg md:text-xl text-center text-muted-foreground">
        Welcome to the BARK AI Chatbot! Ask about Solana DeFi, trading strategies, or any other queries about BARK.
      </p>

      <section className="mt-8">
        <ChatForm />
      </section>
    </div>
  )
}
