import { createServerSupabaseClient } from "@/utils/supabase/server"

export async function verifyUser() {
  const supabase = createServerSupabaseClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { error: "No session found", data: null }
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single()

    if (userError) {
      console.error("Error fetching user data:", userError)
      return { error: userError.message, data: null }
    }

    return { error: null, data: { session, data: userData } }
  } catch (error) {
    console.error("Error verifying user:", error)
    return { error: "Failed to verify user", data: null }
  }
}

