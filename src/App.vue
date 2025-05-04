<script setup lang="ts">
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
import AiSuggestionBubble from './components/common/AiSuggestionBubble.vue';
import { computed } from '@/composables/vue-imports';
import { useRoute } from 'vue-router';

const route = useRoute();

// 判断是否在管理后台路由下
const isAdminRoute = computed(() => {
  return route.path.startsWith('/sys');
});

// 判断是否在ChatGPT风格页面下，不显示footer
const isAIRoute = computed(() => {
  return route.path.includes('/chatgpt-clone');
});
</script>

<template>
  <div class="app-container">
    <!-- 只在非管理后台路由下显示普通Header -->
    <Header v-if="!isAdminRoute" />
    <main class="content-area">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <!-- 只在非管理后台路由和非AI路由下显示普通Footer -->
    <Footer v-if="!isAdminRoute && !isAIRoute" />
    <AiSuggestionBubble />
  </div>
</template>

<style>
:root {
  --header-height: 64px;
  --footer-height: 80px;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', sans-serif;
  overflow-x: hidden;
  min-height: 100vh;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

.content-area {
  flex: 1;
  position: relative;
  z-index: 1;
  width: 100%;
}

/* 使Canvas可以全屏显示 */
canvas {
  display: block;
}

/* 页面过渡动画 - 增强版 */
.page-enter-active,
.page-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 兼容旧的fade动画，保留向后兼容性 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
