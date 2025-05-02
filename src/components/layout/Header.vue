<template>
  <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" :class="[
    scrolled ? 'backdrop-blur-lg bg-white/75 shadow-lg' : 'bg-white/65 backdrop-blur-md shadow-sm',
    isMenuOpen ? 'h-auto' : 'h-16'
  ]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo区域 -->
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <Heart theme="filled" size="24" fill="var(--color-primary)" class="mr-2" />
            <span
              class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">健康管理系统</span>
          </div>
        </div>

        <!-- 桌面端导航菜单 -->
        <nav class="hidden md:flex items-center space-x-1">
          <RouterLink v-for="(item, index) in navigationItems" :key="index" :to="item.path"
            class="flex items-center px-4 py-2 mx-1 rounded-full text-text-secondary hover:text-primary hover:bg-primary/5 transition-all duration-200"
            :class="{ 'bg-primary/10 text-primary font-medium': isActive(item.path) }">
            <component :is="item.icon" size="16" class="mr-1.5" />
            {{ item.name }}
          </RouterLink>
        </nav>

        <!-- 用户菜单（桌面端） -->
        <div class="hidden md:flex items-center space-x-4">
          <div
            class="flex items-center cursor-pointer bg-primary/5 hover:bg-primary/10 rounded-full px-3 py-1.5 transition-colors duration-200">
            <div
              class="w-7 h-7 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center text-white text-xs font-medium">
              用户
            </div>
            <span class="ml-2 text-sm font-medium text-primary">个人中心</span>
          </div>
        </div>

        <!-- 移动端菜单按钮 -->
        <div class="flex items-center md:hidden">
          <button
            class="p-2 rounded-full text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors duration-200"
            @click="toggleMenu">
            <HamburgerButton v-if="!isMenuOpen" theme="outline" size="24" />
            <Close v-else theme="outline" size="24" />
          </button>
        </div>
      </div>
    </div>

    <!-- 移动端下拉菜单 -->
    <div class="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
      :class="{ 'max-h-0 opacity-0': !isMenuOpen, 'max-h-96 opacity-100': isMenuOpen }">
      <div class="px-4 pt-2 pb-4 space-y-1">
        <RouterLink v-for="(item, index) in navigationItems" :key="index" :to="item.path"
          class="flex items-center px-4 py-2.5 my-1 rounded-xl text-text-secondary"
          :class="{ 'bg-primary/10 text-primary font-medium': isActive(item.path) }" @click="closeMenu">
          <component :is="item.icon" size="18" class="mr-2.5" />
          {{ item.name }}
        </RouterLink>

        <div class="border-t border-gray-100 my-2 pt-2">
          <div class="px-4 py-2 text-xs text-text-secondary uppercase tracking-wider">个人设置</div>
          <div class="flex items-center px-4 py-2.5 rounded-xl text-text-secondary">
            <User theme="outline" size="18" class="mr-2.5" />
            个人中心
          </div>
          <div class="flex items-center px-4 py-2.5 rounded-xl text-text-secondary">
            <User theme="outline" size="18" class="mr-2.5" />
            设置
          </div>
          <div class="flex items-center px-4 py-2.5 rounded-xl text-health-danger">
            <Close theme="outline" size="18" class="mr-2.5" />
            退出登录
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  Heart, HamburgerButton, Close, Home, Like, User
} from '@icon-park/vue-next'

// 导航菜单项
const navigationItems = [
  { name: '首页', path: '/', icon: Home },
  { name: '健康数据', path: '/health-data', icon: Like },
  { name: '饮食管理', path: '/diet', icon: User },
  { name: '运动计划', path: '/exercise', icon: User },
  { name: '关于我们', path: '/about', icon: User }
]

// 移动端菜单状态
const isMenuOpen = ref(false)

// 滚动状态
const scrolled = ref(false)

// 检测滚动改变header外观
const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

// 检测当前路由
const route = useRoute()
const isActive = (path: string) => {
  return route.path === path
}

// 切换菜单
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 关闭菜单
const closeMenu = () => {
  isMenuOpen.value = false
}

// 监听滚动事件
ref: {
  const mounted = () => {
    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始检查
  }

  const unmounted = () => {
    window.removeEventListener('scroll', handleScroll)
  }

  if (typeof window !== 'undefined') {
    mounted()
    window.addEventListener('beforeunload', unmounted)
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
}

/* 渐变文字 */
.text-gradient {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
}
</style>

<script lang="ts">
export default {
  name: 'Header'
}
</script>
