import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const { messages, userId } = await req.json()

    // Fetch user data from Supabase
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()

    if (userError) {
      throw new Error("Error fetching user data")
    }

    // Prepare the messages for the AI, including user context
    const aiMessages = [
      { role: "system", content: "You are a helpful AI assistant." },
      { role: "system", content: `User context: ${JSON.stringify(userData)}` },
      ...messages,
    ]

    // Create a chat completion stream
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: aiMessages as OpenAI.Chat.ChatCompletionMessage[],
      stream: true,
    })

    // Convert the response into a friendly stream
    const stream = OpenAIStream(response)

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Orchestrator error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
