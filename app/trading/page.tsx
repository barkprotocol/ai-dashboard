import React from 'react'
import { AITradingAgent }from '@/components/trading/ai-trading-agent'

export default function TradingPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-3xl w-full p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center">AI Trading</h1>
        
        <p className="mt-4 text-lg text-center text-gray-600">
          Welcome to the AI Trading page. Here, you'll have access to various trading tools and features powered by AI.
        </p>

        {/* AI Trading Agent Component */}
        <div className="mt-6">
          <AITradingAgent />
        </div>
      </div>
    </div>
  )
}
