<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <AdminHeader />
    <main class="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <router-view v-slot="{ Component }">
        <transition name="admin-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <!-- Optional Admin Footer -->
    <!--
    <footer class="bg-gray-700 text-white text-center py-4 mt-auto">
      Admin Footer
    </footer>
    -->
  </div>
</template>

<script setup lang="ts">
import AdminHeader from '@/components/layout/AdminHeader.vue';
</script>

<style scoped>
/* 管理后台页面过渡动画 */
.admin-fade-enter-active,
.admin-fade-leave-active {
  transition: all 0.3s ease;
}

.admin-fade-enter-from,
.admin-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
