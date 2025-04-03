import { type NextRequest, NextResponse } from "next/server"
import { AGENT_TEMPLATES, AGENT_FUNCTION_TEMPLATES } from "@/lib/constants"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  let templates = [...AGENT_TEMPLATES]

  if (category) {
    templates = templates.filter((template) => template.category === category)
  }

  return NextResponse.json({
    templates,
    functions: AGENT_FUNCTION_TEMPLATES,
  })
}

