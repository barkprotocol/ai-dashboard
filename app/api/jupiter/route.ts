import { NextResponse } from "next/server"
import { JUP_API } from "@/lib/constants"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const inputMint = searchParams.get("inputMint")
  const outputMint = searchParams.get("outputMint")
  const amount = searchParams.get("amount")

  if (!inputMint || !outputMint || !amount) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `${JUP_API}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`,
    )
    const data = await response.json()

    return NextResponse.json({ price: Number.parseFloat(data.outAmount) / Number.parseFloat(amount) })
  } catch (error) {
    console.error("Error fetching Jupiter price:", error)
    return NextResponse.json({ error: "Failed to fetch Jupiter price" }, { status: 500 })
  }
}

