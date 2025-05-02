<script setup lang="ts">
import Header from './components/layout/Header.vue';
</script>

<template>
  <div class="min-h-screen bg-background">
    <Header />
    <div class="pt-20 py-8 px-4 md:px-8">
      <main class="max-w-6xl mx-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>
