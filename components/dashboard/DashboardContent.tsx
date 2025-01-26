"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Zap, Users } from "lucide-react"
import { FloatingWallet } from "@/components/FloatingWallet"
import { AITradingAgent } from "@/components/dashboard/AITrading"

interface TokenData {
  name: string;
  price: number;
  change: number;
  mint?: string;
  decimals?: number;
}

interface NFT {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  mintDate: string;
  value: number;
}

interface PortfolioData {
  address: string;
  totalBalance: number;
  tokens: TokenData[];
  nfts: NFT[];
}

const PortfolioData = {
  address: "BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo",
  totalBalance: 1534.56,
  tokens: [
    {
      name: "Solana",
      symbol: "SOL",
      price: 270,
      change: 5,
      mint: "So11111111111111111111111111111111111111112",
      decimals: 9,
      imageUrl: "https://cryptologos.cc/logos/solana-sol-logo.png",
    },
    {
      name: "BARK",
      symbol: "BARK",
      price: 0.0000012,
      change: -2,
      mint: "BARKmintAddress1234567890",
      decimals: 6,
      imageUrl: "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp",
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      price: 1,
      change: 0,
      mint: "USDm11entAddress9876543210",
      decimals: 6,
      imageUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    },
  ],
  nfts: [
    {
      id: "nft1",
      name: "Exclusive BARK NFT",
      imageUrl: "https://ucarecdn.com/abcd1234-e567-890f-ghij-klmnopqrstuv/nft1-image.jpg",
      description: "A limited edition BARK NFT featuring unique traits.",
      mintDate: "2024-01-01",
      value: 500,
    },
    {
      id: "nft2",
      name: "BARK Mascot NFT",
      imageUrl: "https://ucarecdn.com/wxyz1234-abcd-5678-efgh-ijklmnopqrst/nft2-image.jpg",
      description: "A rare BARK mascot NFT that embodies resilience.",
      mintDate: "2024-02-01",
      value: 700,
    },
  ],
};

export function DashboardContent() {
  const [tokens, setTokens] = useState<TokenData[]>([
    { name: "SOL", price: 0, change: 0 },
    { name: "BARK", price: 0, change: 0 },
    { name: "USDC", price: 0, change: 0 },
  ]);
  const [nfts, setNfts] = useState<NFT[]>(PortfolioData.nfts);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        // Example of fetching data from an API (replace with real API call)
        const updatedTokens = [
          { name: "SOL", price: 100, change: 5 },
          { name: "BARK", price: 0.0001, change: -2 },
          { name: "USDC", price: 1, change: 0 },
        ];
        setTokens(updatedTokens);
      } catch (error) {
        console.error("Failed to fetch token data", error);
      }
    };

    fetchTokenData();
    const interval = setInterval(fetchTokenData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
              {token.mint && <p className="text-xs text-muted-foreground">Mint: {token.mint}</p>}
              {token.decimals && <p className="text-xs text-muted-foreground">Decimals: {token.decimals}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Latest Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Transaction #12345 completed successfully.</p>
            <p className="text-sm text-muted-foreground">3 minutes ago</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Governance Treasury</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-bold">Treasury Balance: $15,450.00</p>
            <p className="text-sm text-muted-foreground">Updated 10 minutes ago</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blink Add</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Quickly add assets or manage your Blink campaigns with ease.</p>
            <Button className="w-full bg-gray-800 text-white hover:bg-gray-700 mt-4">
              <Zap className="mr-2 h-4 w-4" /> Add Blink
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AITradingAgent />
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Total Rewards Earned: $1,250.00</p>
              <p className="text-sm text-green-500">
                <TrendingUp className="inline mr-1" />
                +12.34% (This Month)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-bold">Active Members: 1,234</p>
              <p className="text-sm text-muted-foreground">Engagement Rate: 85%</p>
              <Button className="w-full bg-gray-800 text-white hover:bg-gray-700 mt-4">
                <Users className="mr-2 h-4 w-4" /> View Community
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <Card key={nft.id}>
            <CardHeader>
              <CardTitle>{nft.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={nft.imageUrl} alt={nft.name} className="w-full h-auto" />
              <p className="text-sm">{nft.description}</p>
              <p className="text-xs text-muted-foreground">Mint Date: {nft.mintDate}</p>
              <p className="text-lg font-bold">Value: ${nft.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <FloatingWallet data={PortfolioData} className="lg:ml-auto" />
    </div>
  );
}
