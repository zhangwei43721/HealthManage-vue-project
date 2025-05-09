<template>
  <Transition name="bubble-container-fade">
    <div
      v-if="isLoggedIn && showBubble"
      class="fixed bottom-6 right-6 z-[9999] flex flex-col items-end"
    >
      <!-- Bubble Content -->
      <Transition name="bubble-fade">
        <div
          v-if="expanded"
          class="mb-3 w-80 max-w-xs rounded-lg bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <!-- Arrow pointing to the icon -->
          <div
            class="absolute bottom-5 right-9 w-3 h-3 bg-white dark:bg-gray-800 transform rotate-45 border-r border-b border-gray-200 dark:border-gray-700"
          ></div>

          <!-- Header -->
          <div
            class="flex justify-between items-center p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
          >
            <span class="font-semibold text-base flex items-center">
              <Robot theme="filled" size="18" class="mr-1.5" />
              AI健康建议
            </span>
            <button
              @click="expanded = false"
              class="p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="关闭建议"
            >
              <Close theme="outline" size="18" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-4 min-h-[120px] max-h-[350px] overflow-y-auto scroll-smooth scrollbar-thin">
            <Transition name="content-fade" mode="out-in">
              <div
                v-if="loading"
                key="loading"
                class="flex flex-col items-center justify-center h-full py-8 text-gray-500 dark:text-gray-400"
              >
                <div class="flex space-x-1 mb-2">
                  <span class="dot animate-dot-pulse"></span>
                  <span
                    class="dot animate-dot-pulse"
                    style="animation-delay: 0.2s"
                  ></span>
                  <span
                    class="dot animate-dot-pulse"
                    style="animation-delay: 0.4s"
                  ></span>
                </div>
                <span>正在生成健康建议...</span>
              </div>
              <div
                v-else-if="currentSuggestion"
                key="content"
                class="prose prose-sm dark:prose-invert max-w-none"
                v-html="parsedSuggestion"
              ></div>
              <div
                v-else
                key="empty"
                class="flex flex-col items-center justify-center py-6 text-gray-500 dark:text-gray-400"
              >
                <Clipboard theme="outline" size="24" class="mb-2 text-gray-400" />
                <span>暂无建议，点击刷新按钮获取</span>
              </div>
            </Transition>
          </div>

          <!-- Footer -->
          <div
            class="flex justify-between items-center px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
          >
            <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Clipboard theme="outline" size="14" class="mr-1 opacity-70" />
              {{ formattedTimestamp || '刚刚更新' }}
            </span>
            <button
              @click="fetchCurrentPageSuggestion"
              :disabled="loading"
              class="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-90"
              aria-label="刷新建议"
              :title="loading ? '加载中...' : '刷新建议'"
            >
              <Refresh
                theme="outline"
                size="16"
                :class="{ 'animate-spin': loading }"
              />
            </button>
          </div>
        </div>
      </Transition>

      <!-- Trigger Icon with Badge -->
      <div class="relative">
        <button
          @click="toggleExpanded"
          class="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="打开/关闭 AI 建议"
        >
          <Transition name="icon-fade" mode="out-in">
            <Robot v-if="!expanded" theme="filled" size="24" />
            <CloseSmall v-else theme="outline" size="24" />
          </Transition>
        </button>

        <!-- Pulsing dot animation when new suggestion available -->
        <span
          v-if="!expanded && hasNewSuggestion"
          class="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-red-500 animate-pulse"
        ></span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from '@/composables/vue-imports'
import { useRoute } from 'vue-router'
import { Robot, Close, Refresh, CloseSmall, Clipboard } from '@icon-park/vue-next'
import { marked } from 'marked' // Popular Markdown parser
import DOMPurify from 'dompurify' // For sanitizing HTML
import api from '@/services/api' // API service
import { isAuthenticated } from '@/services/auth' // Auth helpers

// --- Types ---
type SuggestionType = 'current' | 'historical' | 'sport' | null;
// 定义 ROUTES_CONFIG 的键类型
type RouteKey = keyof typeof ROUTES_CONFIG;

