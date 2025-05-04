<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
    <!-- 欢迎信息 -->
    <div v-if="!currentChat || currentChat.messages.length === 0"
      class="flex-1 flex flex-col items-center justify-center p-4 min-h-[calc(100vh-64px)] mt-16">
      <div class="max-w-3xl w-full">
        <h1 class="text-3xl font-bold text-center mb-3">您好，有什么可以帮助您的？</h1>
        <p class="text-xl text-center text-gray-500 mb-10">您可以询问任何健康相关的问题</p>

        <!-- 中央输入框 -->
        <div class="max-w-2xl mx-auto mb-8 relative">
          <div
            class="relative rounded-2xl border border-gray-300 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
            <textarea ref="inputArea" v-model="newMessage" rows="1"
              class="w-full resize-none border-0 bg-transparent p-5 pr-24 text-gray-800 placeholder-gray-400 focus:outline-none rounded-2xl"
              placeholder="您想了解什么健康知识？" @keydown.enter.prevent="handleEnterKey" @input="adjustTextareaHeight">
            </textarea>

            <!-- 上传和发送按钮 -->
            <div class="absolute right-3 bottom-3 flex space-x-2">
              <button @click="openImageOptions" class="text-gray-400 hover:text-gray-600 p-1.5 rounded-md" title="上传图片">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
              </button>
              <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileSelected" />

              <button @click="sendMessage" :disabled="!newMessage.trim() && !selectedFile"
                class="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 图片预览 -->
          <div v-if="previewImageUrl"
            class="mt-2 flex items-start gap-2 p-2 rounded-lg bg-white border border-gray-300">
            <img :src="previewImageUrl" alt="Preview" class="h-16 w-16 object-cover rounded-md" />
            <div class="flex-1">
              <div class="text-sm font-medium truncate">{{ selectedFile?.name }}</div>
              <div class="text-xs text-gray-500">{{ formatFileSize(selectedFile?.size || 0) }}</div>
            </div>
            <button class="text-gray-500 hover:text-red-500" @click="removeSelectedImage">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 示例问题 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
          <button v-for="(example, i) in exampleQuestions.slice(0, 6)" :key="i"
            class="text-sm px-4 py-3 rounded-2xl border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-700 text-left shadow-sm hover:shadow"
            @click="askExample(example)">
            {{ example.content }}
          </button>
        </div>
      </div>
    </div>

    <!-- 聊天内容 -->
    <div v-else class="flex-1 flex flex-col pt-[80px] pb-0">
      <!-- 消息列表 -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto pt-4 pb-32">
        <div class="max-w-3xl mx-auto px-4">
          <!-- 顶部清空历史按钮 -->
          <div class="text-right mb-4">
            <button @click="clearHistory"
              class="text-sm px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors flex items-center gap-1 ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              清空聊天记录
            </button>
          </div>

          <div v-for="(message, idx) in currentChat.messages" :key="idx"
            class="py-6 border-b border-gray-100 last:border-0">
            <!-- 消息发送者 -->
            <div class="flex items-start gap-4">
              <!-- 头像 -->
              <div :class="[
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                message.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
              ]">
                <svg v-if="message.role === 'user'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="h-5 w-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <!-- 消息内容 -->
              <div class="flex-1 px-1">
                <!-- 用户发送的图片 -->
                <div v-if="message.imageUrl" class="mb-4">
                  <div class="text-sm text-gray-500 mb-1">您上传的图片:</div>
                  <img :src="message.imageUrl" alt="用户图片"
                    class="max-w-md rounded-lg border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                    @click="previewImage(message.imageUrl || '')" />
                </div>

                <!-- 分析结果图片（AI返回） -->
                <div v-if="message.resultImageUrl" class="mb-4 mt-3">
                  <div class="text-sm text-gray-500 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="w-4 h-4 mr-1">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                    AI分析结果图片:
                  </div>
                  <img :src="message.resultImageUrl" alt="分析结果"
                    class="max-w-md rounded-lg border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                    @click="previewImage(message.resultImageUrl || '')" />
                </div>

                <!-- 消息文本 -->
                <div v-if="message.role === 'assistant'" class="prose max-w-none text-gray-800"
                  v-html="renderMarkdown(message.content)">
                </div>
                <div v-else class="whitespace-pre-wrap text-gray-800">
                  {{ message.content }}
                </div>

                <!-- 加载中指示器 -->
                <div v-if="message.loading" class="mt-2 flex items-center">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-75"></div>
                    <div class="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-100"></div>
                    <div class="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部输入框 - 固定在底部 -->
      <div class="fixed bottom-0 left-0 right-0 p-4 z-20">
        <div class="max-w-3xl mx-auto relative">
          <div class="relative rounded-2xl border border-gray-300 bg-white/90 backdrop-blur-md shadow-md">
            <textarea ref="inputArea" v-model="newMessage" rows="1"
              class="w-full resize-none border-0 bg-transparent p-4 pr-24 text-gray-800 placeholder-gray-400 focus:outline-none rounded-2xl"
              placeholder="继续您的问题..." @keydown.enter.prevent="handleEnterKey" @input="adjustTextareaHeight">
            </textarea>

            <!-- 工具栏 -->
            <div class="absolute right-3 bottom-3 flex space-x-2">
              <button @click="openImageOptions" class="text-gray-400 hover:text-gray-600 p-1.5 rounded-md" title="上传图片">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
              </button>
              <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileSelected" />

              <button @click="sendMessage" :disabled="!newMessage.trim() && !selectedFile"
                class="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 图片预览 -->
          <div v-if="previewImageUrl"
            class="mt-2 flex items-start gap-2 p-2 rounded-lg bg-white border border-gray-300">
            <img :src="previewImageUrl" alt="Preview" class="h-16 w-16 object-cover rounded-md" />
            <div class="flex-1">
              <div class="text-sm font-medium truncate">{{ selectedFile?.name }}</div>
              <div class="text-xs text-gray-500">{{ formatFileSize(selectedFile?.size || 0) }}</div>
            </div>
            <button class="text-gray-500 hover:text-red-500" @click="removeSelectedImage">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="h-5 w-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片来源选择弹窗 -->
    <div v-if="showImageOptions"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/30 backdrop-blur-md"
      @click="showImageOptions = false">
      <div class="bg-white/90 backdrop-blur-sm rounded-lg p-6 w-80 shadow-xl" @click.stop>
        <h3 class="text-lg font-semibold mb-4">选择图片来源</h3>
        <div class="flex flex-col space-y-3">
          <button @click="selectLocalImage"
            class="flex items-center gap-2 px-4 py-3 bg-gray-100/80 hover:bg-gray-200/90 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            从相册选择
          </button>
          <button @click="useCamera"
            class="flex items-center gap-2 px-4 py-3 bg-gray-100/80 hover:bg-gray-200/90 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            使用摄像头
          </button>
        </div>
      </div>
    </div>

    <!-- 摄像头捕捉弹窗 -->
    <div v-if="showCamera" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/30 backdrop-blur-md">
      <div class="bg-white/90 backdrop-blur-sm rounded-lg p-4 w-full max-w-lg shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">拍摄照片</h3>
          <button @click="closeCamera" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="relative">
          <video ref="videoElement" class="w-full rounded-lg bg-black" autoplay></video>
          <canvas ref="canvasElement" class="hidden"></canvas>
        </div>
        <div class="flex justify-center mt-4">
          <button @click="capturePhoto"
            class="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 图片预览模态框 -->
    <div v-if="showImagePreviewModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-600/40 backdrop-blur-md"
      @click="closeImagePreview">
      <div class="relative max-w-5xl max-h-[90vh] w-full">
        <div class="absolute top-4 right-4 flex space-x-2 z-20">
          <button @click.stop="zoomIn"
            class="p-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          <button @click.stop="zoomOut"
            class="p-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
            </svg>
          </button>
          <button @click.stop="resetZoom"
            class="p-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
          <button @click.stop="closeImagePreview"
            class="p-2 bg-red-600/90 hover:bg-red-500 text-white rounded-full backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="h-5 w-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <img :src="imageToPreview" alt="Image preview"
          class="max-w-full max-h-[80vh] object-contain transition-transform duration-200 select-none mx-auto"
          :style="{ transform: `scale(${imageZoom})` }" @click.stop @wheel.stop="handleImageWheel" />
      </div>
    </div>

    <!-- Toast通知 -->
    <div v-if="toast.show"
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2"
      :class="{
        'bg-green-500 text-white': toast.type === 'success',
        'bg-red-500 text-white': toast.type === 'error',
        'bg-blue-500 text-white': toast.type === 'info'
      }">
      <span class="text-sm font-medium">{{ toast.message }}</span>
    </div>

    <!-- 确认对话框 -->
    <div v-if="showConfirmDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/30 backdrop-blur-md"
      @click="cancelConfirmDialog">
      <div class="bg-white/90 backdrop-blur-sm rounded-lg p-6 w-80 shadow-xl" @click.stop>
        <h3 class="text-lg font-semibold mb-3">{{ confirmDialogTitle }}</h3>
        <p class="text-gray-700 mb-5">{{ confirmDialogMessage }}</p>
        <div class="flex justify-end space-x-3">
          <button class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700"
            @click="cancelConfirmDialog">
            取消
          </button>
          <button class="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-white"
            @click="confirmDialogAction">
            确定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-expect-error Vue 3.x型声明文件兼容性问题
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { v4 as uuidv4 } from 'uuid';
import { getChatHistory, resetChatHistory } from '@/services/aiService';

