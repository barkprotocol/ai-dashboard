import { ChatInterface } from "@/components/chat-interface"

export default function ChatPage({ params }: { params: { conversationId?: string } }) {
  return (
    <div className="flex h-full">
      <div className="flex-1">
        <ChatInterface conversationId={params.conversationId} />
      </div>
    </div>
  )
}
