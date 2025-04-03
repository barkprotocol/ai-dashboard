import { type NextRequest, NextResponse } from "next/server"
import type { Agent } from "@/types/agent"
import { AGENT_CATEGORIES } from "@/lib/constants"
import type { ApiResponse } from "@/types/api"

// Reuse the mock agents from the agents API
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

export async function GET(request: NextRequest) {
  try {
    // Get featured agents (highest rated)
    const featuredAgents = [...mockAgents].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4)

    // Get popular agents (most reviews)
    const popularAgents = [...mockAgents].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 4)

    // Get new agents (most recently created)
    const newAgents = [...mockAgents]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4)

    // Get free agents (price = 0)
    const freeAgents = mockAgents.filter((agent) => agent.price === 0).slice(0, 4)

    // Get trending categories (categories with most agents)
    const categoryCounts = AGENT_CATEGORIES.map((category) => ({
      ...category,
      count: mockAgents.filter((agent) => agent.category === category.id).length,
    }))

    const trendingCategories = [...categoryCounts].sort((a, b) => b.count - a.count).slice(0, 5)

    const response: ApiResponse<{
      featured: Agent[]
      popular: Agent[]
      new: Agent[]
      free: Agent[]
      trendingCategories: typeof trendingCategories
    }> = {
      status: "success",
      data: {
        featured: featuredAgents,
        popular: popularAgents,
        new: newAgents,
        free: freeAgents,
        trendingCategories,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in GET /api/marketplace:", error)
    return NextResponse.json(
      {
        status: "error",
        error: "Failed to fetch marketplace data",
      },
      { status: 500 },
    )
  }
}

