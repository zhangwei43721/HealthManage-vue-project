<template>
  <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" :class="[
    scrolled ? 'backdrop-blur-md bg-white/15 shadow-lg' : 'bg-transparent',
    isMenuOpen ? 'h-auto' : 'h-16'
  ]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo区域 -->
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <Heart theme="filled" size="24" fill="#fff" class="mr-2" />
            <span class="text-xl font-bold text-white">AI健康管理</span>
          </div>
        </div>

        <!-- 桌面端导航菜单 -->
        <nav class="hidden md:flex items-center space-x-1">
          <RouterLink v-for="(item, index) in navigationItems" :key="index" :to="item.path"
            class="flex items-center px-4 py-2 mx-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            :class="{ 'bg-white/20 text-white font-medium': isActive(item.path) }">
            <component :is="item.icon" size="16" class="mr-1.5" />
            {{ item.name }}
          </RouterLink>
        </nav>

        <!-- 用户菜单（桌面端） -->
        <div class="hidden md:flex items-center space-x-4">
          <div
            class="flex items-center cursor-pointer bg-white/10 hover:bg-white/20 rounded-full px-3 py-1.5 transition-colors duration-200">
            <div
              class="w-7 h-7 rounded-full bg-gradient-to-r from-teal-400 to-blue-400 flex items-center justify-center text-white text-xs font-medium">
              用户
            </div>
            <span class="ml-2 text-sm font-medium text-white">登录</span>
          </div>
        </div>

        <!-- 移动端菜单按钮 -->
        <div class="flex items-center md:hidden">
          <button
            class="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
            @click="toggleMenu">
            <HamburgerButton v-if="!isMenuOpen" theme="outline" size="24" />
            <Close v-else theme="outline" size="24" />
          </button>
        </div>
      </div>
    </div>

    <!-- 移动端下拉菜单 -->
    <div class="md:hidden overflow-hidden transition-all duration-300 ease-in-out backdrop-blur-xl bg-black/30"
      :class="{ 'max-h-0 opacity-0': !isMenuOpen, 'max-h-96 opacity-100': isMenuOpen }">
      <div class="px-4 pt-2 pb-4 space-y-1">
        <RouterLink v-for="(item, index) in navigationItems" :key="index" :to="item.path"
          class="flex items-center px-4 py-2.5 my-1 rounded-xl text-white/80"
          :class="{ 'bg-white/20 text-white font-medium': isActive(item.path) }" @click="closeMenu">
          <component :is="item.icon" size="18" class="mr-2.5" />
          {{ item.name }}
        </RouterLink>

        <div class="border-t border-white/10 my-2 pt-2">
          <div class="px-4 py-2 text-xs text-white/60 uppercase tracking-wider">个人设置</div>
          <div class="flex items-center px-4 py-2.5 rounded-xl text-white/80">
            <User theme="outline" size="18" class="mr-2.5" />
            个人中心
          </div>
          <div class="flex items-center px-4 py-2.5 rounded-xl text-white/80">
            <User theme="outline" size="18" class="mr-2.5" />
            设置
          </div>
          <div class="flex items-center px-4 py-2.5 rounded-xl text-red-300">
            <Close theme="outline" size="18" class="mr-2.5" />
            退出登录
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Heart, HamburgerButton, Close, Home, Like, User } from '@icon-park/vue-next'
import { useRoute } from 'vue-router'

export default {
  name: 'AppHeader',
  components: {
    Heart,
    HamburgerButton,
    Close,
    Home,
    Like,
    User
  },
  data() {
    return {
      isMenuOpen: false,
      scrolled: false,
      navigationItems: [
        { name: '首页', path: '/', icon: Home },
        { name: '健康数据', path: '/health-data', icon: Like },
        { name: '饮食管理', path: '/diet', icon: User },
        { name: '运动计划', path: '/exercise', icon: User },
        { name: '关于我们', path: '/about', icon: User }
      ]
    }
  },
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 20
    },
    isActive(path: string) {
      const route = useRoute()
      return route.path === path
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    closeMenu() {
      this.isMenuOpen = false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.handleScroll() // 初始检查
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
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
}

/* 渐变文字 */
.text-gradient {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
}
</style>