// 类型定义
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imageUrl?: string; // 用户发送的图片URL
  resultImageUrl?: string; // 分析后的结果图片URL
  loading?: boolean;
  conversationId?: string;
  createdAt?: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  active: boolean;
  conversationId?: string;
}

// 状态
const chatHistory = ref<Chat[]>([]);
const newMessage = ref('');
const selectedFile = ref<File | null>(null);
const previewImageUrl = ref<string | null>(null);
const messagesContainer = ref<HTMLElement | null>(null);
const inputArea = ref<HTMLTextAreaElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isLoading = ref(false);

// 图片预览
const showImagePreviewModal = ref(false);
const imageToPreview = ref<string | null>(null);
const imageZoom = ref(1);

// 图片来源选择
const showImageOptions = ref(false);
const showCamera = ref(false);
const videoElement = ref<HTMLVideoElement | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);
let stream: MediaStream | null = null;

// Toast通知
const toast = ref<{
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}>({
  show: false,
  message: '',
  type: 'info'
});

// 确认对话框状态
const showConfirmDialog = ref(false);
const confirmDialogTitle = ref('');
const confirmDialogMessage = ref('');
let confirmDialogCallback: (() => void) | null = null;

// 示例问题
const exampleQuestions = [
  {
    title: '健康咨询',
    content: '我最近总是感到疲劳，可能是什么原因？'
  },
  {
    title: '饮食建议',
    content: '请推荐一些适合高血压患者的健康食谱'
  },
  {
    title: '运动指导',
    content: '对于久坐办公室的人，有哪些简单有效的运动方式？'
  },
  {
    title: '睡眠改善',
    content: '如何改善睡眠质量？我经常失眠。'
  },
  {
    title: '心理健康',
    content: '工作压力大导致焦虑，有什么方法可以缓解？'
  },
  {
    title: '医学知识',
    content: '请解释高血糖和糖尿病的区别，以及如何预防'
  }
];

