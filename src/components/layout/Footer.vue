<template>
  <footer class="footer-container">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <!-- 版权信息 -->
        <div class="mb-4 md:mb-0">
          <p class="text-sm text-gray-300">
            © {{ currentYear }} 健康管理系统 - 保留所有权利
          </p>
        </div>

        <!-- 链接区域 -->
        <div class="flex flex-col md:flex-row items-center md:space-x-6 space-y-2 md:space-y-0">
          <a href="#" class="text-sm text-gray-300 hover:text-white transition-colors">
            使用条款
          </a>
          <a href="#" class="text-sm text-gray-300 hover:text-white transition-colors">
            隐私政策
          </a>
          <a href="#" class="text-sm text-gray-300 hover:text-white transition-colors">
            联系我们
          </a>
        </div>

        <!-- 社交媒体图标 -->
        <div class="mt-4 md:mt-0 flex space-x-4">
          <a href="#" class="text-gray-300 hover:text-white transition-colors">
            <Message theme="outline" size="20" />
          </a>
          <a href="#" class="text-gray-300 hover:text-white transition-colors">
            <User theme="outline" size="20" />
          </a>
          <a href="#" class="text-gray-300 hover:text-white transition-colors">
            <Like theme="outline" size="20" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { ref } from 'vue'
import { Message, User, Like } from '@icon-park/vue-next'

export default {
  name: 'Footer',
  setup() {
    // 获取当前年份
    const currentYear = ref(new Date().getFullYear())

    return {
      currentYear
    }
  },
  components: {
    Message,
    User,
    Like
  }
}
</script>

<style scoped>
.footer-container {
  background-color: #1e293b;
  background-image: linear-gradient(to bottom, #1e293b, #0f172a);
  color: white;
  padding: 1.5rem 0;
  position: relative;
  z-index: 10;
  width: 100%;
  height: var(--footer-height);
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .footer-container {
    height: auto;
    min-height: var(--footer-height);
    padding: 2rem 0;
  }
}
</style>
 