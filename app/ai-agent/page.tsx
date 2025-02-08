import { SidebarAIAgent } from "@/components/sidebar-ai-agent"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AIAgentPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AI Agent Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Agent Overview</CardTitle>
            <CardDescription>Key information about your AI agent</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The AI Agent is designed to assist with various tasks related to DeFi and Solana blockchain operations. It
              can provide real-time market insights, help with token searches, and offer trading recommendations.
            </p>
            <Button>View Full Documentation</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest interactions and tasks performed by the agent</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Analyzed market trends for top 10 Solana tokens</li>
              <li>Provided liquidity pool recommendations</li>
              <li>Answered user queries about DeFi protocols</li>
              <li>Generated a report on gas fees and transaction costs</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <SidebarAIAgent />
    </div>
  )
}

