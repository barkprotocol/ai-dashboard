import { z } from "zod"
import { createSafeAction } from "@/lib/safe-action"

export enum BirdeyeTimeframe {
  ONE_DAY = "1d",
  SEVEN_DAYS = "7d",
  THIRTY_DAYS = "30d",
}

export type BirdeyeTrader = {
  address: string
  pnl: number
  trades: number
  volume: number
}

const getTopTradersSchema = z.object({
  timeframe: z.nativeEnum(BirdeyeTimeframe),
})

export const getTopTraders = createSafeAction(getTopTradersSchema, async ({ timeframe }) => {
  try {
    const response = await fetch(`https://public-api.birdeye.so/defi/top_traders?timeframe=${timeframe}`, {
      headers: {
        "X-API-Key": process.env.BIRDEYE_API_KEY || "",
      },
    })

    if (!response.ok) {
      throw new Error(`Birdeye API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return data.data as BirdeyeTrader[]
  } catch (error) {
    console.error("Error fetching top traders:", error)
    throw new Error("Failed to fetch top traders")
  }
})

