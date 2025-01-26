"use client"

import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { TrendingUp, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface TokenInfo {
  mint: string
  symbol: string
  name: string
  iconUrl: string
}

const tokenList: TokenInfo[] = [
  {
    mint: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Solana",
    iconUrl:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  {
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    name: "USD Coin",
    iconUrl:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  },
  {
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    symbol: "BONK",
    name: "Bonk",
    iconUrl: "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
  },
  {
    mint: "2NTvEssJ2i998V2cMGT4Fy3JhyFnAzHFonDo9dbAkVrg",
    symbol: "BARK",
    name: "BARK",
    iconUrl: "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp",
  },
]

type QuoteResponse = {
  outAmount: number
  priceImpactPct: number
}

type QuoteRequest = {
  inputMint: string
  outputMint: string
  amount: number
}

const formatNumber = (value: number, decimals: number): string => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

// AI model for price analysis
const analyzePrice = async (
  jupiterPrice: number,
  raydiumPrice: number,
): Promise<{ bestPrice: number; source: string }> => {
  // In a real scenario, this would be a call to a sophisticated AI model
  // For this example, we'll use a simple comparison
  if (jupiterPrice > raydiumPrice) {
    return { bestPrice: jupiterPrice, source: "Jupiter" }
  } else {
    return { bestPrice: raydiumPrice, source: "Raydium" }
  }
}

export function AITradingAgent() {
  const [fromToken, setFromToken] = useState<TokenInfo | null>(null)
  const [toToken, setToToken] = useState<TokenInfo | null>(null)
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [jupiterPrice, setJupiterPrice] = useState<number | null>(null)
  const [raydiumPrice, setRaydiumPrice] = useState<number | null>(null)
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchPrices = useCallback(async () => {
    if (!fromToken || !toToken || !amount) return

    setIsLoading(true)
    setError(null)
    try {
      const parsedAmount = Number.parseFloat(amount)
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Invalid amount")
      }

      // Fetch Jupiter price
      const jupiterResponse = await fetch(
        `/api/jupiter?inputMint=${fromToken.mint}&outputMint=${toToken.mint}&amount=${parsedAmount}`,
      )
      const jupiterData = await jupiterResponse.json()
      setJupiterPrice(jupiterData.price)

      // Fetch Raydium price
      const raydiumResponse = await fetch(
        `/api/raydium?inputMint=${fromToken.mint}&outputMint=${toToken.mint}&amount=${parsedAmount}`,
      )
      const raydiumData = await raydiumResponse.json()
      setRaydiumPrice(raydiumData.price)

      // Analyze prices and set quote
      const { bestPrice, source } = await analyzePrice(jupiterData.price, raydiumData.price)
      setQuote({
        outAmount: bestPrice,
        priceImpactPct: Math.abs(1 - bestPrice / parsedAmount),
      })
    } catch (err) {
      console.error("Error fetching prices:", err)
      setError((err as Error).message)
      toast.error("Failed to fetch prices. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [fromToken, toToken, amount])

  useEffect(() => {
    if (fromToken && toToken && amount) {
      fetchPrices()
    }
  }, [fromToken, toToken, amount, fetchPrices])

  const handleTrade = async () => {
    if (!fromToken || !toToken || !amount || !quote) return

    setIsLoading(true)
    try {
      // In a real scenario, you would execute the trade here using the chosen DEX (Jupiter or Raydium)
      // For this example, we'll just show a success message
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      toast.success(`Trade executed successfully! Received ${formatNumber(quote.outAmount, 4)} ${toToken.symbol}`)
    } catch (error) {
      console.error("Error executing trade:", error)
      toast.error("Failed to execute trade. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6" />
          <span>AI Trading Agent</span>
        </CardTitle>
        <CardDescription>Execute trades with AI-powered price analysis across Jupiter and Raydium</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="fromToken">From Token</Label>
            <Select onValueChange={(value) => setFromToken(tokenList.find((token) => token.mint === value) || null)}>
              <SelectTrigger id="fromToken">
                <SelectValue placeholder="Select token">
                  {fromToken && (
                    <div className="flex items-center">
                      <Image
                        src={fromToken.iconUrl || "/placeholder.svg"}
                        alt={fromToken.name}
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      {fromToken.symbol}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent position="popper">
                {tokenList.map((token) => (
                  <SelectItem key={token.mint} value={token.mint}>
                    <div className="flex items-center">
                      <Image
                        src={token.iconUrl || "/placeholder.svg"}
                        alt={token.name}
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      {token.symbol}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="toToken">To Token</Label>
            <Select onValueChange={(value) => setToToken(tokenList.find((token) => token.mint === value) || null)}>
              <SelectTrigger id="toToken">
                <SelectValue placeholder="Select token">
                  {toToken && (
                    <div className="flex items-center">
                      <Image
                        src={toToken.iconUrl || "/placeholder.svg"}
                        alt={toToken.name}
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      {toToken.symbol}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent position="popper">
                {tokenList.map((token) => (
                  <SelectItem key={token.mint} value={token.mint}>
                    <div className="flex items-center">
                      <Image
                        src={token.iconUrl || "/placeholder.svg"}
                        alt={token.name}
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      {token.symbol}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => {
                const value = e.target.value
                if (value === "" || /^\d*\.?\d{0,6}$/.test(value)) {
                  setAmount(value)
                }
              }}
              type="text"
            />
          </div>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {quote && (
          <div className="mt-4 space-y-2">
            <p>You will receive approximately:</p>
            <p className="text-2xl font-bold">
              {formatNumber(quote.outAmount, 4)} {toToken?.symbol}
            </p>
            <p>Price Impact: {formatNumber(quote.priceImpactPct * 100, 2)}%</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button onClick={fetchPrices} disabled={isLoading || !fromToken || !toToken || !amount} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          {isLoading ? "Fetching Prices..." : "Refresh Prices"}
        </Button>
        <Button
          onClick={handleTrade}
          disabled={isLoading || !fromToken || !toToken || !amount || !quote}
          className="w-full"
        >
          {isLoading ? "Executing Trade..." : "Execute AI-Powered Trade"}
        </Button>
      </CardFooter>
    </Card>
  )
}