// --- Reactive State ---
const route = useRoute()
const expanded = ref(false)
const loading = ref(false)
const currentSuggestion = ref('')
const generatedAt = ref<string | null>(null)
const showBubble = ref(false)
const hasNewSuggestion = ref(false)
const errorMessage = ref('')
// 使用 ref 代替 shallowRef (因为 vue-imports 没有导出 shallowRef)
const markedInstance = ref(marked)

// --- Configuration ---
const ROUTES_CONFIG = {
  '/health-data': { type: 'current' as SuggestionType, autoExpand: false },
  '/health-knowledge': { type: 'sport' as SuggestionType, autoExpand: true },
  '/health-log': { type: 'historical' as SuggestionType, autoExpand: false },
} as const; // 使用 as const 确保键是字面量类型

// --- Computed Properties ---
const isLoggedIn = computed(() => isAuthenticated())

// 使用定义的 RouteKey 类型
const targetRoutes = Object.keys(ROUTES_CONFIG) as RouteKey[];

const currentSuggestionType = computed<SuggestionType>(() => {
  const matchedRoute = targetRoutes.find(target => route.path.startsWith(target));
  // 确保 matchedRoute 是有效的 RouteKey
  return matchedRoute ? ROUTES_CONFIG[matchedRoute].type : null;
})

const shouldAutoExpand = computed(() => {
  const matchedRoute = targetRoutes.find(target => route.path.startsWith(target));
  // 确保 matchedRoute 是有效的 RouteKey
  return matchedRoute ? ROUTES_CONFIG[matchedRoute].autoExpand : false;
})

// Parse and sanitize Markdown (memoized)
const parsedSuggestion = computed(() => {
  if (!currentSuggestion.value) return '';
  try {
    // 1. Parse Markdown to HTML
    const rawHtml = markedInstance.value.parse(currentSuggestion.value) as string;
    // 2. Sanitize HTML to prevent XSS
    return DOMPurify.sanitize(rawHtml);
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return `<p>${currentSuggestion.value}</p>`;
  }
})

const formattedTimestamp = computed(() => {
  if (!generatedAt.value) return '';

  try {
    const date = new Date(generatedAt.value);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "未知时间";
    }

    // Format to YYYY-MM-DD HH:mm
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  } catch /*(e)*/ { // 移除了未使用的变量 e
    return "时间格式错误";
  }
})

// --- Helper Functions ---
const shouldShowBubble = (path: string | undefined | null): boolean => {
  if (typeof path !== 'string') return false;
  return targetRoutes.some(target => path.startsWith(target));
}

const updateBubbleVisibility = () => {
  showBubble.value = shouldShowBubble(route.path);
}

// --- Event Handlers ---
const toggleExpanded = () => {
  expanded.value = !expanded.value;

  if (expanded.value) {
    hasNewSuggestion.value = false; // Clear notification when opening

    // Fetch suggestion if not already loaded
    if (!currentSuggestion.value && isLoggedIn.value && showBubble.value) {
      fetchCurrentPageSuggestion();
    }
  }
}

// --- Fetch Data ---
const fetchCurrentPageSuggestion = async () => {
  const type = currentSuggestionType.value;
  if (!type || !isLoggedIn.value) {
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const responsePayload = await api.get(`/ai-suggestions-specific/${type}`);

    if (
      responsePayload &&
      typeof responsePayload.suggestion === 'string' &&
      responsePayload.generatedAt !== undefined
    ) {
      currentSuggestion.value = responsePayload.suggestion;

      if (Array.isArray(responsePayload.generatedAt) && responsePayload.generatedAt.length >= 3) {
        generatedAt.value = new Date(
          responsePayload.generatedAt[0],
          responsePayload.generatedAt[1] - 1,
          responsePayload.generatedAt[2],
          responsePayload.generatedAt[3] || 0,
          responsePayload.generatedAt[4] || 0,
          responsePayload.generatedAt[5] || 0
        ).toISOString();
      } else if (typeof responsePayload.generatedAt === 'string') {
        generatedAt.value = responsePayload.generatedAt;
      } else {
        console.warn("Unexpected format for generatedAt:", responsePayload.generatedAt);
        generatedAt.value = new Date().toISOString();
      }
      hasNewSuggestion.value = true;
    } else {
      console.error("Invalid or incomplete suggestion data received:", responsePayload);
      currentSuggestion.value = '暂无可用建议，请稍后再试。';
      generatedAt.value = null;
    }
  } catch (error: unknown) { // 使用 unknown 类型
    console.error("Error fetching AI suggestion:", error);
    currentSuggestion.value = '获取建议时发生错误，请检查网络连接或稍后重试。';
    generatedAt.value = null;
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else if (typeof error === 'string') {
      errorMessage.value = error;
    } else {
      errorMessage.value = '获取AI建议失败: 未知错误类型';
    }
  } finally {
    loading.value = false;
  }
};

