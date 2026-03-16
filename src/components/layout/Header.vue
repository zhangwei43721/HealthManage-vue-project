<template>
  <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" :class="[
    isHomePage ? 'acrylic-header-home' : 'acrylic-header',
    isAuthPage ? 'shadow-xl' : (scrolled ? 'shadow-lg' : 'shadow-md'),
    isMenuOpen ? 'h-auto' : 'h-16'
  ]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo区域 -->
        <div class="flex items-center">
          <RouterLink :to="homeTarget" class="flex-shrink-0 flex items-center group">
            <div
              class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3 shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
              <img src="@/assets/logo.svg" alt="Logo" class="w-8 h-8" />
            </div>
            <span class="text-xl font-bold tracking-tight"
              :class="isHomePage ? 'text-white' : 'text-gray-800'">AI健康管理</span>
          </RouterLink>
        </div>

        <!-- 桌面端导航菜单 -->
        <nav class="hidden md:flex items-center space-x-5">
          <!-- 用户导航菜单 -->
          <RouterLink v-for="(item, index) in userNavigationItems" :key="'user-' + index" :to="item.path"
            class="flex items-center px-4 py-2 rounded-full transition-all duration-200" :class="[
              isHomePage
                ? 'text-white/90 hover:bg-white/15'
                : 'text-gray-700 hover:bg-gray-200/60',
              isActive(item.path)
                ? (isHomePage ? 'bg-white/20 text-white font-medium shadow-md' : 'bg-blue-100/50 text-blue-800 font-medium shadow-sm')
                : ''
            ]">
            <component :is="item.icon" size="16" class="mr-1.5" />
            {{ item.name }}
          </RouterLink>

          <!-- 用户认证区域 (桌面端) -->
          <div v-if="!userStore.isAuthenticated" @click="handleAuthClick" :class="[
            'flex items-center cursor-pointer rounded-full px-3.5 py-1.5 transition-all duration-300 shadow-sm hover:shadow-md',
            isHomePage ? 'bg-white/10 hover:bg-white/20' : 'bg-blue-50 hover:bg-blue-100'
          ]">
            <div
              class="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center text-white text-xs font-medium shadow-sm">
              <User theme="outline" size="16" />
            </div>
            <span class="ml-2 text-sm font-medium" :class="isHomePage ? 'text-white' : 'text-gray-800'">登录</span>
          </div>

          <!-- 头像下拉菜单 (桌面端-已登录) -->
          <div v-if="userStore.isAuthenticated" class="relative">
            <button
              type="button"
              @click="toggleUserMenu"
              :class="[
                'flex items-center cursor-pointer rounded-full p-1.5 transition-all duration-300 shadow-sm hover:shadow-md',
                isHomePage ? 'bg-white/10 hover:bg-white/20' : 'bg-blue-50 hover:bg-blue-100'
              ]"
            >
              <div
                class="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center text-white text-xs font-medium shadow-sm overflow-hidden">
                <img
                  v-if="userStore.userInfo?.avatar"
                  :src="userStore.userInfo.avatar"
                  alt="Avatar"
                  class="w-full h-full rounded-full object-cover"
                />
                <User v-else theme="outline" size="18" />
              </div>
            </button>

            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 top-12 w-44 overflow-hidden rounded-2xl border border-white/30 bg-white/95 py-2 shadow-xl backdrop-blur"
            >
              <button
                type="button"
                class="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-blue-50"
                @click="goToProfile"
              >
                <SettingTwo size="16" class="mr-2" />
                个人资料设置
              </button>
              <button
                type="button"
                class="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-blue-50"
                @click="goToHealthLog"
              >
                <Like size="16" class="mr-2" />
                健康日志
              </button>
              <button
                type="button"
                class="flex w-full items-center px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50"
                @click="handleLogout"
              >
                <Logout theme="outline" size="16" class="mr-2" />
                退出登录
              </button>
            </div>
          </div>
        </nav>

        <!-- 移动端菜单按钮 -->
        <div class="flex items-center md:hidden">
          <button class="p-2 rounded-full transition-colors duration-200"
            :class="isHomePage ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200/60'"
            @click="toggleMenu">
            <HamburgerButton v-if="!isMenuOpen" theme="outline" size="24" />
            <Close v-else theme="outline" size="24" />
          </button>
        </div>
      </div>
    </div>

    <!-- 移动端下拉菜单 -->
    <div class="md:hidden overflow-hidden transition-all duration-300 ease-in-out" :class="[
      isMenuOpen ? 'max-h-[500px] opacity-100 shadow-xl' : 'max-h-0 opacity-0',
      isHomePage ? 'acrylic-menu' : 'acrylic-menu-light'
    ]">
      <div class="px-4 pt-3 pb-5 space-y-2">
        <!-- 用户菜单项 (移动端) -->
        <RouterLink v-for="(item, index) in userNavigationItems" :key="'user-m-' + index" :to="item.path"
          class="flex items-center px-4 py-3 my-1 rounded-xl transition-all" :class="[
            isHomePage
              ? 'text-white/90 hover:bg-white/10'
              : 'text-gray-700 hover:bg-gray-200/60',
            isActive(item.path)
              ? (isHomePage ? 'bg-white/20 text-white font-medium shadow-md' : 'bg-blue-100/70 text-blue-800 font-medium shadow-sm')
              : ''
          ]" @click="closeMenu">
          <component :is="item.icon" size="18" class="mr-2.5" />
          {{ item.name }}
        </RouterLink>

        <!-- 头像菜单 (移动端-已登录) -->
        <div v-if="userStore.isAuthenticated">
          <button
            type="button"
            class="flex w-full items-center px-4 py-3 my-1 rounded-xl transition-all"
            :class="isHomePage ? 'text-white/90 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200/60'"
            @click="toggleUserMenu"
          >
            <div
              class="mr-2.5 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 text-white shadow-sm">
              <img
                v-if="userStore.userInfo?.avatar"
                :src="userStore.userInfo.avatar"
                alt="Avatar"
                class="h-full w-full object-cover"
              />
              <User v-else theme="outline" size="18" />
            </div>
            <span class="flex-1 text-left">账户菜单</span>
            <Close v-if="isUserMenuOpen" theme="outline" size="14" />
            <HamburgerButton v-else theme="outline" size="14" />
          </button>

          <div v-if="isUserMenuOpen" class="space-y-1 pl-4">
            <button
              type="button"
              class="flex w-full items-center px-4 py-2.5 rounded-xl text-sm transition-all"
              :class="isHomePage ? 'text-white/90 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200/60'"
              @click="goToProfileAndCloseMenu"
            >
              <SettingTwo size="16" class="mr-2.5" />
              个人资料设置
            </button>
            <button
              type="button"
              class="flex w-full items-center px-4 py-2.5 rounded-xl text-sm transition-all"
              :class="isHomePage ? 'text-white/90 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200/60'"
              @click="goToHealthLogAndCloseMenu"
            >
              <Like size="16" class="mr-2.5" />
              健康日志
            </button>
            <button
              type="button"
              class="flex w-full items-center px-4 py-2.5 rounded-xl text-sm transition-all"
              :class="isHomePage ? 'text-white/90 hover:bg-white/10' : 'text-red-500 hover:bg-red-50'"
              @click="handleLogoutAndCloseMenu"
            >
              <Logout theme="outline" size="16" class="mr-2.5" />
              退出登录
            </button>
          </div>
        </div>

        <!-- 分隔线 -->
        <div v-if="!userStore.isAuthenticated" :class="isHomePage ? 'border-t border-white/20 my-2' : 'border-t border-gray-200 my-2'"></div>

        <!-- 用户认证区域 (移动端) -->
        <div v-if="!userStore.isAuthenticated" class="flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all"
          :class="isHomePage ? 'text-white/90 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-200/60'"
          @click="handleAuthClickAndCloseMenu">
          <User theme="outline" size="18" class="mr-2.5" />
          登录 / 注册
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from '@/composables/vue-imports';
import { useRoute, useRouter } from 'vue-router';
import { HamburgerButton, Close, Home, Like, User, Logout, Book, Robot, SettingTwo } from '@icon-park/vue-next';
import { useUserStore } from '@/stores/user';