// 计算当前活跃的聊天
const currentChat = computed(() => chatHistory.value.find((chat: Chat) => chat.active));

// 创建新聊天
const startNewChat = () => {
  // 将所有聊天设为非活跃
  chatHistory.value.forEach((chat: Chat) => chat.active = false);

  // 创建新聊天
  const newChat: Chat = {
    id: uuidv4(),
    title: '新对话',
    messages: [],
    active: true
  };

  chatHistory.value.unshift(newChat);
  showToast('已创建新对话', 'success');
};

// Markdown渲染
const markdownCache = new Map();
const renderMarkdown = (content: string): string => {
  if (markdownCache.has(content)) {
    return markdownCache.get(content);
  }

  try {
    // 更精确地移除markdown内容中的图片链接部分，避免重复渲染
    // 检测content是否包含resultImageUrl对应的图片链接
    const contentWithoutImages = content.replace(/!\[.*?\]\(https?:\/\/[^\s)]+\)/g, '');

    marked.setOptions({
      gfm: true,
      breaks: true,
    });

    const rawHtml = marked.parse(contentWithoutImages);
    const cleanHtml = typeof rawHtml === 'string'
      ? DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
          'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
          'table', 'thead', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'span'],
        ALLOWED_ATTR: ['href', 'name', 'target', 'src', 'alt', 'class', 'style', 'title']
      })
      : contentWithoutImages;

    markdownCache.set(content, cleanHtml);
    return cleanHtml;
  } catch (e) {
    console.error("渲染 Markdown 时出错:", e);
    markdownCache.set(content, content);
    return content;
  }
};

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 调整文本区域高度
const adjustTextareaHeight = () => {
  if (inputArea.value) {
    inputArea.value.style.height = 'auto';
    const scrollHeight = inputArea.value.scrollHeight;
    const maxHeight = 120; // 最大高度
    inputArea.value.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  }
};

