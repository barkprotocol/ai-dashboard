import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { Message } from "@/types/chat"
import { getTokenBalances, getSolBalance, getSolPrice } from "./solana-service"
import { serverEnv } from "@/lib/env"

interface SolanaContext {
  walletAddress?: string
  solBalance?: number
  tokenBalances?: Record<string, number>
  solPrice?: number
}

/**
 * Generate a chat response with Solana context
 */
export async function generateSolanaAwareResponse(
  messages: Message[],
  modelId: string,
  walletAddress?: string,
): Promise<{ text: string; isCode?: boolean }> {
  try {
    // Get Solana context if wallet is connected
    let solanaContext: SolanaContext = {}

    if (walletAddress) {
      try {
        const [solBalance, tokenBalances, solPrice] = await Promise.all([
          getSolBalance(walletAddress),
          getTokenBalances(walletAddress),
          getSolPrice(),
        ])

        solanaContext = {
          walletAddress,
          solBalance,
          tokenBalances,
          solPrice,
        }
      } catch (error) {
        console.error("Error fetching Solana context:", error)
      }
    }

    // Format messages for the AI model
    const formattedMessages = messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }))

    // Add system message with Solana context
    const systemMessage = `You are BARK AI, an assistant specialized in Solana blockchain and crypto.
${
  walletAddress
    ? `The user has connected their wallet: ${walletAddress}.
Their SOL balance is ${solanaContext.solBalance} SOL (worth approximately $${(solanaContext.solBalance || 0) * (solanaContext.solPrice || 0)}).
Token balances: ${JSON.stringify(solanaContext.tokenBalances || {})}.
Current SOL price: $${solanaContext.solPrice}.`
    : "The user has not connected their wallet."
}
Provide helpful, accurate information about Solana, DeFi, NFTs, and crypto in general.
If the user asks about code, provide well-formatted code examples.`

    // Use AI SDK to generate response
    const { text } = await generateText({
      model: openai(serverEnv.openaiModelName || "gpt-4o"),
      messages: [{ role: "system", content: systemMessage }, ...formattedMessages],
    })

    // Check if the response contains code
    const isCode =
      text.includes("```") &&
      (text.includes("function") ||
        text.includes("class") ||
        text.includes("import") ||
        text.includes("const") ||
        text.includes("let") ||
        text.includes("var"))

    return { text, isCode }
  } catch (error) {
    console.error("Error generating AI response:", error)
    return {
      text: "I'm sorry, I encountered an error while processing your request. Please try again later.",
    }
  }
}

