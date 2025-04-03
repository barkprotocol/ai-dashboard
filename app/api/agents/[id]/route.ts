import { type NextRequest, NextResponse } from "next/server"
import type { Agent } from "@/types/agent"

// Mock data for agents (same as in the main route)
const mockAgents: Agent[] = [
  {
    id: "1",
    title: "Code Assistant",
    description:
      "A specialized agent for helping with coding tasks, debugging, and code explanations across multiple programming languages.",
    model: "GPT-4o",
    category: "development",
    isPublic: true,
    verified: true,
    barkEnabled: false,
    features: ["Code generation", "Debugging", "Code explanation", "Multiple languages"],
    price: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "system",
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: "2",
    title: "Research Assistant",
    description:
      "An agent designed to help with research tasks, summarizing articles, and finding relevant information on various topics.",
    model: "Claude 3 Opus",
    category: "research",
    isPublic: true,
    verified: true,
    barkEnabled: true,
    features: ["Article summarization", "Information retrieval", "Citation formatting", "Research planning"],
    price: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "system",
    rating: 4.6,
    reviewCount: 87,
  },
  {
    id: "3",
    title: "DeFi Advisor",
    description:
      "Specialized in Solana DeFi protocols, providing insights on yield farming, liquidity pools, and token swaps on the Solana blockchain.",
    model: "GPT-4o",
    category: "defi",
    isPublic: true,
    verified: true,
    barkEnabled: true,
    features: ["Solana ecosystem", "Yield optimization", "Protocol analysis", "Risk assessment"],
    price: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "system",
    rating: 4.9,
    reviewCount: 156,
  },
  {
    id: "4",
    title: "Charity Impact Analyzer",
    description:
      "Helps analyze and maximize the impact of charitable donations and disaster relief efforts using Solana's fast and low-cost transactions.",
    model: "Claude 3 Opus",
    category: "charity",
    isPublic: true,
    verified: true,
    barkEnabled: false,
    features: ["Impact assessment", "Donation tracking", "Transparency reporting", "Solana integration"],
    price: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "system",
    rating: 4.5,
    reviewCount: 42,
  },
  {
    id: "5",
    title: "Solana Analytics Pro",
    description:
      "Advanced analytics for Solana blockchain data, providing insights on network performance, token metrics, and dApp usage patterns.",
    model: "GPT-4o",
    category: "analytics",
    isPublic: true,
    verified: true,
    barkEnabled: true,
    features: ["On-chain data analysis", "Performance metrics", "Token analytics", "Visual reports"],
    price: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "system",
    rating: 4.7,
    reviewCount: 93,
  },
  {
    id: "6",
    title: "Universal Assistant",
    description:
      "A versatile AI agent capable of handling a wide range of tasks across different domains. Perfect for general purpose assistance.",
    model: "GPT-4o",
    category: "general",
    isPublic: true,
    verified: true,
    barkEnabled: true,
    features: ["Multi-domain knowledge", "Task automation", "Content creation", "Problem solving"],
    price: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "system",
    rating: 4.9,
    reviewCount: 215,
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const agent = mockAgents.find((a) => a.id === id)

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 })
  }

  return NextResponse.json({ agent })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Check if agent exists
    const agentIndex = mockAgents.findIndex((a) => a.id === id)
    if (agentIndex === -1) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // In a real implementation, this would update the database
    const updatedAgent: Agent = {
      ...mockAgents[agentIndex],
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ agent: updatedAgent })
  } catch (error) {
    console.error("Error updating agent:", error)
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  // Check if agent exists
  const agentIndex = mockAgents.findIndex((a) => a.id === id)
  if (agentIndex === -1) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 })
  }

  // In a real implementation, this would delete from the database

  return NextResponse.json({ message: "Agent deleted successfully" }, { status: 200 })
}