// 处理Enter键
const handleEnterKey = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

// 图片相关功能
const openImageOptions = () => {
  showImageOptions.value = true;
};

const selectLocalImage = () => {
  showImageOptions.value = false;
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileSelected = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.size > 5 * 1024 * 1024) { // 5MB限制
      showToast('图片大小不能超过5MB', 'error');
      return;
    }

    selectedFile.value = file;
    // 使用toBase64函数创建预览
    try {
      previewImageUrl.value = await toBase64(file);
      console.log('已选择图片:', file.name, file.type, file.size);
    } catch (err) {
      console.error('图片预览生成失败:', err);
      showToast('图片预览失败', 'error');
    }
  }
};

const removeSelectedImage = () => {
  selectedFile.value = null;
  previewImageUrl.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// 图片预览
const previewImage = (url: string) => {
  imageToPreview.value = url;
  showImagePreviewModal.value = true;
  imageZoom.value = 1;
};

const closeImagePreview = () => {
  showImagePreviewModal.value = false;
  imageToPreview.value = null;
  imageZoom.value = 1;
};

const zoomIn = () => {
  imageZoom.value = Math.min(imageZoom.value + 0.1, 3);
};

const zoomOut = () => {
  imageZoom.value = Math.max(imageZoom.value - 0.1, 0.5);
};

const resetZoom = () => {
  imageZoom.value = 1;
};

const handleImageWheel = (event: WheelEvent) => {
  event.preventDefault();
  if (event.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Toast通知
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

// 发送示例问题
const askExample = (example: { title: string; content: string }) => {
  if (chatHistory.value.length === 0) {
    startNewChat();
  }

  newMessage.value = example.content;
  nextTick(() => {
    sendMessage();
  });
};

// 发送消息
const sendMessage = async () => {
  const text = newMessage.value.trim();

  if (!text && !selectedFile.value) return;

  if (chatHistory.value.length === 0) {
    startNewChat();
  }

  const activeChat = chatHistory.value.find((chat: Chat) => chat.active);
  if (!activeChat) return;

  isLoading.value = true;

  // 添加用户消息
  const userMessageId = uuidv4();
  const userMessage: Message = {
    id: userMessageId,
    role: 'user',
    content: text,
    timestamp: new Date().toISOString(),
    imageUrl: previewImageUrl.value || undefined,
  };

  activeChat.messages.push(userMessage);

  // 如果是第一条消息，更新聊天标题
  if (activeChat.messages.length === 1) {
    activeChat.title = text.substring(0, 20) + (text.length > 20 ? '...' : '');
    // 创建新的conversationId
    activeChat.conversationId = uuidv4();
  }

  // 清空输入框
  newMessage.value = '';

  // 准备要发送的图片
  const imageToSend = selectedFile.value;

  nextTick(() => {
    adjustTextareaHeight();
    scrollToBottom();
  });

  // 添加AI回复占位符
  const assistantMessageId = uuidv4();
  const assistantMessage: Message = {
    id: assistantMessageId,
    role: 'assistant',
    content: '',
    timestamp: new Date().toISOString(),
    loading: true,
  };

  activeChat.messages.push(assistantMessage);
  scrollToBottom();

  try {
    // 创建一个表单数据对象
    const formData = new FormData();

    // 添加文本消息
    formData.append('message', text || ' ');

    // 添加会话ID
    formData.append('conversationId', activeChat.conversationId || uuidv4());

    // 添加图片（如果有）
    if (imageToSend) {
      console.log('准备发送图片:', imageToSend.name, imageToSend.type, imageToSend.size);

      // 检查是否能从File转换为Blob
      const imageBlob = imageToSend.slice(0, imageToSend.size, imageToSend.type);

      // 确保使用正确的字段名称
      formData.append('file', imageBlob, imageToSend.name);

      // 检查FormData中是否成功添加了文件
      const hasFile = formData.has('file');
      console.log('FormData包含file字段:', hasFile);
    }

    // 查看FormData包含的内容
    try {
      console.log('FormData内容:');
      // 使用更兼容的方式检查和输出FormData内容
      for (const key of ['message', 'conversationId', 'file']) {
        if (formData.has(key)) {
          const value = formData.get(key);
          if (value instanceof File) {
            console.log(`${key}: 图片文件: ${value.name}, 类型: ${value.type}, 大小: ${value.size}字节`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }
      }
    } catch (e) {
      console.error('无法检查FormData内容:', e);
    }

    // 发送请求
    const baseUrl = 'http://120.55.192.74:9401';
    const targetUrl = `${baseUrl}/chatStream`;

    console.log('发送请求到:', targetUrl);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'X-Token': localStorage.getItem('token') || ''
      },
      body: formData
    });

    // 完成后清除图片
    removeSelectedImage();

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is missing');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let chatContent = '';
    let receivingImageUrl = false;

    // 找到当前AI消息
    const currentChat = chatHistory.value.find((chat: Chat) => chat.active);
    const currentMessage = currentChat?.messages.find((msg: Message) => msg.id === assistantMessageId);

    // 处理流式响应
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // 解码接收到的数据
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        // 处理事件流中的不同类型消息
        if (line.startsWith('event:')) {
          const eventType = line.slice(6).trim();
          // 检查是否有图片事件
          if (eventType === 'detectionResultImage') {
            // 标记当前正在处理图片结果，下一行data将是图片URL
            receivingImageUrl = true;
            continue;
          }
        }

        if (line.startsWith('data:')) {
          try {
            const data = line.slice(5).trim();

            // 处理图片URL（由YOLOv10分析后返回的图片）
            if (receivingImageUrl || data.startsWith('http')) {
              receivingImageUrl = false;
              console.log('收到分析结果图片URL:', data);

              // 找到当前消息并保存图片URL
              if (currentMessage) {
                // 保存结果图片URL
                currentMessage.resultImageUrl = data;
                // 将图片链接添加到消息内容中，以便在界面上显示
                if (!currentMessage.content.includes(data)) {
                  currentMessage.content += `\n\n![分析结果](${data})`;
                  scrollToBottom();
                }
              }
              continue;
            }

            if (data === '[DONE]') continue;

            // 尝试解析JSON
            const json = JSON.parse(data);

            // 处理OpenAI流式响应格式
            if (json.choices && json.choices.length > 0) {
              const delta = json.choices[0].delta;
              if (delta && delta.content) {
                chatContent += delta.content;
                if (currentMessage) {
                  currentMessage.content = chatContent;
                }
              }
            }
            // 处理conversationId
            else if (json.conversationId && currentChat) {
              currentChat.conversationId = json.conversationId;
            }
            // 处理error
            else if (json.error) {
              throw new Error(json.error);
            }
          } catch (e) {
            console.error('解析流响应时出错:', e);
          }
        }
      }
    }

    // 完成后更新消息
    if (currentMessage) {
      currentMessage.loading = false;
    }

  } catch (error) {
    console.error('发送消息时出错:', error);
    // 移除加载状态，显示错误信息
    const currentChat = chatHistory.value.find((chat: Chat) => chat.active);
    const currentMessage = currentChat?.messages.find((msg: Message) => msg.id === assistantMessageId);

    if (currentMessage) {
      currentMessage.content = `发送消息失败: ${error instanceof Error ? error.message : String(error)}`;
      currentMessage.loading = false;
    }

    showToast('发送消息失败', 'error');
    isLoading.value = false;
  } finally {
    scrollToBottom();
  }
};

