export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      actions: {
        Row: {
          id: string
          user_id: string
          conversation_id: string
          name: string
          description: string | null
          params: Json
          triggered: boolean
          paused: boolean
          completed: boolean
          start_time: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          conversation_id: string
          name: string
          description?: string | null
          params: Json
          triggered?: boolean
          paused?: boolean
          completed?: boolean
          start_time?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          conversation_id?: string
          name?: string
          description?: string | null
          params?: Json
          triggered?: boolean
          paused?: boolean
          completed?: boolean
          start_time?: string | null
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          last_message_at: string | null
          last_read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          last_message_at?: string | null
          last_read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          last_message_at?: string | null
          last_read_at?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: string
          content: string
          tool_invocations: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: string
          content: string
          tool_invocations?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: string
          content?: string
          tool_invocations?: Json | null
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

