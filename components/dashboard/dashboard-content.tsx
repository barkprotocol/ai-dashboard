"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PriceChart from "@/components/price-chart"
import { WalletCard } from "@/components/dashboard/wallet-card"
import { TopTrader } from "@/components/top-trader"
import { useUser } from "@/hooks/use-user"
import { useEmbeddedWallets } from "@/hooks/use-wallets"
import { Loader2 } from "lucide-react"
import { NumberTicker } from "@/components/ui/number-ticker"
import { TIMEFRAME } from "@/types/chart"
import { TokenTransferDialog } from "@/components/ui/transfer-dialog"
import { toast } from "sonner"

// Mock data for tokens - replace with real data fetching
const mockTokens = [
  { symbol: "SOL", name: "Solana" },
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "RAY", name: "Raydium" },
]

export function DashboardContent() {
  const { theme } = useTheme()
  const { user, isLoading: isUserLoading } = useUser()
  const { data: wallets, isLoading: isWalletsLoading } = useEmbeddedWallets()

  const [activeTab, setActiveTab] = useState("overview")
  const [fromToken, setFromToken] = useState("")
  const [toToken, setToToken] = useState("")
  const [amount, setAmount] = useState("")
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)

  const handleSwap = () => {
    // Implement swap logic here
    toast.success("Swap initiated. This is a mock implementation.")
  }

  if (isUserLoading || isWalletsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  <NumberTicker value={15231.89} decimalPlaces={2} duration={3} />
                </div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <NumberTicker value={2350} duration={2.5} />
                </div>
                <p className="text-xs text-muted-foreground">+180 since last hour</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,345</div>
                <p className="text-xs text-muted-foreground">+180 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+3 since yesterday</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Price Chart</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <PriceChart
                  data={[]}
                  timeFrame={TIMEFRAME.DAYS}
                  tokenInfo={{
                    symbol: "",
                    address: "",
                  }}
                />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Traders</CardTitle>
              </CardHeader>
              <CardContent>
                <TopTrader
                  trader={{
                    name: "",
                    avatar: "",
                    profit: 0,
                    trades: 0,
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="wallets" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wallets?.map((wallet) => (
              <WalletCard
                key={wallet.id}
                wallet={wallet}
                mutateWallets={() => {}}
                allWalletAddresses={wallets.map((w) => w.publicKey)}
              />
            ))}
          </div>
          <Button onClick={() => setIsTransferDialogOpen(true)}>Transfer Tokens</Button>
        </TabsContent>
        <TabsContent value="trading" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Trade</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSwap()
                }}
              >
                <div className="grid gap-2">
                  <Label htmlFor="from-token">From</Label>
                  <Select value={fromToken} onValueChange={setFromToken}>
                    <SelectTrigger id="from-token">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          {token.name} ({token.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="to-token">To</Label>
                  <Select value={toToken} onValueChange={setToToken}>
                    <SelectTrigger id="to-token">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          {token.name} ({token.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    placeholder="Enter amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Swap
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {wallets && wallets.length > 0 && (
        <TokenTransferDialog
          isOpen={isTransferDialogOpen}
          onClose={() => setIsTransferDialogOpen(false)}
          tokens={[]} // Replace with actual token data
          otherAddresses={wallets.map((w) => w.publicKey)}
          walletId={wallets[0].id}
          onSuccess={async () => {
            // Implement success handling
            toast.success("Transfer successful")
          }}
        />
      )}
    </div>
  )
}

