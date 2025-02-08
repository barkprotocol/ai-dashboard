import { type NextRequest, NextResponse } from "next/server"

import { USE_MOCK_DATA } from "@/lib/supabase"
import { verifyUser } from "@/app/api/user/route"
import { dbGetUserActions } from "@/server/db/queries"

// Mock data
const mockActions = [
  {
    id: "1",
    userId: "1",
    name: "Mock Action",
    description: "This is a mock action",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export async function GET(req: NextRequest) {
  try {
    const session = await verifyUser()
    const userId = session?.data?.data?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (USE_MOCK_DATA) {
      const actions = mockActions.filter((action) => action.userId === userId)
      return NextResponse.json(actions)
    } else {
      const actions = await dbGetUserActions({ userId })
      return NextResponse.json(actions)
    }
  } catch (error) {
    console.error("Error fetching actions:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

