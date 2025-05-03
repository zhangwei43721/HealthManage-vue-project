export interface ChatHistory {
  id: number
  userId: number
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string // ISO String
  createdAt: string // ISO String
  imageUrl?: string
}
