import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import type { UsageData } from "@/types/usage"

// Initialize Solana connection
const getSolanaConnection = () => {
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com"
  return new Connection(rpcUrl)
}

/**
 * Fetch wallet balance from Solana blockchain
 */
export async function fetchWalletBalance(address: string): Promise<number> {
  try {
    const connection = getSolanaConnection()
    const publicKey = new PublicKey(address)
    const balance = await connection.getBalance(publicKey)
    return balance / LAMPORTS_PER_SOL
  } catch (error) {
    console.error("Error fetching wallet balance:", error)
    throw error
  }
}

/**
 * Fetch token balances for a wallet
 */
export async function fetchTokenBalances(address: string): Promise<Record<string, number>> {
  try {
    const connection = getSolanaConnection()
    const publicKey = new PublicKey(address)

    // In a real implementation, you would use getTokenAccountsByOwner
    // For now, we'll return a placeholder
    return {
      BARK: 1250,
      USDC: 250.5,
      SOL: await fetchWalletBalance(address),
    }
  } catch (error) {
    console.error("Error fetching token balances:", error)
    return { BARK: 0, USDC: 0, SOL: 0 }
  }
}

/**
 * Fetch usage data from API
 */
export async function fetchUsageData(): Promise<UsageData> {
  try {
    // In a real implementation, you would fetch from your API
    // For now, we'll return a placeholder
    return {
      messages: {
        used: 42,
        total: 1000,
        percentage: 4.2,
      },
      tokens: {
        used: 580000,
        total: 10000000,
        percentage: 5.8,
      },
      plan: {
        name: "Basic",
        renewalDate: "May 15, 2023",
        monthlyMessages: 1000,
        tokenAllocation: 10000000,
      },
      tokenUsage: [
        {
          date: "2023-04-28",
          amount: 10000,
          model: "GPT-4o",
        },
        {
          date: "2023-04-27",
          amount: 12000,
          model: "Claude 3",
        },
        {
          date: "2023-04-26",
          amount: 7500,
          model: "DeepSeek",
        },
      ],
    }
  } catch (error) {
    console.error("Error fetching usage data:", error)
    throw error
  }
}

/**
 * Fetch BARK token data
 */
export async function fetchBarkTokenData(): Promise<{
  balance: number
  staked: number
  rewards: number
  price: number
  change24h: number
}> {
  try {
    // In a real implementation, you would fetch from your API or blockchain
    // For now, we'll return a placeholder
    return {
      balance: 1250,
      staked: 500,
      rewards: 25,
      price: 0.12,
      change24h: 5.2,
    }
  } catch (error) {
    console.error("Error fetching BARK token data:", error)
    throw error
  }
}

/**
 * Fetch all data needed for the dashboard
 */
export async function fetchDashboardData(walletAddress?: string | null): Promise<{
  usageData: UsageData
  barkTokenData: ReturnType<typeof fetchBarkTokenData>
  walletConnected: boolean
}> {
  try {
    const usageData = await fetchUsageData()
    const barkTokenData = await fetchBarkTokenData()

    return {
      usageData,
      barkTokenData,
      walletConnected: !!walletAddress,
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    throw error
  }
}

