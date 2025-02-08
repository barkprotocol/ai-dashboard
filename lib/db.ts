// NOTE: This file contains mock database operations.
// Implement mock functions or use local state management instead.

// Mock data
const mockDatabase = {
  users: [
    { id: "1", name: "User 1", email: "user1@example.com" },
    { id: "2", name: "User 2", email: "user2@example.com" },
  ],
  conversations: [
    { id: "1", title: "Conversation 1", userId: "1" },
    { id: "2", title: "Conversation 2", userId: "1" },
  ],
}

export const db = {
  user: {
    findUnique: async ({ where: { id } }: { where: { id: string } }) => {
      return mockDatabase.users.find((user) => user.id === id)
    },
    // Add more user-related mock functions as needed
  },
  conversation: {
    findMany: async ({ where: { userId } }: { where: { userId: string } }) => {
      return mockDatabase.conversations.filter((conv) => conv.userId === userId)
    },
    // Add more conversation-related mock functions as needed
  },
  // Add more mock database operations as needed
}

