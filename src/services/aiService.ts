import api from './api' // Corrected import path
import type { ChatHistory } from '@/types/chat' // Define this type if needed
import { getToken } from './auth' // Import function to get the token

/**
 * Fetches the chat history and processes it into the expected format.
 * @returns Promise<ChatHistory[]>
 */
export const getChatHistory = async (): Promise<ChatHistory[]> => {
  const historyData = await api.get<RawChatHistoryItem[]>('/viewHistory')

  if (!Array.isArray(historyData)) {
    console.error('Invalid history response format received from interceptor:', historyData)
    return [] // Return empty array or throw error
  }

  return historyData.map((item) => ({
    ...item,
    content: parseContent(item.content),
    timestamp: dateArrayToISOString(item.timestamp),
    createdAt: dateArrayToISOString(item.createdAt),
  }))
}

/**
 * Resets the chat history for a specific conversation or all conversations.
 * @param conversationId Optional conversation ID to reset.
 * @returns Promise<{ message: string }>
 */
export const resetChatHistory = async (conversationId?: string): Promise<{ message: string }> => {
  const params = conversationId ? { conversationId } : {}
  const response = await api.get<{ message: string }>('/resetHistory', { params })
  return response.data
}

/**
 * Initiates the chat stream.
 * Note: This function only makes the initial POST request.
 * The actual EventSource handling should be done in the component.
 * We pass the token directly here as EventSource doesn't easily use interceptors.
 *
 * @param formData FormData containing message, file (optional), and conversationId.
 * @returns Promise<Response> The raw fetch response to access the stream.
 */
export const initiateChatStream = async (formData: FormData): Promise<Response> => {
  const token = getToken() // Get the token
  if (!token) {
    return Promise.reject(new Error('User not authenticated'))
  }

  // Determine the target URL
  const baseUrl = api.defaults.baseURL || 'http://127.0.0.1:9401' // Use Axios base URL or fallback
  const targetUrl = `${baseUrl}/chatStream` // Construct the full URL
  console.log('Initiating chat stream to:', targetUrl) // Log the target URL

  // IMPORTANT: Fetch API is used directly here for streaming response.
  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'X-Token': token, // Add token manually
      // 'Content-Type' is set automatically by FormData
    },
    body: formData,
  })

  if (!response.ok) {
    // Attempt to read error message from response if possible
    let errorMsg = `API error: ${response.status} ${response.statusText}`
    try {
      const errorData = await response.json()
      errorMsg = errorData.message || errorMsg
    } catch {
      /* Ignore if response is not JSON */
    }
    throw new Error(errorMsg)
  }

  return response // Return the raw response for stream processing
}

// ChatHistory type is now imported from '@/types/chat'

// Define the raw API response type
interface RawChatHistoryItem {
  id: number
  userId: number
  conversationId: string
  role: 'user' | 'assistant'
  content: string // Raw content string like "Content(text=...)"
  timestamp: number[] // Array like [year, month, day, hour, minute, second]
  createdAt: number[] // Array like [year, month, day, hour, minute, second]
}

/**
 * Helper function to parse the raw content string.
 * Extracts text between "text=" and the next "," or ")".
 */
const parseContent = (rawContent: string): string => {
  const match = rawContent.match(/text=([^,)]*)/)
  return match ? match[1] : rawContent // Return extracted text or original string as fallback
}

/**
 * Helper function to convert date array to ISO string.
 * Note: JS months are 0-indexed, API likely 1-indexed.
 */
const dateArrayToISOString = (dateArray: number[] | null | undefined): string => {
  if (!dateArray || dateArray.length < 6) {
    return new Date().toISOString() // Fallback to now
  }
  // Adjust month (dateArray[1]) to be 0-indexed for JS Date
  const [year, month, day, hour, minute, second] = dateArray
  // Basic validation to prevent invalid dates
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59
  ) {
    console.warn('Invalid date array received:', dateArray)
    return new Date().toISOString() // Fallback
  }
  try {
    // Use UTC to avoid timezone issues if the backend time is implicitly UTC
    // Or use Date constructor directly if the backend time is local
    // return new Date(Date.UTC(year, month - 1, day, hour, minute, second)).toISOString();
    return new Date(year, month - 1, day, hour, minute, second).toISOString()
  } catch (e) {
    console.error('Error converting date array:', dateArray, e)
    return new Date().toISOString() // Fallback on error
  }
}
