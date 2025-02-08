"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletPortfolio } from "@/components/message/wallet-portfolio"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mockPortfolioData } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Wallet, ExternalLink } from "lucide-react"
import { SolanaIcon } from "@/components/icons/solana-icon"
import { useTheme } from "next-themes"
import { SSEClient } from "@/lib/sse-client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useSession } from "next-auth/react"
import { LoginButton } from "@/components/login-button"

export function DashboardContent() {
  const { data: session } = useSession()
  const { theme } = useTheme()
  const [balance, setBalance] = useState("0.00")
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [barkPrice, setBarkPrice] = useState(0.0015)
  const [barkChange, setBarkChange] = useState(5.67)
  const [marketCap, setMarketCap] = useState(10500000)
  const [priceHistory, setPriceHistory] = useState([
    { time: "00:00", price: 0.0014 },
    { time: "04:00", price: 0.0015 },
    { time: "08:00", price: 0.00155 },
    { time: "12:00", price: 0.0016 },
    { time: "16:00", price: 0.00158 },
    { time: "20:00", price: 0.0015 },
  ])

  useEffect(() => {
    const sseClient = new SSEClient("/api/dashboard-updates")
    sseClient.connect((data) => {
      if (data.balance) setBalance(data.balance)
      if (data.barkPrice) setBarkPrice(data.barkPrice)
      if (data.barkChange) setBarkChange(data.barkChange)
      if (data.marketCap) setMarketCap(data.marketCap)
      if (data.priceHistory) setPriceHistory(data.priceHistory)
    })

    return () => {
      sseClient.disconnect()
    }
  }, [])

  const handleConnectWallet = () => {
    setConnectedWallet(connectedWallet ? null : "bark1...xyz")
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-background">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b space-y-4 sm:space-y-0 bg-white dark:bg-sidebar">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={session?.user?.image || "/placeholder.svg"} alt={session?.user?.name || "User"} />
            <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">Welcome, {session?.user?.name || "User"}</h2>
            <p className="text-sm text-muted-foreground">Your dashboard overview</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="flex items-center space-x-2 flex-grow sm:flex-grow-0">
            <SolanaIcon className="w-6 h-6 text-primary" />
            <span className="font-semibold">{balance} SOL</span>
          </div>
          <Button
            variant="outline"
            className="bg-primary text-primary-foreground min-w-[150px] justify-start flex-grow sm:flex-grow-0"
            onClick={handleConnectWallet}
          >
            <Wallet className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{connectedWallet ? connectedWallet : "Connect Wallet"}</span>
          </Button>
          <LoginButton />
        </div>
      </header>
      <main className="flex-1 p-4 overflow-auto">
        <div className="h-4"></div>
        <div className="max-w-7xl mx-auto space-y-6">
          <Card className="shadow-lg bg-white dark:bg-sidebar">
            <CardHeader className="pb-2">
              <CardTitle>BARK Protocol Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium">Current BARK Price</p>
                  <p className="text-2xl font-bold">${barkPrice.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">24h Change</p>
                  <p className={`text-lg font-semibold ${barkChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {barkChange >= 0 ? "+" : ""}
                    {barkChange.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Market Cap</p>
                  <p className="text-lg font-semibold">${marketCap.toLocaleString()}</p>
                </div>
                <div className="flex items-center">
                  <Button variant="outline" className="w-full">
                    Trade BARK
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg bg-white dark:bg-sidebar">
              <CardHeader className="pb-2">
                <CardTitle>Your Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <WalletPortfolio data={mockPortfolioData} isLoading={false} />
              </CardContent>
            </Card>
            <Card className="shadow-lg bg-white dark:bg-sidebar">
              <CardHeader className="pb-2">
                <CardTitle>Recent Saved Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {mockPortfolioData.savedPrompts.map((prompt) => (
                    <div key={prompt.id} className="mb-3 p-3 bg-gray-50 dark:bg-card rounded-lg shadow">
                      <h3 className="text-sm font-medium">{prompt.title}</h3>
                      <p className="text-xs text-muted-foreground truncate mt-1">{prompt.content}</p>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="border-t p-4 text-center text-sm text-muted-foreground bg-white dark:bg-sidebar">
        <p>&copy; 2025 BARK Protocol. All rights reserved.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Contact Us
          </a>
        </div>
      </footer>
    </div>
  )
}

