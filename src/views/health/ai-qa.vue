// eslint-disable no-this-alias
// eslint-disable no-this-alias
<template>
  <div
    class="ai-qa-page flex flex-col h-[calc(100vh-60px)] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 mt-[60px]">
    <!-- Enhanced Header with gradient -->
    <header
      class="bg-white dark:bg-gray-800 shadow-md p-4 border-b border-gray-200 dark:border-gray-700 fixed top-[60px] left-0 right-0 z-10">
      <div class="max-w-5xl mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-3">
          <div class="bg-gradient-to-r from-primary to-blue-500 p-2 rounded-lg shadow-sm">
            <Robot theme="filled" size="20" class="text-white" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-800 dark:text-white">AI 健康助手</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">基于专业医疗知识库，为您提供健康咨询</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <Button type="outline" size="small" :icon="Delete" @click="confirmResetHistory"
            :disabled="messages.length === 0">
            清空记录
          </Button>
        </div>
      </div>
    </header>

    <!-- Chat messages area with improved styling -->
    <div ref="messageContainer"
      class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent mt-[128px]">
      <!-- Welcome message when no messages -->
      <div v-if="messages.length === 0 && !isFetchingHistory"
        class="max-w-md mx-auto text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-4">
        <Robot theme="filled" size="40" class="text-primary mx-auto mb-3" />
        <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-2">欢迎使用 AI 健康助手</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
          您可以询问任何健康相关的问题，上传医学影像获取分析，或者咨询日常健康建议。
        </p>
        <div class="grid grid-cols-1 gap-2 text-left">
          <button @click="applyQuickPrompt('请分析我最近的血压数据，提供健康建议')"
            class="p-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-left transition-colors">
            请分析我最近的血压数据，提供健康建议
          </button>
          <button @click="applyQuickPrompt('帮我制定一个减肥计划，我的BMI是26')"
            class="p-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-left transition-colors">
            帮我制定一个减肥计划，我的BMI是26
          </button>
          <button @click="applyQuickPrompt('我经常头痛，可能是什么原因？')"
            class="p-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-left transition-colors">
            我经常头痛，可能是什么原因？
          </button>
        </div>
      </div>

      <!-- Message bubbles with enhanced styling -->
      <div v-for="(message, index) in messages" :key="message.id || index"
        class="flex transition-all duration-300 ease-in-out group hover:shadow-md"
        :class="{ 'justify-end': message.role === 'user', 'justify-start': message.role === 'assistant' }">

        <!-- 助手头像 - 只在左侧显示 -->
        <div v-if="message.role === 'assistant'"
          class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center mr-3 shadow-sm self-end">
          <Robot theme="filled" size="20" class="text-white" />
        </div>

        <!-- 消息内容 -->
        <div
          class="message-text p-4 rounded-lg max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl break-words shadow-sm relative group"
          :class="messageTextBackground(message.role)">

          <!-- 图片显示 - 移到文字前面 -->
          <div v-if="message.imageUrl" class="mb-3">
            <div
              class="relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 shadow-sm">
              <img :src="message.imageUrl" alt="Image" class="max-w-full h-auto cursor-pointer"
                @click="previewImage(message.imageUrl)">
              <div
                class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                <button @click.stop="previewImage(message.imageUrl)"
                  class="transform scale-0 hover:scale-100 transition-transform bg-black bg-opacity-70 text-white p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Render Markdown for assistant text -->
          <div v-if="message.role === 'assistant' && message.content" v-html="renderMarkdown(message.content)"
            class="text-sm whitespace-pre-wrap prose dark:prose-invert max-w-none"></div>

          <!-- Render plain text for user text -->
          <p v-else-if="message.role === 'user' && message.content" class="text-sm whitespace-pre-wrap">
            {{ message.content }}
          </p>

          <!-- 助手消息的操作按钮 -->
          <div v-if="message.role === 'assistant' && message.content && !message.loading"
            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="copyToClipboard(message.content)"
              class="p-1 text-gray-400 hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="复制内容">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          <!-- 助手加载中指示器 -->
          <div v-if="message.role === 'assistant' && message.loading"
            class="flex items-center text-xs text-gray-500 mt-2 bg-gray-100 dark:bg-gray-700 p-1.5 rounded-md">
            <div class="flex space-x-1 mx-auto">
              <div class="w-2 h-2 rounded-full bg-primary animate-bounce delay-75"></div>
              <div class="w-2 h-2 rounded-full bg-primary animate-bounce delay-100"></div>
              <div class="w-2 h-2 rounded-full bg-primary animate-bounce delay-150"></div>
            </div>
          </div>

          <!-- 消息时间戳 -->
          <div :class="[
            'text-[10px] text-gray-400 absolute',
            message.role === 'user' ? '-bottom-4 right-2' : '-bottom-4 left-2'
          ]">
            {{ formatTimestamp(message.timestamp) }}
          </div>
        </div>

        <!-- 用户头像 - 只在右侧显示 -->
        <div v-if="message.role === 'user'"
          class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center ml-3 shadow-sm self-end">
          <User theme="filled" size="20" class="text-white" />
        </div>
      </div>

      <!-- Enhanced loading indicator for initial fetch -->
      <div v-if="isFetchingHistory" class="text-center py-4">
        <div
          class="inline-flex justify-center items-center space-x-2 p-3 rounded-full shadow-md bg-white dark:bg-gray-800">
          <div class="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
          <div class="w-3 h-3 rounded-full bg-primary animate-pulse delay-150"></div>
          <div class="w-3 h-3 rounded-full bg-primary animate-pulse delay-300"></div>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">正在加载历史记录...</p>
      </div>
    </div>

    <!-- Input area with enhanced styling -->
    <footer class="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 shadow-md">
      <div class="max-w-5xl mx-auto">
        <!-- Image preview with improved styling -->
        <div v-if="previewImageUrl"
          class="mb-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 shadow-sm relative">
          <div class="flex items-start">
            <div
              class="relative w-16 h-16 rounded-md overflow-hidden bg-white border border-gray-200 dark:border-gray-600">
              <img :src="previewImageUrl" alt="Preview" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all"></div>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-xs">
                {{ selectedFile ? selectedFile.name : '' }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ selectedFile ? formatFileSize(selectedFile.size) : '' }}
              </p>
            </div>
            <Button type="text" size="small" :icon="Close" @click="removeSelectedImage"
              class="text-gray-400 hover:text-red-500 transition-colors" aria-label="Remove image" />
          </div>
        </div>

        <!-- Enhanced input controls with animations -->
        <div class="flex items-center gap-2 sm:gap-3 relative">
          <!-- File Input Trigger with enhanced styling -->
          <label for="imageUploadInput"
            class="inline-flex items-center justify-center p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
            <Paperclip class="h-5 w-5" aria-hidden="true" />
            <span class="sr-only">上传图片</span>
          </label>
          <input id="imageUploadInput" ref="imageInput" type="file" accept="image/*" @change="handleImageSelected"
            class="hidden" />

          <!-- Textarea with auto-expand and improved styling -->
          <div class="relative flex-1">
            <textarea ref="inputTextArea" v-model="newMessage" @keydown.enter.prevent="handleEnterKey"
              placeholder="输入您的健康问题或上传医学图像..."
              class="w-full resize-none border border-gray-300 dark:border-gray-600 rounded-lg p-3 pl-3 pr-14 text-sm focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 shadow-sm"
              :rows="textareaRows" @input="handleTextareaInput" :style="{ minHeight: '44px', maxHeight: '160px' }"
              :disabled="isLoading"></textarea>

            <!-- Character count - show when typing -->
            <div v-if="newMessage.length > 0"
              class="absolute bottom-2 right-12 text-[10px] text-gray-400 dark:text-gray-500 pointer-events-none transition-opacity duration-200"
              :class="newMessage.length > 500 ? 'text-amber-500 dark:text-amber-400' : ''">
              {{ newMessage.length }}/1000
            </div>

            <!-- Send button inside textarea - with larger size and higher visibility -->
            <button @click="sendMessage" :disabled="!newMessage.trim() && !selectedFile || isLoading" :class="[
              'absolute right-2 bottom-2 p-2.5 rounded-md text-white transition-all duration-150',
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600',
              (!newMessage.trim() && !selectedFile) ? 'opacity-70 cursor-not-allowed' : 'opacity-100',
            ]">
              <Send v-if="!isLoading" class="h-6 w-6" />
              <LoadingOne v-else theme="outline" size="22" spin />
            </button>
          </div>
        </div>

        <!-- Suggestions or shortcuts when input is focused -->
        <div v-if="inputFocused && !newMessage.trim() && !isMobile" class="mt-2 flex flex-wrap gap-2">
          <button v-for="(prompt, i) in quickPrompts" :key="i" @click="applyQuickPrompt(prompt)"
            class="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1.5 rounded-full text-gray-700 dark:text-gray-300 transition-colors">
            {{ prompt }}
          </button>
        </div>

        <!-- Error display with improved styling -->
        <div v-if="error" class="mt-2 flex items-center">
          <Close theme="filled" size="16" class="text-red-500 mr-1" />
          <p class="text-xs text-red-500">{{ error }}</p>
        </div>

        <!-- Voice input status if implemented -->
        <div v-if="isRecording" class="mt-2 flex items-center justify-center">
          <div
            class="flex items-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full">
            <div class="animate-pulse w-2 h-2 bg-red-500 rounded-full"></div>
            <span class="text-xs">正在录音...</span>
            <button @click="stopRecording" class="text-xs underline">停止</button>
          </div>
        </div>
      </div>
    </footer>

    <!-- Enhanced Image preview modal with zoom controls -->
    <Transition name="fade">
      <div v-if="showImagePreviewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click="closeImagePreview">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
        <div class="relative z-10 bg-transparent rounded-lg shadow-2xl max-w-5xl max-h-[90vh] w-full overflow-hidden">
          <div class="absolute top-4 right-4 flex space-x-2 z-20">
            <button @click.stop="zoomIn"
              class="p-2 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button @click.stop="zoomOut"
              class="p-2 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6" />
              </svg>
            </button>
            <button @click.stop="resetZoom"
              class="p-2 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
            <button @click.stop="closeImagePreview"
              class="p-2 bg-red-600/80 hover:bg-red-500/80 text-white rounded-full shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="h-full overflow-auto flex items-center justify-center p-4 image-container">
            <img :src="imageToPreview" alt="Image preview"
              class="max-w-full max-h-[80vh] object-contain transition-transform duration-200 ease-in-out select-none"
              :style="{ transform: `scale(${imageZoom})` }" @click.stop @wheel.stop="handleImageWheel" />
          </div>
          <!-- 图片信息显示 -->
          <div
            class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
            缩放: {{ Math.round(imageZoom * 100) }}%
          </div>
        </div>
      </div>
    </Transition>

    <!-- Enhanced Confirmation Dialog -->
    <Transition name="fade">
      <div v-if="showResetConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click="cancelResetHistory">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div @click.stop class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full relative z-10">
          <div
            class="bg-red-100 dark:bg-red-900/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Close theme="filled" size="24" class="text-red-500 dark:text-red-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">确认清空记录</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
            确定要清空当前对话的所有聊天记录吗？<br>此操作无法撤销。
          </p>
          <div class="flex justify-center space-x-3">
            <Button type="outline" @click="cancelResetHistory">取消</Button>
            <Button type="danger" @click="executeResetHistory" :disabled="isResetting">
              <LoadingOne v-if="isResetting" theme="outline" size="16" spin class="mr-1" />
              确定清空
            </Button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notification -->
    <Transition name="fade">
      <div v-if="toast.show"
        class="fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2"
        :class="{
          'bg-green-500 text-white': toast.type === 'success',
          'bg-red-500 text-white': toast.type === 'error',
          'bg-blue-500 text-white': toast.type === 'info'
        }">
        <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
          fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd" />
        </svg>
        <svg v-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
          fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd" />
        </svg>
        <span class="text-sm font-medium">{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
// eslint-disable no-this-alias
// eslint-disable no-this-alias
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue';
import Button from '@/components/base/Button.vue';
import { Send, Paperclip, Close, Delete, Robot, User, LoadingOne } from '@icon-park/vue-next';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

import { getChatHistory, resetChatHistory, initiateChatStream } from '@/services/aiService';
import type { ChatHistory } from '@/types/chat';
type DebounceableFunction = (...args: unknown[]) => unknown;
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imageUrl?: string;
  id?: string | number;
  loading?: boolean;
}