// --- Lifecycle Hooks ---
onMounted(() => {
  updateBubbleVisibility();

  // Initialize auto-expand based on route and fetch data if needed
  if (showBubble.value && isLoggedIn.value) {
    if (shouldAutoExpand.value) {
      expanded.value = true;
    }

    if (expanded.value) {
      fetchCurrentPageSuggestion();
    }
  }
})

// --- Watchers ---
watch(() => route.path, (newPath: string, oldPath: string | undefined | null) => { // 添加类型
  const wasVisible = shouldShowBubble(oldPath);
  const isVisible = shouldShowBubble(newPath);

  showBubble.value = isVisible;

  if (isVisible) {
    // Auto-expand based on route configuration
    if (shouldAutoExpand.value) {
      expanded.value = true;
    }

    // Fetch data when auto-expanded or already expanded
    if (expanded.value && isLoggedIn.value) {
      fetchCurrentPageSuggestion();
    }
  } else if (wasVisible && !isVisible) {
    // Collapse when navigating away
    expanded.value = false;
  }
}, { immediate: true });

// Re-fetch when logging in if bubble is visible and expanded
watch(isLoggedIn, (loggedIn: boolean) => { // 添加类型
  if (!loggedIn) {
    expanded.value = false;
    currentSuggestion.value = '';
    hasNewSuggestion.value = false;
  } else if (showBubble.value && expanded.value) {
    fetchCurrentPageSuggestion();
  }
});
</script>

<style scoped>
/* Transitions */
.bubble-container-fade-enter-active,
.bubble-container-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
  transition-delay: 0.15s;
}
.bubble-container-fade-enter-from,
.bubble-container-fade-leave-to {
  opacity: 0;
  transform: scale(0.9) translateX(10px);
  transform-origin: bottom right;
}

.bubble-fade-enter-active,
.bubble-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.bubble-fade-enter-from,
.bubble-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
  transform-origin: bottom right;
}

.content-fade-enter-active,
.content-fade-leave-active {
  transition: opacity 0.25s ease;
}
.content-fade-enter-from,
.content-fade-leave-to {
  opacity: 0;
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.icon-fade-enter-from,
.icon-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Loading Dots */
.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #4f46e5;
}

@keyframes dot-pulse {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-dot-pulse {
  animation: dot-pulse 1.4s infinite ease-in-out both;
}

/* Improved scrollbar for the suggestion content */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Base prose styles for Markdown content */
:deep(.prose) {
  font-size: 0.9rem;
  line-height: 1.5;
}

:deep(.prose h1) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  margin-top: 1rem;
}

:deep(.prose h2) {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  margin-top: 0.75rem;
}

:deep(.prose h3) {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  margin-top: 0.75rem;
}

:deep(.prose ul, .prose ol) {
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

:deep(.prose li) {
  margin-bottom: 0.25rem;
}

:deep(.prose p) {
  margin-bottom: 0.75rem;
}

:deep(.prose a) {
  color: #4f46e5;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

:deep(.prose a:hover) {
  text-decoration-thickness: 2px;
}

:deep(.prose strong) {
  font-weight: 600;
}

:deep(.prose-invert a) {
  color: #818cf8;
}

/* Animation for the refresh button */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1.5s linear infinite;
}

/* 气泡动画 */
@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(255, 0, 0, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
}

.animate-pulse {
  animation: pulse 2s infinite;
}
</style>

