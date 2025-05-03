<template>
  <div class="ai-qa-page flex flex-col h-[calc(100vh-60px)] bg-gray-100 dark:bg-gray-900 mt-[60px]">
    <!-- Header -->
    <header
      class="bg-white dark:bg-gray-800 shadow-sm p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white">AI 健康助手</h1>
      <Button type="outline" size="small" :icon="Delete" @click="confirmResetHistory" :disabled="messages.length === 0">
        清空记录
      </Button>
    </header>

    <!-- Chat messages area -->
    <div ref="messageContainer"
      class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div v-for="(message, index) in messages" :key="message.id || index" :class="messageBubbleClass(message.role)">
        <div :class="messageContentClass(message.role)">
          <!-- Display avatar (optional) -->
          <div v-if="message.role === 'assistant'"
            class="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3">
            <Robot theme="outline" size="18" class="text-white" />
          </div>
          <div v-if="message.role === 'user'"
            class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center ml-3 order-2">
            <User theme="outline" size="18" class="text-white" />
          </div>

          <!-- Message Content -->
          <div class="message-text p-3 rounded-lg max-w-xs sm:max-w-md lg:max-w-lg break-words"
            :class="messageTextBackground(message.role)">
            <div v-if="message.role === 'assistant'" v-html="renderMarkdown(message.content)"
              class="text-sm whitespace-pre-wrap prose dark:prose-invert max-w-none"></div>
            <p v-else-if="message.content" class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
            <!-- Image display -->
            <div v-if="message.imageUrl" class="mt-2">
              <img :src="message.imageUrl" alt="Uploaded image" class="max-w-full h-auto rounded-md cursor-pointer"
                @click="previewImage(message.imageUrl)">
            </div>
            <!-- Loading indicator for assistant -->
            <div v-if="message.role === 'assistant' && message.loading"
              class="flex items-center text-xs text-gray-500 mt-1">
              <LoadingOne theme="outline" size="14" spin class="mr-1" />
              思考中...
            </div>
          </div>
        </div>
        <!-- Timestamp -->
        <p class="text-xs text-gray-400 mt-1" :class="message.role === 'user' ? 'text-right mr-12' : 'text-left ml-12'">
          {{ formatTimestamp(message.timestamp) }}
        </p>
      </div>
      <!-- Loading indicator for initial fetch or general loading -->
      <div v-if="isFetchingHistory" class="text-center py-4">
        <LoadingOne theme="outline" size="24" spin class="text-gray-500" />
        <p class="text-sm text-gray-500 mt-1">加载历史记录...</p>
      </div>
    </div>

    <!-- Input area -->
    <footer class="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
      <!-- Image preview -->
      <div v-if="previewImageUrl" class="mb-2 flex items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-md max-w-xs">
        <img :src="previewImageUrl" alt="Preview" class="w-12 h-12 object-cover rounded-md mr-2">
        <span class="text-xs text-gray-600 dark:text-gray-300 truncate flex-1">{{ selectedFile ? selectedFile.name : ''
          }}</span>
        <Button type="text" size="small" :icon="Close" @click="removeSelectedImage"
          class="ml-2 text-gray-500 hover:text-red-500" aria-label="Remove image" />
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <Button type="outline" :icon="Paperclip" @click="triggerImageUpload" aria-label="Upload image" />
        <input ref="imageInput" type="file" accept="image/*" @change="handleImageSelected" class="hidden" />
        <textarea ref="inputTextArea" v-model="newMessage" @keydown.enter.prevent="handleEnterKey"
          placeholder="输入您的问题或描述..."
          class="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          rows="1"></textarea>
        <Button type="primary" :icon="Send" @click="sendMessage"
          :disabled="!newMessage.trim() && !selectedFile || isLoading">
          发送
        </Button>
      </div>
      <!-- Error display -->
      <p v-if="error" class="text-xs text-red-500 mt-2">{{ error }}</p>
    </footer>

    <!-- Image preview modal -->
    <Transition name="fade">
      <div v-if="showImagePreviewModal" class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
        @click="closeImagePreview">
        <img :src="imageToPreview" alt="Image preview" class="max-w-full max-h-full object-contain" @click.stop>
      </div>
    </Transition>

    <!-- Confirmation Dialog -->
    <Transition name="fade">
      <div v-if="showResetConfirm"
        class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">确认操作</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">确定要清空当前对话的所有聊天记录吗？此操作无法撤销。</p>
          <div class="flex justify-end space-x-3">
            <Button type="outline" @click="cancelResetHistory">取消</Button>
            <Button type="danger" @click="executeResetHistory" :disabled="isResetting">确定清空</Button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue';
