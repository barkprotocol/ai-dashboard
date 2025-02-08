import { create } from "zustand"

export interface Conversation {
  id: string
  title: string
  lastMessageAt: Date | null
  lastReadAt: Date | null
}

interface ConversationsState {
  conversations: Conversation[]
  isLoading: boolean
  activeId: string | null
  setConversations: (conversations: Conversation[]) => void
  addConversation: (conversation: Conversation) => void
  removeConversation: (id: string) => void
  setActiveId: (id: string | null) => void
  setLoading: (loading: boolean) => void
  markAsRead: (id: string) => void
}

export const useConversationsStore = create<ConversationsState>((set) => ({
  conversations: [],
  isLoading: true,
  activeId: null,
  setConversations: (conversations: Conversation[]) =>
    set((state) => ({
      ...state,
      conversations,
      isLoading: false,
    })),
  addConversation: (conversation: Conversation) =>
    set((state) => ({
      ...state,
      conversations: [conversation, ...state.conversations],
    })),
  removeConversation: (id: string) =>
    set((state) => ({
      ...state,
      conversations: state.conversations.filter((c) => c.id !== id),
    })),
  setActiveId: (id: string | null) =>
    set((state) => ({
      ...state,
      activeId: id,
    })),
  setLoading: (loading: boolean) =>
    set((state) => ({
      ...state,
      isLoading: loading,
    })),
  markAsRead: (id: string) =>
    set((state) => ({
      ...state,
      conversations: state.conversations.map((c) => {
        if (c.id === id) {
          return { ...c, lastReadAt: new Date() }
        }
        return c
      }),
    })),
}))