// 定义组件名称
defineOptions({
  name: 'AppHeader'
});

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 状态管理
const isMenuOpen = ref(false);
const scrolled = ref(false);
const isUserMenuOpen = ref(false);

// 是否在认证页面（登录/注册）
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register';
});

// 是否在首页
const isHomePage = computed(() => {
  return route.path === '/';
});

// 导航菜单项 (用户菜单)
const homeTarget = computed(() => userStore.isAuthenticated ? '/health-data' : '/');

const userNavigationItems = computed(() => {
  if (userStore.isAuthenticated) {
    return [
      { name: '首页', path: '/health-data', icon: Home },
      { name: '小爱医生', path: '/chatgpt-clone', icon: Robot },
      { name: '健康知识', path: '/health-knowledge', icon: Book }
    ];
  }

  return [
    { name: '首页', path: '/', icon: Home },
    { name: '小爱医生', path: '/chatgpt-clone', icon: Robot },
    { name: '健康知识', path: '/health-knowledge', icon: Book }
  ];
});

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

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const closeUserMenu = () => {
  isUserMenuOpen.value = false;
};

// 处理桌面端认证点击
const handleAuthClick = async () => {
  if (!userStore.isAuthenticated) {
    router.push('/login');
  }
};

const goToProfile = () => {
  closeUserMenu();
  router.push('/profile');
};

