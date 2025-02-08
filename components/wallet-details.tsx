"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal } from "lucide-react"

const mockWalletData = {
  balance: 15000,
  address: "8xxt4vQWNQSWBhidCN4uHx9U8hxWvZwwdwGp6FHqiVvJ",
  transactions: [
    {
      id: 1,
      type: "receive",
      amount: 500,
      from: "3Kzh9qAqVWQhEsfQz7zEQL1EuSx5tyNNCDwvvsrjMqcp",
      timestamp: "2025-02-07T10:30:00Z",
    },
    {
      id: 2,
      type: "send",
      amount: 200,
      to: "7YttLkHGczovAdXkw72xLDKvzCkgqXn5BZ4QcgCsNVzV",
      timestamp: "2025-02-06T15:45:00Z",
    },
    {
      id: 3,
      type: "receive",
      amount: 1000,
      from: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
      timestamp: "2025-02-05T09:15:00Z",
    },
    {
      id: 4,
      type: "send",
      amount: 150,
      to: "6Qj1KXPJsBvBc9TJqUbqfzXwSvfaftPFHPTCr7ByuKMW",
      timestamp: "2025-02-04T18:20:00Z",
    },
    {
      id: 5,
      type: "receive",
      amount: 300,
      from: "2ZZkgKcBfp4tW8qCLj2yjxRYh9CuvEVJWb6e1tYTzxbQ",
      timestamp: "2025-02-03T11:00:00Z",
    },
  ],
}

export function WalletDetails() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Wallet Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Balance</span>
                <span className="text-2xl font-bold">${mockWalletData.balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Wallet Address</span>
                <span className="text-sm font-mono bg-secondary p-2 rounded">{mockWalletData.address}</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="transactions">
            <div className="space-y-4">
              {mockWalletData.transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9">
                      {tx.type === "receive" ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                      )}
                      <AvatarFallback>{tx.type === "receive" ? "R" : "S"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{tx.type === "receive" ? "Received" : "Sent"}</p>
                      <p className="text-xs text-muted-foreground">
                        {tx.type === "receive" ? `From: ${tx.from}` : `To: ${tx.to}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${tx.type === "receive" ? "text-green-500" : "text-red-500"}`}>
                      {tx.type === "receive" ? "+" : "-"}${tx.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="features">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <ArrowUpRight className="h-6 w-6 mb-2" />
                <span>Send</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <ArrowDownLeft className="h-6 w-6 mb-2" />
                <span>Receive</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <MoreHorizontal className="h-6 w-6 mb-2" />
                <span>More</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

