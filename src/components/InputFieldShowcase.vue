<template>
  <div class="p-8 bg-background rounded-health shadow-health-card mb-8">
    <h2 class="text-3xl font-bold text-primary mb-6">输入框组件展示</h2>

    <!-- 基础输入框 -->
    <section class="mb-8">
      <h3 class="text-xl font-semibold mb-4">基础输入框</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label class="block text-text-secondary mb-2">普通输入框</label>
          <input type="text" placeholder="请输入内容"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20" />
        </div>
        <div>
          <label class="block text-text-secondary mb-2">密码输入框</label>
          <input type="password" placeholder="请输入密码"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20" />
        </div>
      </div>
    </section>

    <!-- 带图标的输入框 -->
    <section class="mb-8">
      <h3 class="text-xl font-semibold mb-4">带图标的输入框</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label class="block text-text-secondary mb-2">左侧图标</label>
          <div class="relative">
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <input type="text" placeholder="搜索..."
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20" />
          </div>
        </div>
        <div>
          <label class="block text-text-secondary mb-2">右侧图标</label>
          <div class="relative">
            <input type="text" placeholder="请输入邮箱"
              class="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20" />
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 不同尺寸 -->
    <section class="mb-8">
      <h3 class="text-xl font-semibold mb-4">不同尺寸</h3>
      <div class="flex flex-col space-y-6">
        <div>
          <label class="block text-text-secondary mb-2">小型输入框</label>
          <input type="text" placeholder="小型尺寸"
            class="w-full px-4 py-1.5 text-sm rounded-md border border-gray-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20" />
        </div>
        <div>
          <label class="block text-text-secondary mb-2">中型输入框 (默认)</label>
          <input type="text" placeholder="中型尺寸"
            class="w-full px-4 py-2 text-base rounded-lg border border-gray-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20" />
        </div>
        <div>
          <label class="block text-text-secondary mb-2">大型输入框</label>
          <input type="text" placeholder="大型尺寸"
            class="w-full px-4 py-2.5 text-lg rounded-xl border border-gray-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20" />
        </div>
      </div>
    </section>

    <!-- 错误状态 -->
    <section class="mb-8">
      <h3 class="text-xl font-semibold mb-4">错误状态</h3>
      <div>
        <label class="block text-text-secondary mb-2">带有错误提示的输入框</label>
        <input type="text" placeholder="请输入有效的邮箱地址"
          class="w-full px-4 py-2 rounded-lg border border-health-danger outline-none focus:border-health-danger focus:ring-2 focus:ring-health-danger focus:ring-opacity-20" />
        <p class="mt-1 text-sm text-health-danger">请输入有效的邮箱地址</p>
      </div>
    </section>

    <!-- 表单示例 -->
    <section>
      <h3 class="text-xl font-semibold mb-4">简单表单示例</h3>
      <div class="p-6 bg-background-light rounded-lg max-w-md">
        <form class="flex flex-col space-y-4">
          <div class="flex flex-col space-y-2">
            <label class="text-sm text-text-secondary">用户名</label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd" />
                </svg>
              </div>
              <input type="text" placeholder="请输入用户名"
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20" />
            </div>
          </div>
          <div class="flex flex-col space-y-2">
            <label class="text-sm text-text-secondary">邮箱</label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input type="email" placeholder="请输入邮箱"
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20" />
            </div>
          </div>
          <div class="flex flex-col space-y-2">
            <label class="text-sm text-text-secondary">密码</label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd" />
                </svg>
              </div>
              <input type="password" placeholder="请输入密码"
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20" />
            </div>
          </div>
          <button
            class="mt-4 inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark text-white shadow-md hover:shadow-lg">
            提交表单
          </button>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 不需要任何导入，纯展示组件
</script>

<script lang="ts">
export default {
  name: 'InputFieldShowcase'
}
</script>

<style scoped>
/* 这里可以添加自定义样式 */
</style>
 