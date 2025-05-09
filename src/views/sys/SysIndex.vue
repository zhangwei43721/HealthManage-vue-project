<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">管理后台首页</h1>
    <Card variant="solid" elevation="medium">
      <p class="text-gray-700">
        欢迎来到健康管理系统后台。
        请使用左侧（或上方）导航菜单管理系统用户、角色、健康知识等内容。
      </p>
      <!-- 可以添加一些快捷链接或统计信息 -->
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/base/Card.vue';
</script>