const messages = ref<Message[]>([]);
const newMessage = ref('');
const selectedFile = ref<File | null>(null);
const previewImageUrl = ref<string | null>(null);
const imageInput = ref<HTMLInputElement | null>(null);
const inputTextArea = ref<HTMLTextAreaElement | null>(null);
const messageContainer = ref<HTMLDivElement | null>(null);
const isLoading = ref(false);
const isFetchingHistory = ref(false);
const isResetting = ref(false);
const error = ref<string | null>(null);
let currentConversationId: string | null = null;

const showImagePreviewModal = ref(false);
const imageToPreview = ref<string | null>(null);
const showResetConfirm = ref(false);
const imageZoom = ref(1);
const textareaRows = ref(1);
const inputFocused = ref(false);
const isMobile = ref(false);
const isRecording = ref(false);
const quickPrompts = [
  '我最近总是感到疲劳，可能是什么原因？',
  '请分析这张X光片',
  '如何预防季节性流感？',
  '什么是地中海饮食？',
  '怎样改善睡眠质量？'
];
const toast = ref<{ show: boolean; message: string; type: 'success' | 'error' | 'info'; }>({ show: false, message: '', type: 'info' });

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

const adjustTextAreaHeight = () => {
  if (inputTextArea.value) {
    inputTextArea.value.style.height = 'auto';
    const scrollHeight = inputTextArea.value.scrollHeight;
    const maxHeight = 160;
    inputTextArea.value.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  }
};


