<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

// 使用异步组件导入，防止模块加载问题
const TailwindTest = defineAsyncComponent(() => import('./components/TailwindTest.vue'));
const CardShowcase = defineAsyncComponent(() => import('./components/CardShowcase.vue'));
const ButtonShowcase = defineAsyncComponent(() => import('./components/ButtonShowcase.vue'));
const InputFieldShowcase = defineAsyncComponent(() => import('./components/InputFieldShowcase.vue'));
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-primary p-4 shadow-md">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <h1 class="text-white text-2xl font-bold">健康管理系统</h1>
        <nav class="flex space-x-4">
          <a href="#" class="text-white hover:text-primary-light">首页</a>
          <a href="#" class="text-white hover:text-primary-light">数据</a>
          <a href="#" class="text-white hover:text-primary-light">设置</a>
        </nav>
      </div>
    </header>

    <main class="max-w-6xl mx-auto py-8 px-4">
      <TailwindTest />
      <CardShowcase />
      <ButtonShowcase />
      <InputFieldShowcase />
    </main>
  </div>
</template>

<style>
@import './assets/main.css';

body {
  margin: 0;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', sans-serif;
}
</style>
