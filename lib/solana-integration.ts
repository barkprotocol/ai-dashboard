import { Connection, PublicKey, Transaction } from "@solana/web3.js"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Initialize Solana connection
const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com")

// Function to get account balance
export async function getAccountBalance(publicKey: string): Promise<number> {
  const pubkey = new PublicKey(publicKey)
  const balance = await connection.getBalance(pubkey)
  return balance / 1e9 // Convert lamports to SOL
}

// Function to get recent transactions
export async function getRecentTransactions(publicKey: string, limit = 10): Promise<any[]> {
  const pubkey = new PublicKey(publicKey)
  const transactions = await connection.getSignaturesForAddress(pubkey, { limit })
  return transactions
}

// AI-powered function to analyze transactions
export async function analyzeTransactions(transactions: any[]): Promise<string> {
  const transactionSummary = transactions.map((tx) => `${tx.signature.slice(0, 8)}: ${tx.memo || "No memo"}`).join("\n")

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Analyze these Solana transactions and provide insights:\n${transactionSummary}`,
  })

  return text
}

// Function to create and send a transaction (simplified example)
export async function sendTransaction(fromPubkey: PublicKey, toPubkey: PublicKey, amount: number): Promise<string> {
  const transaction = new Transaction().add(
    // Add transfer instruction here
  )

  // Sign and send transaction
  // Note: In a real application, you would need to implement proper signing
  const signature = await connection.sendTransaction(transaction, [
    /* Add signer here */
  ])

  return signature
}