watch(newMessage, () => {
  nextTick(adjustTextAreaHeight);
});

const fetchHistory = async () => {
  isFetchingHistory.value = true;
  error.value = null;
  try {
    const history = await getChatHistory();

    const conversations: Record<string, Message[]> = {};
    history.forEach(histItem => {
        const convId = histItem.conversationId;
        if (!conversations[convId]) {
            conversations[convId] = [];
        }
        // Ensure timestamp exists and is a string for consistent typing
        const timestamp = histItem.createdAt || histItem.timestamp || new Date().toISOString();
        conversations[convId].push({
            ...histItem,
            timestamp: String(timestamp), // Force string conversion
            id: histItem.id || uuidv4() // Ensure ID exists
        });
    });


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
      messages.value = conversations[latestConvId].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      currentConversationId = latestConvId;
    } else {
      messages.value = [];
      currentConversationId = uuidv4();
      console.log('No history found or starting new conversation:', currentConversationId)
    }

  } catch (err) {
    console.error("Error fetching history:", err);
    error.value = '加载历史记录失败。请检查网络连接或稍后再试。';
    messages.value = [];
    currentConversationId = uuidv4();
  } finally {
    isFetchingHistory.value = false;
    scrollToBottom();
  }
};

const handleImageSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      error.value = '图片大小不能超过 5MB';
      showToast('图片大小不能超过 5MB', 'error');
      return;
    }
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImageUrl.value = e.target?.result as string;
      suggestPromptForImage(file);
    };
    reader.readAsDataURL(file);
    error.value = null;
  } else {
    removeSelectedImage();
  }
};