import Button from '@/components/base/Button.vue'; // Assuming Button component exists
import { Send, Paperclip, Close, Delete, Robot, User, LoadingOne } from '@icon-park/vue-next';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid'; // For generating conversation IDs
import { marked } from 'marked'; // Import marked
import DOMPurify from 'dompurify'; // Import DOMPurify for security

// Import actual API service functions
import { getChatHistory, resetChatHistory, initiateChatStream } from '@/services/aiService';
import type { ChatHistory } from '@/services/aiService'; // Assuming type is exported from service
// Assuming axiosConfig and auth service are correctly set up

// Reuse the Message interface, maybe move ChatHistory from aiService to a shared type file
interface Message extends Partial<ChatHistory> { // Make ChatHistory properties optional for transient messages
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO string format
  imageUrl?: string; // Optional image URL for user messages
  loading?: boolean; // Optional loading state for assistant messages
  // conversationId is implicitly handled by the component state
}

const messages = ref<Message[]>([]);
const newMessage = ref('');
const selectedFile = ref<File | null>(null);
const previewImageUrl = ref<string | null>(null);
const imageInput = ref<HTMLInputElement | null>(null);
const inputTextArea = ref<HTMLTextAreaElement | null>(null);
const messageContainer = ref<HTMLDivElement | null>(null);
const isLoading = ref(false); // Loading state for AI response
const isFetchingHistory = ref(false); // Loading state for initial history fetch
const isResetting = ref(false); // Loading state for resetting history
const error = ref<string | null>(null);
// Let's manage conversationId more dynamically
let currentConversationId: string | null = null; // Use a reactive variable if you need UI updates based on it

// Image Preview Modal
const showImagePreviewModal = ref(false);
const imageToPreview = ref<string | null>(null);

// Reset Confirmation Modal
const showResetConfirm = ref(false);

// --- Methods ---

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

const adjustTextAreaHeight = () => {
  if (inputTextArea.value) {
    inputTextArea.value.style.height = 'auto'; // Reset height
    inputTextArea.value.style.height = `${inputTextArea.value.scrollHeight}px`;
  }
};

watch(newMessage, () => {
  nextTick(adjustTextAreaHeight);
});

const fetchHistory = async () => {
  isFetchingHistory.value = true;
  error.value = null;
  try {
    const history = await getChatHistory(); // Use actual API call

    // Group messages by conversationId
    const conversations: Record<string, Message[]> = {};
    history.forEach(histItem => {
      if (!conversations[histItem.conversationId]) {
        conversations[histItem.conversationId] = [];
      }
      conversations[histItem.conversationId].push({
        ...histItem, // Spread properties from ChatHistory
        timestamp: histItem.createdAt || histItem.timestamp, // Prefer createdAt if available
      });
    });

    // Find the latest conversation based on the last message timestamp
    let latestConvId: string | null = null;
    let latestTimestamp = 0;

    Object.entries(conversations).forEach(([convId, msgs]) => {
      if (msgs.length > 0) {
        const lastMsgTimestamp = new Date(msgs[msgs.length - 1].timestamp).getTime();
        if (lastMsgTimestamp > latestTimestamp) {
          latestTimestamp = lastMsgTimestamp;
          latestConvId = convId;
        }
      }
    });

    if (latestConvId && conversations[latestConvId]) {
      messages.value = conversations[latestConvId];
      currentConversationId = latestConvId;
    } else {
      // No history or no valid conversations, start a new one
      messages.value = [];
      currentConversationId = uuidv4();
      console.log('No history found or starting new conversation:', currentConversationId)
    }

  } catch (err) {
    console.error("Error fetching history:", err);
    error.value = '加载历史记录失败。请检查网络连接或稍后再试。';
    messages.value = []; // Clear messages on error
    currentConversationId = uuidv4(); // Prepare for a new conversation
  } finally {
    isFetchingHistory.value = false;
    scrollToBottom();
  }
};

