import { WalletDetails } from "@/components/wallet-details"
import { TweetFeed } from "@/components/tweet-feed"

export default function TradingAssistantPage() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">AI Trading Assistant</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <WalletDetails />
        <TweetFeed />
      </div>
    </div>
  )
}

