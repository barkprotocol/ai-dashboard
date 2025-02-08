import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function verifyUser(req: NextRequest): Promise<{ user: any } | { error: string }> {
  try {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1]

    if (!token) {
      return { error: "No token provided" }
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return { error: "Invalid token" }
    }

    return { user }
  } catch (error) {
    console.error("User verification error:", error)
    return { error: "Internal Server Error" }
  }
}

export async function GET(req: NextRequest) {
  const verificationResult = await verifyUser(req)
  if ("error" in verificationResult) {
    return NextResponse.json(verificationResult, { status: 401 })
  }

  try {
    const userId = req.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { data: user, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) {
      throw error
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("User fetch error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const verificationResult = await verifyUser(req)
  if ("error" in verificationResult) {
    return NextResponse.json(verificationResult, { status: 401 })
  }

  try {
    const userData = await req.json()

    const { data: user, error } = await supabase.from("users").insert([userData]).select().single()

    if (error) {
      throw error
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const verificationResult = await verifyUser(req)
  if ("error" in verificationResult) {
    return NextResponse.json(verificationResult, { status: 401 })
  }

  try {
    const { id, ...updateData } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { data: user, error } = await supabase.from("users").update(updateData).eq("id", id).select().single()

    if (error) {
      throw error
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("User update error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const verificationResult = await verifyUser(req)
  if ("error" in verificationResult) {
    return NextResponse.json(verificationResult, { status: 401 })
  }

  try {
    const userId = req.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("users").delete().eq("id", userId)

    if (error) {
      throw error
    }

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("User deletion error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