// 清空聊天历史
const clearHistory = async () => {
  showConfirm('清空聊天记录', '确定要清空所有聊天记录吗？这个操作无法撤销。', async () => {
    try {
      // 获取活跃的聊天对话
      const activeChat = currentChat.value;

      if (activeChat && activeChat.conversationId) {
        // 确保传入正确的conversationId
        console.log('准备清空会话:', activeChat.conversationId);

        // 调用后端API清空聊天记录
        const result = await resetChatHistory(activeChat.conversationId);
        console.log('清空历史记录结果:', result);
      } else {
        console.warn('没有活跃的对话或者对话ID不存在');
      }

      // 清空本地聊天记录
      chatHistory.value = [];

      // 创建新的聊天（避免空白界面）
      startNewChat();

      // 显示成功消息
      showToast('聊天记录已清空', 'success');
    } catch (error) {
      console.error('清空历史记录时出错:', error);

      // 即使API调用失败，我们仍然清空本地记录并显示成功消息
      chatHistory.value = [];
      startNewChat();
      showToast('本地聊天记录已清空', 'success');
    }
  });
};

// 获取聊天历史记录
const fetchChatHistory = async () => {
  try {
    const history = await getChatHistory();

    // 按对话ID分组消息
    const conversations: Record<string, Message[]> = {};
    history.forEach(histItem => {
      const convId = histItem.conversationId;
      if (!conversations[convId]) {
        conversations[convId] = [];
      }

      // 处理时间戳，确保类型正确
      let timestampStr = '';
      if (typeof histItem.timestamp === 'string') {
        timestampStr = histItem.timestamp;
      } else if (Array.isArray(histItem.timestamp)) {
        // 确保数组时间戳处理
        const arr = histItem.timestamp as number[];
        if (arr && arr.length >= 6) {
          const [year, month, day, hour, minute, second] = arr;
          // 注意月份需要减1，因为JavaScript的月份是从0开始的
          timestampStr = new Date(year, month - 1, day, hour, minute, second).toISOString();
        } else {
          timestampStr = new Date().toISOString();
        }
      } else {
        timestampStr = new Date().toISOString();
      }

      // 处理ID
      const messageId = histItem.id ?
        (typeof histItem.id === 'string' ? histItem.id : String(histItem.id)) :
        uuidv4();

      conversations[convId].push({
        ...histItem,
        timestamp: timestampStr,
        id: messageId,
      });
    });

    // 找出最新的对话并设为活跃
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

    // 将历史记录转换为聊天格式
    chatHistory.value = Object.entries(conversations).map(([convId, messages]) => {
      // 按时间排序消息
      const sortedMessages = messages.sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      return {
        id: uuidv4(),
        conversationId: convId,
        title: sortedMessages.length > 0 && sortedMessages[0].content ?
          sortedMessages[0].content.substring(0, 20) + (sortedMessages[0].content.length > 20 ? '...' : '') :
          '对话记录',
        messages: sortedMessages.map(msg => {
          const msgId = msg.id ? (typeof msg.id === 'number' ? String(msg.id) : msg.id) : uuidv4();
          return {
            ...msg,
            id: msgId
          };
        }),
        active: convId === latestConvId
      };
    });

    // 如果没有历史记录，创建新对话
    if (chatHistory.value.length === 0) {
      startNewChat();
    }
  } catch (error) {
    console.error('获取历史记录失败:', error);
    showToast('获取历史记录失败', 'error');
    startNewChat();
  }
};

