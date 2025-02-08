"use client"
import { ArrowUpRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber } from "@/lib/utils"

interface TopTraderProps {
  trader: {
    name: string
    avatar: string
    profit: number
    trades: number
  }
}

export function TopTrader({ trader }: TopTraderProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Top Trader</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={trader.avatar} alt={trader.name} />
            <AvatarFallback>{trader.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{trader.name}</p>
            <p className="text-sm text-muted-foreground">{trader.trades} trades</p>
          </div>
          <div className="flex items-center space-x-1 text-green-500">
            <ArrowUpRight className="h-4 w-4" />
            <span className="text-sm font-medium">{formatNumber(trader.profit, "percent")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