const removeSelectedImage = () => {
  selectedFile.value = null;
  previewImageUrl.value = null;
  if (imageInput.value) {
    imageInput.value.value = '';
  }
};

const markdownCache = new Map();
const renderMarkdown = (content: string): string => {
  if (markdownCache.has(content)) {
    return markdownCache.get(content);
  }
  const mightBeMarkdown = /[#*`[\]()>\-_!]/.test(content) || /\n\s*\n/.test(content); // Added more checks
    if (!mightBeMarkdown && !content.includes('\n')) {
        // Only cache if it's unlikely to be Markdown and single line
        markdownCache.set(content, content);
        return content;
    }


  try {
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
    const rawHtml = marked.parse(content);
    const cleanHtml = typeof rawHtml === 'string'
      ? DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true },
                ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
                  'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'span'],
                ALLOWED_ATTR: ['href', 'name', 'target', 'src', 'alt', 'class', 'style', 'title', 'id'] // Added title, id
      })
      : content;
    markdownCache.set(content, cleanHtml);
    return cleanHtml;
  } catch (e) {
    console.error("渲染 Markdown 时出错:", e);
    markdownCache.set(content, content);
    return content;
  }
};

const debounce = <F extends DebounceableFunction>(
  func: F,
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const context = this;
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func.apply(context, args);
      timeout = null;
    }, wait);
  };
};


