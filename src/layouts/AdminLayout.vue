<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <AdminHeader />
    <main class="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <router-view />
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
/* Scoped styles for the admin layout if necessary */
</style>
