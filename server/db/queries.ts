import { createServerSupabaseClient } from "@/utils/supabase/server"
import type { Database } from "@/types/supabase"

type Tables = Database["public"]["Tables"]
type UserAction = Tables["user_actions"]["Row"]
type Message = Tables["messages"]["Row"]
type Conversation = Tables["conversations"]["Row"]

export async function dbGetUserActions({ userId }: { userId: string }) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("user_actions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user actions:", error)
    throw error
  }

  return data
}

export async function dbUpdateAction({
  id,
  userId,
  data,
}: {
  id: string
  userId: string
  data: Partial<UserAction>
}) {
  const supabase = createServerSupabaseClient()

  const { data: updatedAction, error } = await supabase
    .from("user_actions")
    .update(data)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating action:", error)
    throw error
  }

  return updatedAction
}

export async function dbDeleteAction({
  id,
  userId,
}: {
  id: string
  userId: string
}) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("user_actions")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error deleting action:", error)
    throw error
  }

  return data
}

export async function dbGetConversation({
  conversationId,
}: {
  conversationId: string
}) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("conversations").select("*").eq("id", conversationId).single()

  if (error) {
    console.error("Error fetching conversation:", error)
    throw error
  }

  return data
}

export async function dbGetConversationMessages({
  conversationId,
}: {
  conversationId: string
}) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching conversation messages:", error)
    throw error
  }

  return data
}

export async function dbSaveConversation({
  userId,
  title,
}: {
  userId: string
  title: string
}) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("conversations")
    .insert([{ user_id: userId, title }])
    .select()
    .single()

  if (error) {
    console.error("Error saving conversation:", error)
    throw error
  }

  return data as Conversation
}

export async function dbSaveMessage({
  conversationId,
  content,
  role,
}: {
  conversationId: string
  content: string
  role: string
}) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("messages")
    .insert([{ conversation_id: conversationId, content, role }])
    .select()
    .single()

  if (error) {
    console.error("Error saving message:", error)
    throw error
  }

  return data as Message
}