const debounceScrollToBottom = debounce(scrollToBottom, 100);

const handleEnterKey = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey && !isMobile.value) { // Prevent Enter on mobile
    event.preventDefault();
    sendMessage();
  }
};

const formatTimestamp = (isoString: string | Date): string => {
  try {
     const date = typeof isoString === 'string' ? new Date(isoString) : isoString;
     if (isNaN(date.getTime())) { // Check if date is valid
       return '--:--';
     }
     return format(date, 'HH:mm');
  } catch {
    return '--:--';
  }
};

const messageTextBackground = (role: 'user' | 'assistant') => [
  role === 'user'
    ? 'user-message-bg text-white'
    : 'assistant-message-bg bg-white dark:bg-gray-700 dark:text-gray-200 text-gray-800',
];

const previewImage = (url: string | null) => {
  if (url) {
    imageToPreview.value = url;
    showImagePreviewModal.value = true;
  }
};

const closeImagePreview = () => {
  showImagePreviewModal.value = false;
  imageToPreview.value = null;
  imageZoom.value = 1;
};

const confirmResetHistory = () => {
    if (messages.value.length > 0) { // Only show confirm if there are messages
        showResetConfirm.value = true;
    } else {
        showToast('当前没有聊天记录', 'info');
    }
};


const cancelResetHistory = () => {
  showResetConfirm.value = false;
};

const executeResetHistory = async () => {
  if (!currentConversationId) {
    error.value = '没有找到当前会话，无法清空。';
    showResetConfirm.value = false;
    showToast(error.value, 'error');
    return;
  }
  isResetting.value = true;
  error.value = null;
  try {
    await resetChatHistory(currentConversationId);
    messages.value = [];
    currentConversationId = uuidv4();
    showResetConfirm.value = false;
    showToast('聊天记录已清空', 'success');
    console.log('History reset, new conversation ID:', currentConversationId)

  } catch (err) {
    console.error("Error resetting history:", err);
    const message = err instanceof Error ? err.message : '清空记录失败。';
    error.value = message;
    showToast(message, 'error');
  } finally {
    isResetting.value = false;
  }
};

const applyQuickPrompt = (prompt: string) => {
  newMessage.value = prompt;
  nextTick(() => {
      adjustTextAreaHeight();
      if (inputTextArea.value) {
          inputTextArea.value.focus();
      }
  });
};


const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};


const handleImageWheel = (event: WheelEvent) => {
  event.preventDefault();
  const scaleAmount = 0.1;
  if (event.deltaY < 0) {
    imageZoom.value = Math.min(imageZoom.value + scaleAmount, 3);
  } else {
    imageZoom.value = Math.max(imageZoom.value - scaleAmount, 0.5);
  }
};


const zoomIn = () => {
  imageZoom.value = Math.min(imageZoom.value + 0.2, 3);
};

const zoomOut = () => {
  imageZoom.value = Math.max(imageZoom.value - 0.2, 0.5);
};

const resetZoom = () => {
  imageZoom.value = 1;
};

const handleTextareaInput = () => {
    adjustTextAreaHeight();
    // Calculate rows based on lines, capped at a max
    const lineCount = (newMessage.value.match(/\n/g) || []).length + 1;
    const maxRows = 6; // Increased max rows slightly
    textareaRows.value = Math.min(Math.max(1, lineCount), maxRows);
};


const stopRecording = () => {
  isRecording.value = false;
  newMessage.value = "我最近经常感到头晕和疲劳，是什么原因？"; // Example result
  adjustTextAreaHeight();
  showToast('录音已停止（模拟）', 'info');
};

const checkIfMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

