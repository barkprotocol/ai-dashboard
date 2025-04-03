import { NextResponse } from "next/server"
import type { TokenStats } from "@/types/token"

export async function GET() {
  try {
    // Mock data for demonstration
    const tokenStats: TokenStats = {
      dailyVolume: 25000,
      weeklyVolume: 175000,
      monthlyVolume: 750000,
      totalTransactions: 12500,
      avgTransactionSize: 60,
    }

    return NextResponse.json(tokenStats)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch token statistics" }, { status: 500 })
  }
}

