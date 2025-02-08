import { OpenAIStream, StreamingTextResponse } from "ai"
import { Configuration, OpenAIApi } from "openai-edge"
import { NextResponse } from "next/server"

import { defaultModel, defaultSystemPrompt } from "@/ai/providers"
import { verifyUser } from "@/app/api/user/route"
import prisma from "@/lib/prisma"
import { dbCreateMessages, dbGetConversation } from "@/server/db/queries"
import type { Message } from "@prisma/client"

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

export const runtime = "edge"

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, conversationId } = json

  const result = await verifyUser(req)
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 401 })
  }
  const userId = result.user.id

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let conversation = await dbGetConversation({ conversationId })

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        userId,
      },
    })
  }

  const prompt = messages[messages.length - 1].content

  const response = await openai.createChatCompletion({
    model: defaultModel as unknown as string,
    stream: true,
    messages: [
      {
        role: "system",
        content: defaultSystemPrompt,
      },
      ...messages,
    ],
  })

  const stream = OpenAIStream(response, {
    async onCompletion(completion: any) {
      const dbMessages: Message[] = [
        {
          conversationId: conversation!.id,
          role: "user",
          content: prompt,
        },
        {
          conversationId: conversation!.id,
          role: "assistant",
          content: completion,
        },
      ]
      await dbCreateMessages({ messages: dbMessages })
    },
  })

  return new StreamingTextResponse(stream)
}

