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
      'shadow-md hover:shadow-lg hover:translate-y-[-2px]': elevation === 'small',
      'shadow-lg hover:shadow-xl hover:translate-y-[-3px]': elevation === 'medium',
      'shadow-xl hover:shadow-2xl hover:translate-y-[-4px]': elevation === 'large',
    },

    /* 类型样式 */
    {
      /* 毛玻璃效果 */
      'glass-effect border-white/20 dark:border-white/10':
        variant === 'glass',

      /* 普通卡片 */
      'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700':
        variant === 'solid',

      /* 渐变卡片 */
      [customGradient ? customGradient : autoGradientClass]:
        variant === 'gradient',
    },

    /* 内边距控制 */
    {
      'p-4': padding === 'small',
      'p-6': padding === 'medium',
      'p-8': padding === 'large',
    },

    /* 响应式类 - 只在maxWidth为true时添加限制 */
    { 'md:max-w-md lg:max-w-lg mx-auto': maxWidth },

    /* 传入的自定义类 */
    className
  ]" :style="customStyles">
    <!-- 顶部条纹装饰(可选) -->
    <div v-if="showStripe" class="h-1.5 -mx-8 -mt-8 mb-6" :class="[stripeColor || 'gradient-primary']"></div>

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
    },
    // 渐变类型 (primary, secondary, success, warning, danger)
    gradientType: {
      type: String,
      default: 'primary',
      validator: (value: string) => ['primary', 'secondary', 'success', 'warning', 'danger'].includes(value)
    },
    // 是否启用最大宽度限制
    maxWidth: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    // 根据gradientType自动选择预定义的渐变类
    autoGradientClass(): string {
      const gradientMap: Record<string, string> = {
        'primary': 'gradient-primary',
        'secondary': 'gradient-secondary',
        'success': 'gradient-health-success',
        'warning': 'gradient-health-warning',
        'danger': 'gradient-health-danger'
      };

      return gradientMap[this.gradientType] || 'gradient-primary';
    }
  }
};
</script>

<style scoped>
/* 卡片悬停动效 */
[class*="shadow"] {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 渐变卡片的文字保护 */
[class*="gradient-"] {
  position: relative;
}

[class*="gradient-"]::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom,
    rgba(255, 255, 255, 0.4),
    rgba(255, 255, 255, 0.05)
  );
  pointer-events: none;
}
</style>
