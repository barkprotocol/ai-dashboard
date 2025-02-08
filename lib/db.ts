import { supabase } from "./supabase-client"

export const db = {
  user: {
    findUnique: async ({ where: { id } }: { where: { id: string } }) => {
      const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

      if (error) throw error
      return data
    },
    // Add more user-related functions as needed
  },
  conversation: {
    findMany: async ({ where: { userId } }: { where: { userId: string } }) => {
      const { data, error } = await supabase.from("conversations").select("*").eq("user_id", userId)

      if (error) throw error
      return data
    },
    // Add more conversation-related functions as needed
  },
  // Add more database operations as needed
}

