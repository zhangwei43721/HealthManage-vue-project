<template>
  <div class="p-8 bg-background rounded-health shadow-health-card mb-8">
    <h2 class="text-3xl font-bold text-primary mb-6">按钮组件展示</h2>

    <!-- 基础按钮 -->
    <section class="mb-8">
      <h3 class="text-xl font-semibold mb-4">基础按钮</h3>
      <div class="flex flex-wrap gap-4">
        <button
          class="inline-flex items-center justify-center px-4 py-2 rounded-lg gradient-primary text-white shadow-md hover:shadow-lg hover:scale-[1.02]">
          主要按钮
        </button>
        <button
          class="inline-flex items-center justify-center px-4 py-2 rounded-lg gradient-secondary text-white shadow-md hover:shadow-lg hover:scale-[1.02]">
          次要按钮
        </button>
        <button
          class="inline-flex items-center justify-center px-4 py-2 rounded-lg gradient-health-success text-white shadow-md hover:shadow-lg hover:scale-[1.02]">
          成功按钮
        </button>
        <button
          class="inline-flex items-center justify-center px-4 py-2 rounded-lg gradient-health-warning text-white shadow-md hover:shadow-lg hover:scale-[1.02]">
          警告按钮
        </button>
        <button
          class="inline-flex items-center justify-center px-4 py-2 rounded-lg gradient-health-danger text-white shadow-md hover:shadow-lg hover:scale-[1.02]">
          危险按钮
        </button>
      </div>
    </section>

    <!-- 轮廓按钮 -->
    <section class="mb-8">
      <h3 class="text-xl font-semibold mb-4">轮廓按钮</h3>
      <div class="flex flex-wrap gap-4">
        <button
          class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-transparent border-2 border-primary text-primary hover:bg-primary/10 active:bg-primary/20">
          轮廓按钮
        </button>
        <button
          class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/30 shadow-none">
          轻量按钮
        </button>
        <button
          class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-transparent text-primary hover:underline hover:bg-primary/5 shadow-none">
          文本按钮
        </button>
      </div>
    </section>

    <!-- 尺寸 -->
    <section class="mb-8">
      <h3 class="text-xl font-semibold mb-4">按钮尺寸</h3>
      <div class="flex items-end flex-wrap gap-6">
        <div class="flex flex-col items-center">
          <button
            class="inline-flex items-center justify-center px-3 py-1.5 text-sm rounded-md gradient-primary text-white shadow-md hover:shadow-lg">
            小型按钮
          </button>
          <p class="text-xs text-gray-500 mt-2">small</p>
        </div>
        <div class="flex flex-col items-center">
          <button
            class="inline-flex items-center justify-center px-4 py-2 text-base rounded-lg gradient-primary text-white shadow-md hover:shadow-lg">
            中型按钮
          </button>
          <p class="text-xs text-gray-500 mt-2">medium</p>
        </div>
        <div class="flex flex-col items-center">
          <button
            class="inline-flex items-center justify-center px-5 py-2.5 text-lg rounded-xl gradient-primary text-white shadow-md hover:shadow-lg">
            大型按钮
          </button>
          <p class="text-xs text-gray-500 mt-2">large</p>
        </div>
      </div>
    </section>

    <!-- 玻璃态按钮 -->
    <section class="mb-8 relative overflow-hidden rounded-xl">
      <div class="absolute inset-0 gradient-primary opacity-40"></div>
      <div class="relative p-6">
        <h3 class="text-xl font-semibold mb-4 text-on-dark">玻璃态按钮</h3>
        <div class="flex flex-wrap gap-4">
          <button
            class="inline-flex items-center justify-center px-4 py-2 rounded-lg glass-effect text-on-glass shadow-lg hover:shadow-xl hover:bg-white/40">
            玻璃态按钮
          </button>
          <button
            class="inline-flex items-center justify-center px-4 py-2 rounded-lg glass-effect text-on-glass shadow-lg hover:shadow-xl hover:bg-white/40">
            另一个按钮
          </button>
        </div>
      </div>
    </section>

    <!-- 带图标的按钮 -->
    <section class="mb-8">
      <h3 class="text-xl font-semibold mb-4">带图标的按钮</h3>
      <div class="flex flex-wrap gap-4">
        <button
          class="inline-flex items-center justify-center px-4 py-2 rounded-lg gradient-primary text-white shadow-md hover:shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd" />
          </svg>
          添加项目
        </button>
        <button
          class="inline-flex items-center justify-center px-4 py-2 rounded-lg gradient-secondary text-white shadow-md hover:shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          编辑内容
        </button>
        <button
          class="inline-flex items-center justify-center p-2 rounded-lg gradient-primary text-white shadow-md hover:shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </section>

    <!-- 禁用状态 -->
    <section class="mb-8">
      <h3 class="text-xl font-semibold mb-4">禁用状态</h3>
      <div class="flex flex-wrap gap-4">
        <button disabled
          class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-300 text-gray-600 cursor-not-allowed shadow-none opacity-50">
          禁用按钮
        </button>
        <button disabled
          class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-transparent border-2 border-gray-300 text-gray-600 cursor-not-allowed shadow-none opacity-50">
          禁用轮廓
        </button>
      </div>
    </section>

    <!-- 块级按钮 -->
    <section>
      <h3 class="text-xl font-semibold mb-4">块级按钮</h3>
      <div class="space-y-4 max-w-md">
        <button
          class="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg gradient-primary text-white shadow-md hover:shadow-lg">
          块级主要按钮
        </button>
        <button
          class="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg gradient-secondary text-white shadow-md hover:shadow-lg">
          块级次要按钮
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 不需要任何导入，纯展示组件
</script>

<script lang="ts">
export default {
  name: 'ButtonShowcase'
}
</script>

<style scoped>
button {
  transform: translateY(0);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

button:active:not(:disabled) {
  transform: translateY(1px);
}
</style>
