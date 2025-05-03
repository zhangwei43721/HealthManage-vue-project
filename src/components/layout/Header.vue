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
        <nav class="hidden md:flex items-center space-x-1">
          <RouterLink v-for="(item, index) in navigationItems" :key="index" :to="item.path"
            class="flex items-center px-4 py-2 mx-1 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
            :class="{ 'bg-white/20 text-white font-medium shadow-sm': isActive(item.path) }">
            <component :is="item.icon" size="16" class="mr-1.5" />
            {{ item.name }}
          </RouterLink>
        </nav>

        <!-- 用户菜单（桌面端） -->
        <div class="hidden md:flex items-center space-x-4">
          <div @click="handleAuthAction"
            class="flex items-center cursor-pointer bg-white/10 hover:bg-white/20 rounded-full px-3.5 py-1.5 transition-all duration-300 shadow-sm hover:shadow-md">
            <div
              class="w-7 h-7 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center text-white text-xs font-medium shadow-sm">
              <component :is="userLoggedIn ? 'Logout' : 'User'" size="16" />
            </div>
            <span class="ml-2 text-sm font-medium text-white">{{ userLoggedIn ? '退出' : '登录' }}</span>
          </div>
        </div>

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
      :class="{ 'max-h-0 opacity-0': !isMenuOpen, 'max-h-96 opacity-100 shadow-lg': isMenuOpen }">
      <div class="px-4 pt-2 pb-4 space-y-1">
        <RouterLink v-for="(item, index) in navigationItems" :key="index" :to="item.path"
          class="flex items-center px-4 py-2.5 my-1 rounded-xl text-white/90 hover:text-white"
          :class="{ 'bg-white/20 text-white font-medium shadow-sm': isActive(item.path) }" @click="closeMenu">
          <component :is="item.icon" size="18" class="mr-2.5" />
          {{ item.name }}
        </RouterLink>

        <div class="border-t border-white/10 my-2 pt-2">
          <div class="px-4 py-2 text-xs text-white/60 uppercase tracking-wider font-semibold">用户操作</div>
          <div v-if="userLoggedIn"
            class="flex items-center px-4 py-2.5 rounded-xl text-white/80 hover:bg-white/10 cursor-pointer">
            <User theme="outline" size="18" class="mr-2.5" />
            个人中心
          </div>
          <div @click="handleAuthAction"
            class="flex items-center px-4 py-2.5 rounded-xl text-white/90 hover:bg-white/10 cursor-pointer hover:text-white transition-colors duration-200">
            <component :is="userLoggedIn ? 'Logout' : 'User'" theme="outline" size="18" class="mr-2.5" />
            {{ userLoggedIn ? '退出登录' : '登录' }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Heart, HamburgerButton, Close, Home, Like, User, Logout, Book, Sport, Clipboard } from '@icon-park/vue-next';
import { isAuthenticated, logout } from '../../services/auth';

const route = useRoute();
const router = useRouter();

// 状态管理
const isMenuOpen = ref(false);
const scrolled = ref(false);

// 是否在认证页面（登录/注册）
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register';
});

// 是否已登录
const userLoggedIn = ref(isAuthenticated());

// 导航菜单项
const navigationItems = [
  { name: '首页', path: '/', icon: Home },
  { name: '健康数据', path: '/health-data', icon: Like },
  { name: '健康知识库', path: '/health-knowledge', icon: Book },
  { name: '健康数据日志', path: '/health-log', icon: Clipboard },
  { name: '关于我们', path: '/about', icon: User }
];

// 监听滚动
const handleScroll = () => {
  scrolled.value = window.scrollY > 20;
};

// 检查当前路由是否激活
const isActive = (path: string) => {
  return route.path === path;
};

// 切换菜单显示状态
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 关闭菜单
const closeMenu = () => {
  isMenuOpen.value = false;
};

// 处理登录/登出
const handleAuthAction = async () => {
  if (userLoggedIn.value) {
    // 已登录，执行登出
    try {
      await logout();
      userLoggedIn.value = false;
      // 登出后跳转到首页
      router.push('/');
    } catch (error) {
      console.error('登出失败:', error);
    }
  } else {
    // 未登录，跳转到登录页
    router.push('/login');
  }
};

// 检查登录状态
const checkLoginStatus = () => {
  userLoggedIn.value = isAuthenticated();
};

// 添加事件监听器
window.addEventListener('scroll', handleScroll);
handleScroll(); // 初始检查

// 添加路由变化监听器以更新登录状态
router.afterEach(() => {
  checkLoginStatus();
});

// 组件卸载时移除事件监听器
const beforeUnmount = () => {
  window.removeEventListener('scroll', handleScroll);
};

// 模拟生命周期钩子
beforeUnmount();
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
</style>
