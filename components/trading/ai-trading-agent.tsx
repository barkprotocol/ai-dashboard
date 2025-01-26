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
      "https://ucarecdn.com/0aa23f11-40b3-4cdc-891b-a169ed9f9328/sol.png",
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

const analyzePrice = async (
  jupiterPrice: number,
  raydiumPrice: number,
): Promise<{ bestPrice: number; source: string }> => {
  if (jupiterPrice > raydiumPrice) {
    return { bestPrice: jupiterPrice, source: "Jupiter" }
  } else {
    return { bestPrice: raydiumPrice, source: "Raydium" }
  }
}

const TokenSelect: React.FC<{
  label: string
  selectedToken: TokenInfo | null
  setSelectedToken: (token: TokenInfo | null) => void
}> = ({ label, selectedToken, setSelectedToken }) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label>{label}</Label>
      <Select onValueChange={(value) => setSelectedToken(tokenList.find((token) => token.mint === value) || null)}>
        <SelectTrigger>
          <SelectValue placeholder="Select token">
            {selectedToken && (
              <div className="flex items-center">
                <Image
                  src={selectedToken.iconUrl || "/placeholder.svg"}
                  alt={selectedToken.name}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                {selectedToken.symbol}
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
  )
}

export function AITradingAgent() {
  const [fromToken, setFromToken] = useState<TokenInfo | null>(null)
  const [toToken, setToToken] = useState<TokenInfo | null>(null)
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchPrices = useCallback(async () => {
    if (!fromToken || !toToken || !amount) return

    setIsLoading(true)
    setError(null)
    try {
      const parsedAmount = parseFloat(amount)
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Invalid amount")
      }

      const [jupiterData, raydiumData] = await Promise.all([
        fetch(`/api/jupiter?inputMint=${fromToken.mint}&outputMint=${toToken.mint}&amount=${parsedAmount}`).then((res) =>
          res.json()
        ),
        fetch(`/api/raydium?inputMint=${fromToken.mint}&outputMint=${toToken.mint}&amount=${parsedAmount}`).then((res) =>
          res.json()
        ),
      ])

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

  const handleTrade = async () => {
    if (!fromToken || !toToken || !amount || !quote) return

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate trade
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
          <TokenSelect label="From Token" selectedToken={fromToken} setSelectedToken={setFromToken} />
          <TokenSelect label="To Token" selectedToken={toToken} setSelectedToken={setToToken} />
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
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={fetchPrices}
          disabled={isLoading || !fromToken || !toToken || !amount}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              Fetching Prices...
            </>
          ) : (
            "Fetch Prices"
          )}
        </Button>
        <Button
          className="w-full mt-2"
          onClick={handleTrade}
          disabled={isLoading || !quote || !amount}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              Executing Trade...
            </>
          ) : (
            "Execute Trade"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
