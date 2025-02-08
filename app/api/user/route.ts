import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function verifyUser(req: Request): Promise<{ user: any } | { error: string }> {
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

// Rest of the route handlers remain the same
export { GET, POST, PUT, DELETE } from "./handlers"

