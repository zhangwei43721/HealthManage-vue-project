<template>
  <div :class="[
    /* 基础样式 */
    'overflow-hidden transition-all duration-300 w-full',

    /* 圆角控制 */
    {
      'rounded-lg': radius === 'small',
      'rounded-xl': radius === 'medium',
      'rounded-2xl': radius === 'large',
    },

    /* 阴影控制 */
    {
      'shadow-md hover:shadow-lg': elevation === 'small',
      'shadow-lg hover:shadow-xl': elevation === 'medium',
      'shadow-xl hover:shadow-2xl': elevation === 'large',
    },

    /* 类型样式 */
    {
      /* 毛玻璃效果 */
      'backdrop-blur-md bg-white/60 dark:bg-gray-800/60 border border-white/10':
        variant === 'glass',

      /* 普通卡片 */
      'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700':
        variant === 'solid',

      /* 渐变卡片 */
      'bg-gradient-to-b':
        variant === 'gradient' && !customGradient,

      /* 自定义渐变 */
      [customGradient || 'from-primary-light/20 to-primary/10']:
        variant === 'gradient',
    },

    /* 内边距控制 */
    {
      'p-4': padding === 'small',
      'p-6': padding === 'medium',
      'p-8': padding === 'large',
    },

    /* 响应式类 */
    'md:max-w-md lg:max-w-lg mx-auto',

    /* 传入的自定义类 */
    className
  ]" :style="customStyles">
    <!-- 顶部条纹装饰(可选) -->
    <div v-if="showStripe" class="h-1 -mx-8 -mt-8 mb-6" :class="[stripeColor || 'bg-primary']"></div>

    <!-- 主要内容区域 -->
    <slot></slot>
  </div>
</template>

<script lang="ts">
// 使用 Options API 避免 TypeScript 错误
export default {
  name: 'BaseCard',
  props: {
    // 卡片变体: glass(毛玻璃), solid(实色), gradient(渐变)
    variant: {
      type: String,
      default: 'solid',
      validator: (value: string) => ['solid', 'glass', 'gradient'].includes(value)
    },
    // 圆角大小: small, medium, large
    radius: {
      type: String,
      default: 'medium',
      validator: (value: string) => ['small', 'medium', 'large'].includes(value)
    },
    // 阴影深度: small, medium, large
    elevation: {
      type: String,
      default: 'medium',
      validator: (value: string) => ['small', 'medium', 'large'].includes(value)
    },
    // 内边距大小: small, medium, large
    padding: {
      type: String,
      default: 'medium',
      validator: (value: string) => ['small', 'medium', 'large'].includes(value)
    },
    // 显示顶部条纹
    showStripe: {
      type: Boolean,
      default: false
    },
    // 顶部条纹颜色
    stripeColor: {
      type: String,
      default: ''
    },
    // 自定义渐变
    customGradient: {
      type: String,
      default: ''
    },
    // 自定义样式
    customStyles: {
      type: Object,
      default: () => ({})
    },
    // 自定义类名
    className: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped>
/* 增强玻璃效果的样式 */
[class*="variant-glass"] {
  position: relative;
  backdrop-filter: blur(8px);
  background-image: linear-gradient(to bottom right,
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0.05));
}

/* 扩展悬停效果的动画 */
[class*="shadow"] {
  transition: all 0.3s ease-in-out;
}

[class*="shadow"]:hover {
  transform: translateY(-2px);
}
</style>
