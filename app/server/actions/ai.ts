const mockConversations = [
  {
    id: "1",
    title: "Mock Conversation",
    messages: [],
  },
]

export async function generateTitleFromUserMessage({
  message,
}: {
  message: string
}) {
  // Implement mock title generation
  return `Mock Title: ${message.slice(0, 20)}...`
}

export async function createConversation({
  userId,
  title,
}: {
  userId: string
  title: string
}) {
  // Implement mock conversation creation
  const newConversation = {
    id: "2",
    title,
    messages: [],
  }
  mockConversations.push(newConversation)
  return newConversation
}

export async function addMessageToConversation({
  conversationId,
  userId,
  message,
}: {
  conversationId: string
  userId: string
  message: string
}) {
  // Implement mock message addition
  const conversation = mockConversations.find((c) => c.id === conversationId)
  if (conversation) {
    conversation.messages.push({
      id: "1",
      userId,
      message,
      createdAt: new Date(),
    })
    return conversation
  }
  return null
}

export async function getConversationById({
  conversationId,
}: {
  conversationId: string
}) {
  // Implement mock conversation retrieval
  return mockConversations.find((c) => c.id === conversationId)
}

export async function getConversationsByUserId({
  userId,
}: {
  userId: string
}) {
  // Implement mock conversations retrieval
  return mockConversations
}

