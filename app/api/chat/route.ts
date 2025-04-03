import { type NextRequest, NextResponse } from "next/server"
import { generateChatResponse } from "@/services/ai-service"
import { verifyUser } from "@/server/actions/user"
import { dbSaveConversation, dbSaveMessage } from "@/server/db/queries"

export async function POST(req: NextRequest) {
  try {
    // Verify user authentication
    const session = await verifyUser()
    const userId = session?.data?.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const { messages, model = "gpt-4o", functions, conversationId } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    // Generate AI response
    const response = await generateChatResponse(messages, model, functions)

    // Save conversation and messages to database
    let savedConversationId = conversationId

    if (!savedConversationId) {
      // Create new conversation if no ID provided
      const savedConversation = await dbSaveConversation({
        userId,
        title: messages[0]?.text?.substring(0, 50) || "New conversation",
      })
      savedConversationId = savedConversation.id
    }

    // Save user message
    const userMessage = messages[messages.length - 1]
    await dbSaveMessage({
      conversationId: savedConversationId,
      content: userMessage.text,
      role: "user",
    })

    // Save AI response
    await dbSaveMessage({
      conversationId: savedConversationId,
      content: response.text,
      role: "assistant",
    })

    return NextResponse.json({
      ...response,
      conversationId: savedConversationId,
    })
  } catch (error) {
    console.error("[chat/route] Error generating response:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}