const triggerImageUpload = () => {
  imageInput.value?.click();
};

const handleImageSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    // Basic validation (e.g., size, type)
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      error.value = '图片大小不能超过 5MB';
      return;
    }
    selectedFile.value = file;
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImageUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    error.value = null; // Clear previous errors
  } else {
    removeSelectedImage(); // Clear if no file selected
  }
};

const removeSelectedImage = () => {
  selectedFile.value = null;
  previewImageUrl.value = null;
  if (imageInput.value) {
    imageInput.value.value = ''; // Reset file input
  }
};

const sendMessage = async () => {
  const text = newMessage.value.trim();
  const file = selectedFile.value;

  if (!text && !file) return;
  if (!currentConversationId) {
    error.value = '无法确定当前会话，请刷新页面重试。';
    return;
  }

  isLoading.value = true;
  error.value = null;

  const userMessage: Message = {
    // conversationId: currentConversationId, // Not needed for display model
    role: 'user',
    content: text,
    timestamp: new Date().toISOString(),
    imageUrl: previewImageUrl.value || undefined
  };
  messages.value.push(userMessage);

  const currentConvId = currentConversationId; // Capture current ID for this request

  newMessage.value = '';
  removeSelectedImage();
  nextTick(adjustTextAreaHeight);
  scrollToBottom();

  const formData = new FormData();
  formData.append('message', text);
  formData.append('conversationId', currentConvId); // Send the determined ID
  if (file) {
    formData.append('file', file);
  }

  let assistantMessageIndex = -1; // Initialize index

  try {
    // Add placeholder for assistant message
    assistantMessageIndex = messages.value.length;
    messages.value.push({
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      loading: true
    });
    scrollToBottom();

    // Initiate the stream using the service
    const response = await initiateChatStream(formData);

    if (!response.body) {
      throw new Error('Response body is missing');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let receivedContent = ''; // Accumulate content for the current message

    // --- Stream Processing ---
    const processStream = async () => {
      console.log('processStream started'); // Log start
      try { // Wrap the entire while loop in try/catch
        while (true) {
          console.log('Waiting for reader.read()...'); // Log before read
          const { done, value } = await reader.read();
          console.log('reader.read() returned:', { done, value }); // Log the raw result

          if (done) {
            if (messages.value[assistantMessageIndex]) {
              messages.value[assistantMessageIndex].loading = false;
            }
            console.log('Stream finished (done=true) for conversation:', currentConvId);
            break;
          }

          if (value) { // Check if value exists
            const decodedChunk = decoder.decode(value, { stream: true });
            console.log('Decoded chunk:', decodedChunk); // Log the decoded chunk
            buffer += decodedChunk;
          } else {
            console.log('Received empty value from reader.read()');
          }

          // Log buffer before splitting
          // console.log('Current buffer:', buffer);

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          // Log lines found
          // console.log('Lines after split:', lines);

          for (const line of lines) {
            const trimmedLine = line.trim(); // Trim whitespace from the line
            // console.log('Processing trimmed line:', trimmedLine);

            // Check the trimmed line - REMOVED SPACE after 'data:'
            if (trimmedLine.startsWith('data:')) {
              try {
                // Process the trimmed line, removing 'data:'
                const rawData = trimmedLine.substring(5).trim(); // Use index 5 for 'data:'
                if (!rawData || rawData === '[DONE]') {
                  if (rawData === '[DONE]') {
                    console.log('Received [DONE] signal.');
                    if (assistantMessageIndex !== -1 && messages.value[assistantMessageIndex]) {
                      messages.value[assistantMessageIndex].loading = false;
                      // Optionally check if content is empty and provide a fallback
                      if (!messages.value[assistantMessageIndex].content) {
                        messages.value[assistantMessageIndex].content = "AI 助手没有返回内容。";
                      }
                    }
                  }
                  continue; // Skip empty data lines or the DONE signal
                }

                try { // Wrap JSON.parse
                  const jsonData = JSON.parse(rawData);
                  // console.log('Parsed SSE data:', jsonData); // Can uncomment for deep debugging

                  // Extract content based on OpenAI format
                  const contentPart = jsonData.choices?.[0]?.delta?.content;
                  if (contentPart) {
                    // Append content to the existing message
                    if (assistantMessageIndex !== -1 && messages.value[assistantMessageIndex]) {
                      messages.value[assistantMessageIndex].content += contentPart;
                      messages.value[assistantMessageIndex].loading = false; // Turn off loading once first chunk arrives
                      scrollToBottom(); // Scroll as content arrives
                    } else {
                      console.error('Assistant message placeholder not found at index:', assistantMessageIndex)
                    }
                  }

                  // Check for finish reason (optional, handled by DONE signal usually)
                  const finishReason = jsonData.choices?.[0]?.finish_reason;
                  if (finishReason === 'stop' && assistantMessageIndex !== -1 && messages.value[assistantMessageIndex]) {
                    messages.value[assistantMessageIndex].loading = false;
                    console.log('Stream finished (finish_reason=stop)');
                  }

                } catch (jsonError) {
                  console.error('Error parsing JSON data:', jsonError, 'Raw data:', rawData);
                  // Append raw data on error? Or show a generic error?
                  if (assistantMessageIndex !== -1 && messages.value[assistantMessageIndex]) {
                    messages.value[assistantMessageIndex].content += `\\n[Error parsing chunk: ${rawData}]`;
                    messages.value[assistantMessageIndex].loading = false;
                  }
                }

              } catch (e) {
                // This catch block is for errors during substring/trimming before JSON parse
                console.error('Error processing stream line before JSON parse:', e, 'Raw line:', line);
              }
            } else if (trimmedLine) { // Check trimmedLine to avoid logging empty lines
              // Log lines that don't start with data: but are not empty
              console.log('Non-data line received:', trimmedLine);
            }
          }
        }
      } catch (streamError) {
        // Catch errors happening during the read/decode loop
        console.error('Error within processStream loop:', streamError);
        error.value = '处理AI响应流时出错。'
        if (assistantMessageIndex !== -1 && messages.value[assistantMessageIndex]) {
          messages.value[assistantMessageIndex].content = `处理AI响应流时出错: ${streamError instanceof Error ? streamError.message : String(streamError)}`;
          messages.value[assistantMessageIndex].loading = false;
        }
      }
    };

    await processStream();

  } catch (err) {
    console.error("Error sending message or processing stream:", err);
    error.value = (err instanceof Error) ? err.message : '发送消息时出错，请检查网络或稍后再试。';
    // Update or remove the placeholder on error
    if (assistantMessageIndex !== -1 && messages.value[assistantMessageIndex]) {
      if (messages.value[assistantMessageIndex].content === '') {
        // If assistant never sent anything, provide an error message
        messages.value[assistantMessageIndex].content = `抱歉，处理时遇到问题: ${error.value}`;
      }
      messages.value[assistantMessageIndex].loading = false;
    }
  } finally {
    isLoading.value = false;
    // Ensure loading is always false at the end for the last message if it exists
    if (assistantMessageIndex !== -1 && messages.value[assistantMessageIndex]) {
      messages.value[assistantMessageIndex].loading = false;
    }
  }
};

const handleEnterKey = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

// --- Formatting and Styling ---

const formatTimestamp = (isoString: string | Date): string => {
  try {
    return format(new Date(isoString), 'HH:mm');
  } catch {
    return '';
  }
};

const messageBubbleClass = (role: 'user' | 'assistant') => [
  'flex',
  role === 'user' ? 'justify-end' : 'justify-start'
];

const messageContentClass = (role: 'user' | 'assistant') => [
  'flex items-end',
  role === 'user' ? 'flex-row-reverse' : 'flex-row'
];

const messageTextBackground = (role: 'user' | 'assistant') => [
  role === 'user' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-700 dark:text-gray-200 text-gray-800 shadow-sm'
];

// Image Preview Logic
const previewImage = (url: string | null) => {
  if (url) {
    imageToPreview.value = url;
    showImagePreviewModal.value = true;
  }
};

const closeImagePreview = () => {
  showImagePreviewModal.value = false;
  imageToPreview.value = null;
};

// History Reset Logic
const confirmResetHistory = () => {
  showResetConfirm.value = true;
};

const cancelResetHistory = () => {
  showResetConfirm.value = false;
};

const executeResetHistory = async () => {
  if (!currentConversationId) {
    error.value = '没有找到当前会话，无法清空。';
    showResetConfirm.value = false;
    return;
  }
  isResetting.value = true;
  error.value = null;
  try {
    await resetChatHistory(currentConversationId); // Use actual API call with current ID
    messages.value = [];
    currentConversationId = uuidv4(); // Start a new conversation ID
    showResetConfirm.value = false;
    console.log('History reset, new conversation ID:', currentConversationId)

  } catch (err) {
    console.error("Error resetting history:", err);
    error.value = (err instanceof Error) ? err.message : '清空记录失败。';
    // Optionally keep the confirmation modal open on error
    // showResetConfirm.value = false;
  } finally {
    isResetting.value = false;
  }
};

// --- Markdown Rendering ---
const renderMarkdown = (content: string): string => {
  // Basic check if content might be markdown (contains common markdown chars)
  // This is a heuristic, adjust if needed.
  const mightBeMarkdown = /[#*`[\]()]/.test(content);
  if (!mightBeMarkdown) {
    return content; // Return plain text if unlikely to be markdown
  }
  try {
    // Use DOMPurify to sanitize the HTML output of marked
    // Ensure marked output is treated as string before sanitizing
    const rawHtml = marked(content) as string;
    return DOMPurify.sanitize(rawHtml);
  } catch (e) {
    console.error("Error rendering markdown:", e);
    return content; // Fallback to plain text on error
  }
};

// --- Lifecycle ---

onMounted(() => {
  fetchHistory();
  adjustTextAreaHeight();
});

watch(messages, () => {
  scrollToBottom();
}, { deep: true });

</script>

<style scoped>
/* Add styles for rendered markdown if needed */
.prose :where(code):not(:where([class~="not-prose"] *))::before,
.prose :where(code):not(:where([class~="not-prose"] *))::after {
  content: "";
  /* Remove default backticks from prose code blocks */
}

/* Style adjustments if needed */
.ai-qa-page {
  /* Ensures the page takes full height relative to the viewport minus header */
}

/* Smooth scroll behavior */
div[ref="messageContainer"] {
  scroll-behavior: smooth;
}

/* Custom scrollbar (optional) */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

dark ::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

textarea {
  min-height: 40px;
  /* Minimum height for the textarea */
  max-height: 120px;
  /* Maximum height before scrolling */
  transition: height 0.1s ease-out;
}

/* Fade transition for modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