const handleVisibilityChange = () => {
    if (!document.hidden && messages.value.length === 0 && !isFetchingHistory.value) {
      console.log("Tab became visible, fetching history as it's empty.");
      fetchHistory();
    } else if (!document.hidden) {
      console.log("Tab became visible, history already present or fetching.");
    }
};


const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast('内容已复制到剪贴板');
  } catch (err) {
    console.error('复制失败:', err);
    showToast('复制失败，请重试', 'error');
  }
};

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  toast.value = {
    show: true,
    message,
    type
  };

  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const suggestPromptForImage = (file: File) => {
  error.value = null;
  const fileName = file.name.toLowerCase();
  const medicalKeywords = ['x-ray', 'xray', 'ct', 'mri', 'scan', 'ultra', '医学', '影像', '核磁', 'x光', 'ecg', 'ekg', '心电图', 'b超'];
  const isMedicalImage = medicalKeywords.some(keyword => fileName.includes(keyword));

  if (isMedicalImage) {
    newMessage.value = "请分析这张图片，告诉我可能存在的健康问题。";
  } else {
    newMessage.value = "请描述这张图片中的内容，并分析其中与健康可能相关的信息。";
  }
  nextTick(adjustTextAreaHeight);
  showToast('已添加图片，请检查或修改问题后发送', 'info');
};

const processSseLine = (line: string, assistantMessage: Message | undefined) => {
  const trimmedLine = line.trim();
  if (!trimmedLine.startsWith('data:') || !assistantMessage) {
    if (trimmedLine && !trimmedLine.startsWith('data:')) {
        console.log('Received non-data line:', trimmedLine);
    }
    return;
  }

  try {
    const rawData = trimmedLine.substring(5).trim();
    if (!rawData || rawData === '[DONE]') {
      if (rawData === '[DONE]') {
        console.log('Received [DONE] signal');
        assistantMessage.loading = false;
        if (!assistantMessage.content && !assistantMessage.imageUrl) {
          assistantMessage.content = "AI 助手处理完成，但未返回有效内容。";
        }
      }
      return;
    }

    try {
      const jsonData = JSON.parse(rawData);
      const contentPart = jsonData.choices?.[0]?.delta?.content;
      if (contentPart !== undefined && contentPart !== null) {
        assistantMessage.content += contentPart;
        debounceScrollToBottom();
      }
      const finishReason = jsonData.choices?.[0]?.finish_reason;
      if (finishReason === 'stop') {
        assistantMessage.loading = false;
        console.log('Stream ended (finish_reason=stop)');
      }
    } catch (jsonError) {
      if (rawData.startsWith('http') || rawData.startsWith('data:image')) { // More specific check for image data URLs
        console.log('Received image URL/Data:', rawData.substring(0, 100) + '...'); // Log truncated data URI
        assistantMessage.imageUrl = rawData;
        debounceScrollToBottom();
      } else {
        console.error('Error parsing SSE data (not URL):', jsonError, 'Raw data:', rawData);
        console.warn('Assistant message received unparseable data block:', rawData);
      }
    }
  } catch (e) {
    console.error('Unexpected error processing SSE line:', e, 'Original line:', line);
  }
};

const processStreamChunk = (chunk: Uint8Array | undefined, bufferObj: { buffer: string }, decoder: TextDecoder, assistantMessage: Message | undefined): void => {
  if (!chunk) return;

  bufferObj.buffer += decoder.decode(chunk, { stream: true });
  const lines = bufferObj.buffer.split('\n');
  bufferObj.buffer = lines.pop() || '';

  lines.forEach(line => processSseLine(line, assistantMessage));
};

const handleSendMessageError = (
    err: unknown,
    assistantMessageIndex: number,
    retryCount: number,
    maxRetries: number
) => {
    console.error(`Error sending/processing message (Attempt ${retryCount + 1}):`, err);
    const errorMessage = err instanceof Error ? err.message : '处理AI响应时发生未知错误。';
    error.value = errorMessage;
    showToast(`错误: ${errorMessage}`, 'error'); // Show error in toast

    const assistantMessage = messages.value[assistantMessageIndex];
    if (assistantMessage) {
        if (!assistantMessage.content && !assistantMessage.imageUrl) {
            assistantMessage.content = `抱歉，处理请求时遇到问题: ${errorMessage}`;
        }
        assistantMessage.loading = false;
    }

    if (retryCount < maxRetries) {
        console.log(`Will attempt retry ${retryCount + 2} after 1 second...`);
        if (assistantMessageIndex !== -1) {
        }
        return true;
    } else {
        console.error("Max retries reached. Giving up.");
        return false;
    }
};


