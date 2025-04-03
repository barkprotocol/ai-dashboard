import { type NextRequest, NextResponse } from "next/server"
import { AGENT_CATEGORIES } from "@/lib/constants"

export async function GET(request: NextRequest) {
  return NextResponse.json({ categories: AGENT_CATEGORIES })
}

