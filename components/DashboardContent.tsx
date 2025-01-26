"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  Zap,
  BarChart2,
  Clock,
} from "lucide-react"
import { FloatingWallet } from "./FloatingWallet"
import { AITradingAgent } from "./AITradingAgent"

interface TokenData {
  name: string
  price: number
  change: number
}

interface Transaction {
  id: number
  description: string
  amount: string
  time: string
}

// Mock data for the FloatingWallet component
const PortfolioData = {
  address: "BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo",
  totalBalance: 1534.56,
  tokens: [
    {
      name: "Solana",
      symbol: "SOL",
      balance: 10,
      pricePerToken: 270,
      imageUrl: "https://cryptologos.cc/logos/solana-sol-logo.png",
    },
    { 
      name: "BARK", 
      symbol: "BARK", 
      balance: 100000, 
      pricePerToken: 0.0000012, 
      imageUrl: "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp" 
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      balance: 500,
      pricePerToken: 1,
      imageUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    },
  ],
}

// Mock data for latest transactions
const latestTransactions: Transaction[] = [
  { id: 1, description: "Bought SOL", amount: "-$270.00", time: "10 mins ago" },
  { id: 2, description: "Sold BARK", amount: "+$1.20", time: "30 mins ago" },
  { id: 3, description: "Staked USDC", amount: "-$500.00", time: "1 hour ago" },
]

export function DashboardContent() {
  const [tokens, setTokens] = useState<TokenData[]>([
    { name: "SOL", price: 0, change: 0 },
    { name: "BARK", price: 0, change: 0 },
    { name: "USDC", price: 0, change: 0 },
  ])

  useEffect(() => {
    const fetchTokenData = () => {
      const updatedTokens = tokens.map((token) => ({
        ...token,
        price: Number.parseFloat((Math.random() * 100).toFixed(2)),
        change: Number.parseFloat((Math.random() * 10 - 5).toFixed(2)),
      }))
      setTokens(updatedTokens)
    }

    fetchTokenData()
    const interval = setInterval(fetchTokenData, 30000)

    return () => clearInterval(interval)
  }, [tokens])

  return (
    <div className="space-y-4 relative">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tokens.map((token) => (
          <Card key={token.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{token.name}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${token.price.toFixed(2)}</div>
              <p className={`text-xs ${token.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {token.change >= 0 ? (
                  <ArrowUpRight className="inline mr-1" />
                ) : (
                  <ArrowDownRight className="inline mr-1" />
                )}
                {Math.abs(token.change)}%
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" onClick={() => console.log("Trade clicked")}>
                <Zap className="mr-2 h-4 w-4" /> Trade
              </Button>
              <Button className="w-full" onClick={() => console.log("Analyze clicked")}>
                <BarChart2 className="mr-2 h-4 w-4" /> Analyze
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$10,234.56</div>
            <p className="text-xs text-green-500">
              <TrendingUp className="inline mr-1" />
              +5.67% (24h)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AITradingAgent />

        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Latest Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {latestTransactions.map((transaction) => (
                  <li key={transaction.id} className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.time}</p>
                    </div>
                    <p className="text-sm font-bold">{transaction.amount}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-4">
        <Card className="lg:w-full">
          <CardHeader>
            <CardTitle>Governance Treasury</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg">
              Monitor and manage treasury funds allocated for governance and proposals.
            </div>
          </CardContent>
        </Card>
      </div>

      <FloatingWallet data={PortfolioData} className="fixed bottom-4 right-4" />
    </div>
  )
}
