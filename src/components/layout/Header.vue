<template>
  <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" :class="[
    isAuthPage ? 'bg-gray-900/75 backdrop-blur-lg shadow-xl' :
      (scrolled ? 'backdrop-blur-lg bg-gray-900/40 shadow-lg' : 'backdrop-blur-lg bg-gray-900/40'),
    isMenuOpen ? 'h-auto' : 'h-16'
  ]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo区域 -->
        <div class="flex items-center">
          <RouterLink to="/" class="flex-shrink-0 flex items-center group">
            <div
              class="w-9 h-9 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center mr-2.5 shadow-lg group-hover:shadow-teal-500/25 transition-all duration-300">
              <Heart theme="filled" size="20" fill="#fff" />
            </div>
            <span class="text-xl font-bold text-white tracking-tight">AI健康管理</span>
          </RouterLink>
        </div>

        <!-- 桌面端导航菜单 -->
        <nav class="hidden md:flex items-center space-x-4">
          <!-- 用户导航菜单 -->
            <RouterLink v-for="(item, index) in userNavigationItems" :key="'user-'+index" :to="item.path"
              class="flex items-center px-4 py-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
              :class="{ 'bg-white/20 text-white font-medium shadow-sm': isActive(item.path) }">
              <component :is="item.icon" size="16" class="mr-1.5" />
              {{ item.name }}
            </RouterLink>

          <!-- 管理员入口按钮 (桌面端) -->
          <RouterLink v-if="userStore.isAdmin" to="/sys"
            class="flex items-center px-4 py-2 rounded-full text-white/90 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg">
            <SettingTwo size="16" class="mr-1.5" />
            进入管理后台
          </RouterLink>

          <!-- 用户认证区域 (桌面端) -->
          <div @click="handleAuthClick" class="flex items-center cursor-pointer bg-white/10 hover:bg-white/20 rounded-full px-3.5 py-1.5 transition-all duration-300 shadow-sm hover:shadow-md">
            <div class="w-7 h-7 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white text-xs font-medium shadow-sm">
              <!-- Display user avatar if available, otherwise default icon -->
              <img v-if="userStore.isAuthenticated && userStore.userInfo?.avatar" :src="userStore.userInfo.avatar" alt="Avatar" class="w-full h-full rounded-full object-cover" />
              <User v-else theme="outline" size="16" />
            </div>
            <span class="ml-2 text-sm font-medium text-white">{{ userStore.isAuthenticated ? '退出' : '登录' }}</span>
          </div>
        </nav>

        <!-- 移动端菜单按钮 -->
        <div class="flex items-center md:hidden">
          <button
            class="p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-200"
            @click="toggleMenu">
            <HamburgerButton v-if="!isMenuOpen" theme="outline" size="24" />
            <Close v-else theme="outline" size="24" />
          </button>
        </div>
      </div>
    </div>

    <!-- 移动端下拉菜单 -->
    <div class="md:hidden overflow-hidden transition-all duration-300 ease-in-out backdrop-blur-2xl bg-gray-900/85"
      :class="{ 'max-h-0 opacity-0': !isMenuOpen, 'max-h-[500px] opacity-100 shadow-lg': isMenuOpen }">
      <div class="px-4 pt-2 pb-4 space-y-1">
        <!-- 用户菜单项 (移动端) -->
          <RouterLink v-for="(item, index) in userNavigationItems" :key="'user-m-'+index" :to="item.path"
            class="flex items-center px-4 py-2.5 my-1 rounded-xl text-white/90 hover:text-white"
            :class="{ 'bg-white/20 text-white font-medium shadow-sm': isActive(item.path) }" @click="closeMenu">
            <component :is="item.icon" size="18" class="mr-2.5" />
            {{ item.name }}
          </RouterLink>

        <!-- 管理员入口按钮 (移动端) -->
        <RouterLink v-if="userStore.isAdmin" to="/sys"
          class="flex items-center px-4 py-2.5 my-1 rounded-xl text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          @click="closeMenu">
          <SettingTwo size="18" class="mr-2.5" />
          进入管理后台
        </RouterLink>

        <!-- 分隔线 -->
        <div class="border-t border-white/10 my-2"></div>

        <!-- 用户认证区域 (移动端) -->
        <div
          class="flex items-center px-4 py-2.5 rounded-xl text-white/90 hover:bg-white/10 cursor-pointer hover:text-white transition-colors duration-200"
          @click="handleAuthClickAndCloseMenu"
        >
          <component :is="userStore.isAuthenticated ? Logout : User" theme="outline" size="18" class="mr-2.5" />
          {{ userStore.isAuthenticated ? '退出登录' : '登录 / 注册' }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from '@/composables/vue-imports';
import { useRoute, useRouter } from 'vue-router';
import { Heart, HamburgerButton, Close, Home, Like, User, Logout, Book, Clipboard, Robot, SettingTwo } from '@icon-park/vue-next';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 状态管理
const isMenuOpen = ref(false);
const scrolled = ref(false);

// 是否在认证页面（登录/注册）
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register';
});

// 导航菜单项 (用户菜单)
const userNavigationItems = [
  { name: '首页', path: '/', icon: Home },
  { name: '健康数据', path: '/health-data', icon: Clipboard },
  { name: '健康知识', path: '/health-knowledge', icon: Book },
  { name: '健康日志', path: '/health-log', icon: Like },
  { name: 'AI 助手', path: '/ai-qa', icon: Robot }
];

// 监听滚动
const handleScroll = () => {
  scrolled.value = window.scrollY > 20;
};

// 检查当前路由是否激活
const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path === path || (path !== '/' && route.path.startsWith(path));
};

// 切换菜单显示状态
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 关闭菜单
const closeMenu = () => {
  isMenuOpen.value = false;
};

// 处理桌面端认证点击
const handleAuthClick = async () => {
  if (userStore.isAuthenticated) {
    await userStore.logout();
    router.push('/');
  } else {
    router.push('/login');
  }
};

// 处理移动端认证点击并关闭菜单
const handleAuthClickAndCloseMenu = async () => {
  await handleAuthClick();
  closeMenu();
};

// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
  if (userStore.token && !userStore.userInfo) {
    userStore.fetchUserInfo();
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* 平滑过渡效果 */
.router-link-active {
  transition: all 0.3s ease;
}

/* 向下滚动时Header阴影加深效果 */
header {
  transition: all 0.3s ease;
  height: var(--header-height);
  box-sizing: border-box;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

/* 渐变文字 */
.text-gradient {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
}

/* 移动端菜单过渡效果 */
.glass-effect {
  /* 确保定义了玻璃背景效果 */
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(200, 200, 200, 0.3);
}
.text-on-glass {
  /* 确保玻璃背景上的文字清晰 */
  color: #333; /* 或者根据你的背景调整 */
}

div[v-show] {
  transition: all 0.3s ease-in-out;
  max-height: 0;
  overflow: hidden;
}

div[v-show].h-auto {
  max-height: 500px; /* 增加最大高度以容纳更多项 */
}
</style>
