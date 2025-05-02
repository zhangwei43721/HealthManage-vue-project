<script setup lang="ts">
import ButtonShowcase from './components/ButtonShowcase.vue';
import CardShowcase from './components/CardShowcase.vue';
</script>

<template>
  <div class="min-h-screen bg-background py-8 px-4 md:px-8">
    <header class="text-center mb-10">
      <h1 class="text-4xl font-bold text-primary mb-2">健康管理系统</h1>
      <p class="text-text-secondary">使用Vue 3 + Tailwind CSS v4实现的组件库</p>
    </header>

    <main class="max-w-6xl mx-auto">
      <ButtonShowcase />
      <CardShowcase />
    </main>
  </div>
</template>