const goToHealthLog = () => {
  closeUserMenu();
  router.push('/health-log');
};

const goToProfileAndCloseMenu = () => {
  goToProfile();
  closeMenu();
};

const goToHealthLogAndCloseMenu = () => {
  goToHealthLog();
  closeMenu();
};

// 处理登出
const handleLogout = async () => {
  closeUserMenu();
  await userStore.logout();
  router.push('/');
};

const handleLogoutAndCloseMenu = async () => {
  await handleLogout();
  closeMenu();
};

// 处理移动端认证点击并关闭菜单
const handleAuthClickAndCloseMenu = async () => {
  await handleAuthClick();
  closeMenu();
};

watch(
  () => route.fullPath,
  () => {
    closeMenu();
    closeUserMenu();
  }
);

const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement | null;

  if (!target?.closest('header')) {
    closeUserMenu();
  }
};

// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('click', handleDocumentClick);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleDocumentClick);
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
}

/* 首页使用透明的亚克力毛玻璃效果 */
.acrylic-header-home {
  background-color: rgba(202, 202, 202, 0.068);
  /* 透明度更高的深蓝色背景 */
  backdrop-filter: blur(16px) saturate(110%);
  -webkit-backdrop-filter: blur(16px) saturate(110%);
  border-bottom: 1px solid rgba(20, 96, 189, 0.596);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

/* 其他页面使用亮色亚克力毛玻璃效果，无底边框 */
.acrylic-header {
  background-color: rgba(250, 250, 250, 0.8);
  /* 浅色背景 */
  backdrop-filter: blur(16px) saturate(110%);
  -webkit-backdrop-filter: blur(16px) saturate(110%);
  border-bottom: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
}

.acrylic-menu {
  background-color: rgba(23, 55, 94, 0.95);
  /* 深蓝色背景，更不透明 */
  backdrop-filter: blur(16px) saturate(110%);
  -webkit-backdrop-filter: blur(16px) saturate(110%);
  border-bottom: 1px solid rgba(35, 70, 112, 0.7);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* 浅色菜单 */
.acrylic-menu-light {
  background-color: rgba(250, 250, 250, 0.95);
  /* 浅色背景 */
  backdrop-filter: blur(16px) saturate(110%);
  -webkit-backdrop-filter: blur(16px) saturate(110%);
  border-bottom: none;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

/* 支持暗黑模式 */
@media (prefers-color-scheme: dark) {
  .acrylic-header-home {
    background-color: rgba(15, 40, 70, 0.7);
    /* 透明度更高的深色背景 */
    border-bottom: 1px solid rgba(35, 70, 112, 0.3);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .acrylic-header {
    background-color: rgba(15, 40, 70, 0.9);
    /* 深色背景 */
    border-bottom: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  }

  .acrylic-menu {
    background-color: rgba(15, 40, 70, 0.95);
    border-bottom: 1px solid rgba(35, 70, 112, 0.3);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  }

  .acrylic-menu-light {
    background-color: rgba(25, 35, 50, 0.95);
    border-bottom: none;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  }
}

/* 渐变文字 */
.text-gradient {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
}

div[v-show] {
  transition: all 0.3s ease-in-out;
  max-height: 0;
  overflow: hidden;
}

div[v-show].h-auto {
  max-height: 500px;
  /* 增加最大高度以容纳更多项 */
}
</style>
