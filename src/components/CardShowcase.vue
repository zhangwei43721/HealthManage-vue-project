<template>
  <div class="p-8 bg-background rounded-health shadow-health-card mb-8">
    <h2 class="text-3xl font-bold text-primary mb-6">卡片组件展示</h2>

    <!-- 基础卡片类型 -->
    <section class="mb-8">
      <h3 class="text-xl font-semibold mb-4">卡片类型</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <!-- 实心卡片 -->
        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:translate-y-[-3px]">
          <h4 class="text-lg font-medium mb-2">实心卡片</h4>
          <p class="text-gray-600">这是一个基础卡片，使用纯色背景。</p>
        </div>

        <!-- 毛玻璃卡片 -->
        <div
          class="glass-effect rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:translate-y-[-3px]">
          <h4 class="text-lg font-medium mb-2 text-on-glass">毛玻璃卡片</h4>
          <p class="text-on-glass opacity-80">这是一个毛玻璃效果卡片，带有模糊背景。</p>
        </div>

        <!-- 渐变卡片 -->
        <div
          class="gradient-primary rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:translate-y-[-3px] relative">
          <div class="absolute inset-0 bg-white/30 mix-blend-overlay rounded-xl"></div>
          <div class="relative z-10">
            <h4 class="text-lg font-medium mb-2 text-on-dark">渐变卡片</h4>
            <p class="text-on-dark opacity-80">这是一个带有渐变背景的卡片。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 卡片圆角大小 -->
    <section class="mb-8">
      <h3 class="text-xl font-semibold mb-4">圆角大小</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h4 class="text-lg font-medium mb-2">小圆角</h4>
          <p class="text-gray-600">rounded-lg</p>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6">
          <h4 class="text-lg font-medium mb-2">中等圆角</h4>
          <p class="text-gray-600">rounded-xl</p>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <h4 class="text-lg font-medium mb-2">大圆角</h4>
          <p class="text-gray-600">rounded-2xl</p>
        </div>
      </div>
    </section>

    <!-- 阴影深度 -->
    <section class="mb-8">
      <h3 class="text-xl font-semibold mb-4">阴影深度</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300">
          <h4 class="text-lg font-medium mb-2">浅阴影</h4>
          <p class="text-gray-600">shadow-md</p>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl hover:translate-y-[-3px] transition-all duration-300">
          <h4 class="text-lg font-medium mb-2">中等阴影</h4>
          <p class="text-gray-600">shadow-lg</p>
        </div>

        <div class="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300">
          <h4 class="text-lg font-medium mb-2">深阴影</h4>
          <p class="text-gray-600">shadow-xl</p>
        </div>
      </div>
    </section>

    <!-- 实用示例 -->
    <section>
      <h3 class="text-xl font-semibold mb-4">实用示例</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 健康数据卡片 -->
        <div class="glass-effect rounded-xl shadow-lg p-6 hover:shadow-xl hover:translate-y-[-3px] transition-all duration-300">
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-medium text-on-glass">健康数据</h4>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 bg-primary/10 rounded-lg text-center">
              <p class="text-sm text-gray-500">今日步数</p>
              <p class="text-2xl font-bold text-primary">8,453</p>
            </div>
            <div class="p-3 bg-blue-500/10 rounded-lg text-center">
              <p class="text-sm text-gray-500">消耗卡路里</p>
              <p class="text-2xl font-bold text-blue-500">347</p>
            </div>
            <div class="p-3 bg-health-success/10 rounded-lg text-center">
              <p class="text-sm text-gray-500">睡眠时间</p>
              <p class="text-2xl font-bold text-health-success">7.5h</p>
            </div>
            <div class="p-3 bg-health-warning/10 rounded-lg text-center">
              <p class="text-sm text-gray-500">平均心率</p>
              <p class="text-2xl font-bold text-health-warning">72</p>
            </div>
          </div>
        </div>

        <!-- 用户资料卡片 -->
        <div class="gradient-secondary rounded-xl shadow-lg p-6 hover:shadow-xl hover:translate-y-[-3px] transition-all duration-300 relative">
          <div class="absolute inset-0 bg-white/30 mix-blend-overlay rounded-xl"></div>
          <div class="relative z-10">
            <div class="flex items-center mb-6">
              <div
                class="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white text-xl font-bold">
                张三
              </div>
              <div class="ml-4">
                <h4 class="text-lg font-medium text-on-dark">张三</h4>
                <p class="text-on-dark opacity-70">健康会员 · 加入3个月</p>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <div>
                <p class="text-on-dark opacity-70">当前状态</p>
                <div class="mt-1 flex items-center">
                  <span class="inline-block w-2 h-2 rounded-full bg-health-success mr-2"></span>
                  <span class="font-medium text-health-success">健康状态良好</span>
                </div>
              </div>
              <button
                class="px-3 py-1.5 text-sm rounded-md glass-effect text-on-glass border border-white/20 hover:bg-white/20">
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 不需要任何导入，纯展示组件
</script>

<script lang="ts">
export default {
  name: 'CardShowcase'
}
</script>

<style scoped>
/* 卡片悬停动效 */
[class*="shadow"] {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