const sendMessage = async (retryAttempt = 0) => {
  const maxRetries = 2;
  const text = newMessage.value.trim();
  const file = selectedFile.value;

  if (!text && !file) {
      showToast('请输入消息或上传图片', 'info');
      return;
  }
  if (!currentConversationId) {
    error.value = '无法确定当前会话，请刷新页面重试。';
    showToast(error.value, 'error');
    return;
  }
  if (isLoading.value && retryAttempt === 0) { // Prevent user double-click, allow retries
    showToast('正在处理上一条消息，请稍候...', 'info');
    return;
  }


  isLoading.value = true;
  error.value = null;
  const userMessageId = uuidv4();
  const userMessage: Message = {
    role: 'user',
    content: text,
    timestamp: new Date().toISOString(),
    imageUrl: previewImageUrl.value || undefined,
    loading: false,
    id: userMessageId,
    conversationId: currentConversationId,
  };
  messages.value.push(userMessage);

  const currentConvId = currentConversationId;

  const originalNewMessage = text;
  const originalSelectedFile = file;
  const originalPreviewUrl = previewImageUrl.value;

  newMessage.value = '';
  removeSelectedImage();
  nextTick(() => {
      adjustTextAreaHeight();
      scrollToBottom();
  });

  const assistantMessageIndex = messages.value.length;
  const assistantPlaceholderId = uuidv4();
  const assistantPlaceholder: Message = {
    id: assistantPlaceholderId,
    role: 'assistant',
    content: '',
    timestamp: new Date().toISOString(),
    loading: true,
    conversationId: currentConvId,
  };
  messages.value.push(assistantPlaceholder);
  scrollToBottom();

  let assistantMessageRef = messages.value[assistantMessageIndex]; // Get initial ref

  try {
    const formData = new FormData();
    formData.append('message', text || ' ');
    formData.append('conversationId', currentConvId);
    if (file) {
      formData.append('file', file, file.name); // Include filename
    }

    const response = await initiateChatStream(formData);

    if (!response.ok) { // Check response status
        let errorBody = '请求失败';
        try {
            const errorData = await response.json();
            errorBody = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch {
            errorBody = await response.text();
        }
        throw new Error(`HTTP error ${response.status}: ${errorBody}`);
    }


    if (!response.body) {
      throw new Error('Response body is missing');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let bufferObj = { buffer: '' };
    while (true) {
      assistantMessageRef = messages.value.find((m: Message) => m.id === assistantPlaceholderId);
      if (!assistantMessageRef || !assistantMessageRef.loading) {
          console.log("Assistant placeholder not found or already finished, stopping stream processing.");
          break;
      }

      const { done, value } = await reader.read();

      if (done) {
        console.log('Message stream ended normally');
        if (assistantMessageRef.loading) {
             assistantMessageRef.loading = false;
             if (!assistantMessageRef.content && !assistantMessageRef.imageUrl) {
               assistantMessageRef.content = "AI 助手处理完成。";
             }
        }
        break;
      }

      processStreamChunk(value, bufferObj, decoder, assistantMessageRef);
    }

     // Final check for loading state after loop exit
     if (assistantMessageRef && assistantMessageRef.loading) {
        assistantMessageRef.loading = false;
     }

  } catch (err) {
     const shouldRetry = handleSendMessageError(err, assistantMessageIndex, retryAttempt, maxRetries);

     if (shouldRetry) {
         // Need a robust way to retry, restoring state
         console.warn(`Attempting retry ${retryAttempt + 1}... Restoring input state (simplified).`);
         // Restore input for the next attempt (this might conflict if user types meanwhile)
         // A better approach might involve a queue or disabling input during retry
         newMessage.value = originalNewMessage;
         selectedFile.value = originalSelectedFile; // This won't re-select the file in input!
         previewImageUrl.value = originalPreviewUrl;
         nextTick(adjustTextAreaHeight);

         // Remove the failed assistant placeholder before retrying
         const failedMsgIndex = messages.value.findIndex(m => m.id === assistantPlaceholderId);
         if (failedMsgIndex > -1) {
             messages.value.splice(failedMsgIndex, 1);
         }


         setTimeout(() => {
             sendMessage(retryAttempt + 1); // Recursive call for retry
         }, 1500); // Slightly longer delay for retry
         return; // Exit current execution path as retry is initiated
     }
     // If not retrying, ensure loading is false on the placeholder if it still exists
      assistantMessageRef = messages.value.find(m => m.id === assistantPlaceholderId);
      if (assistantMessageRef && assistantMessageRef.loading) {
        assistantMessageRef.loading = false;
      }


  } finally {
    // Only set isLoading to false if it's the last attempt or successful
    if (retryAttempt >= maxRetries || error.value === null) {
        isLoading.value = false;
    }
    // Final check for loading state, in case of unexpected exit
    assistantMessageRef = messages.value.find(m => m.id === assistantPlaceholderId);
    if (assistantMessageRef && assistantMessageRef.loading) {
      assistantMessageRef.loading = false;
       if (!assistantMessageRef.content && !assistantMessageRef.imageUrl) {
           assistantMessageRef.content = "处理已结束。";
       }
    }
    scrollToBottom();
  }
};

onMounted(() => {
  fetchHistory();
  adjustTextAreaHeight();
  checkIfMobile();
  document.addEventListener('visibilitychange', handleVisibilityChange);
  if (inputTextArea.value) {
    inputTextArea.value.addEventListener('focus', () => inputFocused.value = true);
    inputTextArea.value.addEventListener('blur', () => setTimeout(() => {
        // Keep focus if modal is shown or related element is clicked
        if (!showImagePreviewModal.value && !showResetConfirm.value) {
             inputFocused.value = false;
        }
       }, 200));
  }
  window.addEventListener('resize', debounce(checkIfMobile, 150)); // Debounce resize check
});

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
  window.removeEventListener('resize', debounce(checkIfMobile, 150));
});
</script>

