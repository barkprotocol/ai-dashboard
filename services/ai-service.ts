import type { Message } from "@/types/chat"
import { publicEnv } from "@/lib/env"

interface ChatResponse {
  text: string
  isCode?: boolean
}

export async function generateChatResponse(messages: Message[], model: string): Promise<ChatResponse> {
  // In a real app, this would call an API endpoint with the API key from serverEnv
  // For example: const apiKey = serverEnv.openaiApiKey;

  // For now, we'll simulate a response
  return new Promise((resolve) => {
    setTimeout(() => {
      const lastMessage = messages[messages.length - 1]

      // Check if the message is asking for code
      const isCodeRequest =
        lastMessage.text.toLowerCase().includes("code") ||
        lastMessage.text.toLowerCase().includes("example") ||
        lastMessage.text.toLowerCase().includes("function")

      let responseText = ""
      let isCode = false

      if (isCodeRequest) {
        isCode = true
        responseText = `// Here's an example code for your request:
function transferSOL(recipient, amount) {
  // This is a simplified example
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: new PublicKey(recipient),
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );
  
  return sendAndConfirmTransaction(connection, transaction, [wallet]);
}`
      } else if (lastMessage.text.toLowerCase().includes("bark")) {
        responseText = `${publicEnv.tokenName} (${publicEnv.tokenSymbol}) is the native utility token of the BARK ecosystem. It's used for governance, staking, and accessing premium features within the platform. BARK token holders can participate in protocol decisions and earn rewards through various DeFi mechanisms.`
      } else if (lastMessage.text.toLowerCase().includes("solana")) {
        responseText = `Solana is a high-performance blockchain platform designed for decentralized applications and marketplaces. It offers fast transaction speeds (up to 65,000 TPS), low costs, and is carbon-neutral. Solana uses a unique combination of Proof of Stake (PoS) and Proof of History (PoH) consensus mechanisms.`
      } else {
        responseText = `I understand you're asking about "${lastMessage.text}". In the blockchain space, this relates to several important concepts. Let me explain how this works in the context of Solana and decentralized applications.

Would you like me to provide more specific information about any particular aspect?`
      }

      resolve({
        text: responseText,
        isCode,
      })
    }, 1000)
  })
}

export async function generateCompletions(prompt: string): Promise<string[]> {
  // In a real app, this would call an API endpoint
  // For now, we'll return mock completions
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        "How does staking work on Solana?",
        `What are the benefits of ${publicEnv.tokenSymbol} token?`,
        "Can you explain Solana's Proof of History?",
        "What are the best Solana wallets?",
      ])
    }, 500)
  })
}