// 使用摄像头
const useCamera = async () => {
  showImageOptions.value = false;
  showCamera.value = true;

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoElement.value) {
      videoElement.value.srcObject = stream;
    }
  } catch (error) {
    console.error('无法访问摄像头:', error);
    showToast('无法访问摄像头，请检查权限设置', 'error');
    showCamera.value = false;
  }
};

// 关闭摄像头
const closeCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  showCamera.value = false;
};

// 拍照
const capturePhoto = () => {
  if (!videoElement.value || !canvasElement.value) return;

  const video = videoElement.value;
  const canvas = canvasElement.value;

  // 设置canvas尺寸与视频一致
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // 在canvas上绘制当前视频帧
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // 将canvas内容转为图片
  const imgDataUrl = canvas.toDataURL('image/jpeg');
  previewImageUrl.value = imgDataUrl;

  // 将base64转为File对象
  canvas.toBlob((blob: Blob | null) => {
    if (blob) {
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      console.log('拍照生成文件:', file.name, file.type, file.size);
      selectedFile.value = file;
    }
  }, 'image/jpeg', 0.8);

  // 关闭摄像头
  closeCamera();
};

// 初始化
onMounted(() => {
  fetchChatHistory();
  adjustTextareaHeight();
});

watch(newMessage, adjustTextareaHeight);

