import { NextResponse } from "next/server"
import type { TokenUsage } from "@/types/token"

export async function GET() {
  try {
    // Mock data for demonstration
    const tokenUsage: TokenUsage = {
      totalBalance: 1250.75,
      tokens: [
        {
          symbol: "BARK",
          name: "BARK Token",
          balance: 1000,
          usdValue: 1000,
          icon: "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp",
          address: "BARKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        },
        {
          symbol: "SOL",
          name: "Solana",
          balance: 5.5,
          usdValue: 220.75,
          icon: "/images/solana-logo.png",
          address: "SOLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        },
        {
          symbol: "USDC",
          name: "USD Coin",
          balance: 30,
          usdValue: 30,
          icon: "/images/usdc-logo.png",
          address: "USDCxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        },
      ],
      recentTransactions: [
        {
          id: "1",
          type: "receive",
          amount: 100,
          symbol: "BARK",
          timestamp: Date.now() - 3600000, // 1 hour ago
          status: "confirmed",
          from: "Wallet1xxxxxxxxxxxx",
          to: "MyWalletxxxxxxxxxxxx",
          txHash: "tx123456789abcdef",
        },
        {
          id: "2",
          type: "send",
          amount: 0.5,
          symbol: "SOL",
          timestamp: Date.now() - 86400000, // 1 day ago
          status: "confirmed",
          from: "MyWalletxxxxxxxxxxxx",
          to: "Wallet2xxxxxxxxxxxx",
          txHash: "tx234567890abcdef",
          fee: 0.000005,
        },
        {
          id: "3",
          type: "swap",
          amount: 10,
          symbol: "USDC",
          timestamp: Date.now() - 172800000, // 2 days ago
          status: "confirmed",
          from: "MyWalletxxxxxxxxxxxx",
          to: "MyWalletxxxxxxxxxxxx",
          txHash: "tx345678901abcdef",
          fee: 0.00001,
        },
      ],
    }

    return NextResponse.json(tokenUsage)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch token data" }, { status: 500 })
  }
}