<style scoped>
.prose :where(code):not(:where([class~="not-prose"] *))::before,
.prose :where(code):not(:where([class~="not-prose"] *))::after {
  content: "";
}


div[ref="messageContainer"] {
  scroll-behavior: smooth;
}

/* 添加滚动条样式 */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 消息出现动画 */
@keyframes message-appear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 打字机效果 */
@keyframes typing {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}

/* 提升提示框样式 */
.ai-qa-page .message-text {
  transition: all 0.2s ease;
}

.ai-qa-page .message-text:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 用户消息渐变背景 */
.user-message-bg {
  background: linear-gradient(to right, #4f46e5, #3b82f6);
  box-shadow: 0 2px 5px rgba(59, 130, 246, 0.2);
}

/* 助手消息改进 */
.assistant-message-bg {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

/* 响应式调整 */
@media (max-width: 640px) {
  .ai-qa-page .message-text {
    max-width: 80vw;
  }
}

/* 基本文本区域样式覆盖 */
textarea {
  min-height: 44px;
  max-height: 160px;
  transition: height 0.1s ease-out, border-color 0.2s ease;
}

textarea:focus {
  border-color: var(--color-primary);
}

针对 Markdown 内容的增强 .prose h1,
.prose h2,
.prose h3 {
  margin-top: 1.2em;
  margin-bottom: 0.5em;
  color: var(--color-primary);
}

.prose pre {
  background-color: #f3f4f6;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}



.prose code {
  font-family: ui-monospace, monospace;
  padding: 0.2em 0.4em;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0.25em;
}


.prose img {
  border-radius: 0.375rem;
}

.prose blockquote {
  border-left: 4px solid var(--color-primary);
  padding-left: 1rem;
  font-style: italic;
}

/* 入场动画应用 */
.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-enter-active {
  transition: all 0.3s ease-out;
}

.message-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
