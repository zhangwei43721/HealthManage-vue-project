<template>
  <header class="bg-gray-800 text-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Title -->
        <div class="flex items-center">
          <Key theme="outline" size="24" class="mr-2 text-yellow-400" />
          <span class="text-xl font-bold">管理后台</span>
        </div>

        <!-- Admin Navigation -->
        <nav class="hidden md:flex items-center space-x-4">
          <RouterLink
            v-for="item in adminNavItems"
            :key="item.path"
            :to="item.path"
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            :class="{ 'bg-gray-900 text-white': $route.path.startsWith(item.path) }"
          >
            <component :is="item.icon" theme="outline" size="16" class="mr-1 inline-block align-text-bottom" />
            {{ item.name }}
          </RouterLink>
        </nav>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-4">
          <RouterLink to="/" class="text-gray-300 hover:text-white text-sm flex items-center">
            <Logout theme="outline" size="16" class="mr-1 transform rotate-180" /> <!-- Using Logout icon rotated for 'exit' -->
            返回前台
          </RouterLink>
          <button @click="handleLogout" class="text-gray-300 hover:text-red-400 text-sm flex items-center">
            <Power theme="outline" size="16" class="mr-1" />
            退出登录
          </button>
        </div>

         <!-- Mobile Menu Button (Optional for Admin) -->
         <!-- Add if needed -->

      </div>
    </div>
    <!-- Mobile Menu (Optional for Admin) -->
    <!-- Add if needed -->
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { Key, User, SettingTwo, BookOne, TransactionOrder, Logout, Power } from '@icon-park/vue-next';

const router = useRouter();
const userStore = useUserStore();

const adminNavItems = [
  { name: '首页', path: '/sys', icon: Key }, // Link to the admin index
  { name: '用户管理', path: '/sys/user', icon: User },
  { name: '角色管理', path: '/sys/role', icon: SettingTwo },
  { name: '知识管理', path: '/sys/knowledge-manage', icon: BookOne },
  { name: '运动项管理', path: '/sys/sport-item-manage', icon: TransactionOrder },
  { name: '用户健康数据', path: '/sys/user-health-manage', icon: User },
  // Add other admin links based on your `views/sys` components
];

const handleLogout = async () => {
  await userStore.logout();
  router.push('/login');
};
</script>

<style scoped>
/* Add specific styles if needed */
.router-link-active {
 /* Tailwind class used directly for active state */
}
</style>
