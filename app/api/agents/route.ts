import { type NextRequest, NextResponse } from "next/server"
import type { Agent } from "@/types/agent"
import { AGENT_CATEGORIES, AGENT_TEMPLATES } from "@/lib/constants"
import type { ApiResponse, PaginatedResponse } from "@/types/api"

// Mock data for agents
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
    currency: "BARK", // Add currency field
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
    currency: "USDC", // Add currency field
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
    currency: "SOL", // Add currency field
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
    currency: "BARK", // Add currency field
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
    currency: "USDC", // Add currency field
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
    currency: "SOL", // Add currency field
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "system",
    rating: 4.9,
    reviewCount: 215,
  },
]

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const isPublic = searchParams.get("isPublic")
    const search = searchParams.get("search")
    const barkEnabled = searchParams.get("barkEnabled")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")

    let filteredAgents = [...mockAgents]

    // Apply filters if provided
    if (category) {
      filteredAgents = filteredAgents.filter((agent) => agent.category === category)
    }

    if (isPublic !== null) {
      const isPublicBool = isPublic === "true"
      filteredAgents = filteredAgents.filter((agent) => agent.isPublic === isPublicBool)
    }

    if (barkEnabled !== null) {
      const barkEnabledBool = barkEnabled === "true"
      filteredAgents = filteredAgents.filter((agent) => agent.barkEnabled === barkEnabledBool)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredAgents = filteredAgents.filter(
        (agent) =>
          agent.title.toLowerCase().includes(searchLower) || agent.description.toLowerCase().includes(searchLower),
      )
    }

    // Calculate pagination
    const total = filteredAgents.length
    const totalPages = Math.ceil(total / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedAgents = filteredAgents.slice(startIndex, endIndex)

    const response: ApiResponse<{
      agents: Agent[]
      pagination: PaginatedResponse<Agent>
      categories: typeof AGENT_CATEGORIES
      templates: typeof AGENT_TEMPLATES
    }> = {
      status: "success",
      data: {
        agents: paginatedAgents,
        pagination: {
          items: paginatedAgents,
          total,
          page,
          pageSize,
          totalPages,
        },
        categories: AGENT_CATEGORIES,
        templates: AGENT_TEMPLATES,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in GET /api/agents:", error)
    return NextResponse.json(
      {
        status: "error",
        error: "Failed to fetch agents",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.model || !body.category) {
      return NextResponse.json(
        {
          status: "error",
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // In a real implementation, this would save to a database
    const newAgent: Agent = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description || "",
      model: body.model,
      systemPrompt: body.systemPrompt || "",
      isPublic: body.isPublic || false,
      category: body.category || "general",
      features: body.features || [],
      barkEnabled: body.barkEnabled || false,
      price: body.price || 10,
      currency: body.currency || "BARK", // Add currency field
      createdBy: body.createdBy || "user",
      icon: body.icon || "",
      listingPrice: body.listingPrice || 5,
      creationFee: body.creationFee || 50,
      functions: body.functions || [],
      verified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 0,
      reviewCount: 0,
    }

    return NextResponse.json(
      {
        status: "success",
        data: { agent: newAgent },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error in POST /api/agents:", error)
    return NextResponse.json(
      {
        status: "error",
        error: "Failed to create agent",
      },
      { status: 500 },
    )
  }
}