// 在组件卸载时清理资源
onUnmounted(() => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
});

// 工具函数
const toBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// 显示确认对话框
const showConfirm = (title: string, message: string, callback: () => void) => {
  confirmDialogTitle.value = title;
  confirmDialogMessage.value = message;
  confirmDialogCallback = callback;
  showConfirmDialog.value = true;
};

// 取消确认对话框
const cancelConfirmDialog = () => {
  showConfirmDialog.value = false;
  confirmDialogCallback = null;
};

// 确认对话框操作
const confirmDialogAction = () => {
  if (confirmDialogCallback) {
    confirmDialogCallback();
  }
  showConfirmDialog.value = false;
  confirmDialogCallback = null;
};
</script>

<style scoped>
:root {
  --token-primary: #10a37f;
  --token-sidebar-surface-primary: #202123;
  --token-main-surface-primary: #ffffff;
  --token-main-surface-secondary: #f7f7f8;
  --token-border-light: #e5e5e5;
  --token-border-medium: #d9d9e3;
  --token-text-primary: #343541;
  --token-text-secondary: #6e6e80;
}

.dark {
  --token-main-surface-primary: #343541;
  --token-main-surface-secondary: #444654;
  --token-border-light: #444654;
  --token-border-medium: #565869;
  --token-text-primary: #ececf1;
  --token-text-secondary: #c5c5d2;
}

/* 欢迎信息淡入动画 */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.flex-1.flex.flex-col.items-center.justify-center {
  animation: fade-in 0.5s ease-out;
}

/* 毛玻璃效果 */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* 模态框亚克力效果 */
.bg-white\/90 {
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.bg-gray-500\/30 {
  background-color: rgba(107, 114, 128, 0.3);
}

.bg-gray-600\/40 {
  background-color: rgba(75, 85, 99, 0.4);
}

/* 固定在底部的输入框 */
.fixed.bottom-0 {
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 10;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.05);
  padding-bottom: 16px;
}

/* 改进滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 动画效果 */
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

/* 聊天消息过渡效果 */
.flex.items-start.gap-4 {
  animation: message-appear 0.3s ease-out;
}

/* 文本输入区域自适应高度 */
textarea {
  min-height: 24px;
  max-height: 200px;
  transition: height 0.1s ease-out;
}

/* Markdown 内容样式改进 */
.prose {
  max-width: none;
}

.prose h1,
.prose h2,
.prose h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.prose pre {
  background-color: #f3f4f6;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.dark .prose pre {
  background-color: #2d2d31;
}

.prose code {
  font-family: ui-monospace, monospace;
  padding: 0.2em 0.4em;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0.25em;
}

.dark .prose code {
  background-color: rgba(255, 255, 255, 0.1);
}

.prose img {
  border-radius: 0.375rem;
}

.prose blockquote {
  border-left: 4px solid var(--token-primary);
  padding-left: 1rem;
  font-style: italic;
}

/* 响应式调整 */
@media (max-width: 640px) {
  nav.flex-none {
    width: 220px;
  }
}
</style>
