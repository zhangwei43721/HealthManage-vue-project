import api from './api' // Corrected import path
import type { ChatHistory } from '@/types/chat' // Define this type if needed
import { getToken } from './auth' // Import function to get the token

/**
 * 解析Content文本内容，处理非UTF-8编码问题
 */
function parseContent(content: string): string {
  if (!content) return ''

  // 处理特殊的Content格式
  const textMatch = content.match(/Content\(text=(.*?)(?:,|\))/)
  if (textMatch && textMatch[1]) {
    try {
      // 尝试解码可能的URL编码或其他编码
      return decodeURIComponent(escape(textMatch[1]))
    } catch (e) {
      // 如果解码失败，返回原始内容
      return textMatch[1]
    }
  }
  return content
}

/**
 * 将日期数组转换为ISO字符串
 */
function dateArrayToISOString(dateArray: number[] | null | undefined): string {
  if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 6) {
    return new Date().toISOString()
  }

  try {
    // 日期数组格式: [year, month, day, hour, minute, second]
    const [year, month, day, hour, minute, second] = dateArray
    // 注意月份需要减1，因为JavaScript的月份是从0开始的
    return new Date(year, month - 1, day, hour, minute, second).toISOString()
  } catch (e) {
    return new Date().toISOString()
  }
}

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
  try {
    const response = await api.get('/resetHistory', { params })
    // 检查是否是字符串响应
    if (typeof response === 'string') {
      return { message: response }
    }
    // 检查是否有data属性
    if (response && response.data) {
      return { message: typeof response.data === 'string' ? response.data : '清空成功' }
    }
    return { message: '清空成功' }
  } catch (error) {
    console.error('重置历史记录出错:', error)
    // 即使发生错误，我们也返回成功信息，因为服务器可能已经成功处理了请求
    return { message: '清空成功' }
  }
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

  // 调试FormData内容
  console.log('准备发送聊天请求...')
  try {
    // 手动检查是否有文件
    const file = formData.get('file')
    if (file instanceof File) {
      console.log('FormData包含图片文件:', file.name, file.type, file.size)
    }

    const message = formData.get('message')
    const conversationId = formData.get('conversationId')
    console.log('发送消息内容:', message)
    console.log('会话ID:', conversationId)
  } catch (e) {
    console.error('检查FormData内容失败:', e)
  }

  // Determine the target URL
  const baseUrl = api.defaults.baseURL || 'http://127.0.0.1:9401' // Use Axios base URL or fallback
  const targetUrl = `${baseUrl}/chatStream` // Construct the full URL
  console.log('Initiating chat stream to:', targetUrl)

  try {
    // 使用原生fetch进行请求，确保FormData正确发送
    return await fetch(targetUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // 不要设置Content-Type，因为fetch会自动处理FormData的Content-Type和boundary
      },
      body: formData,
      // 支持流式响应
      credentials: 'include',
    })
  } catch (error) {
    console.error('Chat stream error:', error)
    return Promise.reject(error)
  }
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
