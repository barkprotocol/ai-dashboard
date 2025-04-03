import { type NextRequest, NextResponse } from "next/server"
import type { AgentStats } from "@/types/agent"

// Mock stats data
const mockStats: AgentStats = {
  totalAgents: 87,
  publicAgents: 62,
  privateAgents: 25,
  totalUsage: 12450,
  popularCategories: [
    { category: "defi", count: 18 },
    { category: "development", count: 15 },
    { category: "general", count: 12 },
    { category: "analytics", count: 10 },
    { category: "research", count: 8 },
  ],
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ stats: mockStats })
}

