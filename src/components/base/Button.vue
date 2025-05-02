<template>
  <button :class="[
    /* 基础样式 */
    'inline-flex items-center justify-center whitespace-nowrap transition-all duration-200',
    'font-medium focus:outline-none focus:ring-2 focus:ring-offset-2',

    /* 尺寸控制 */
    {
      'px-3 py-1.5 text-sm rounded-md': type === 'small',
      'px-4 py-2 text-base rounded-lg': type === 'medium',
      'px-5 py-2.5 text-lg rounded-xl': type === 'large',
    },

    /* 宽度控制 */
    { 'w-full': block },

    /* 类型样式 */
    {
      /* 主要按钮 */
      'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md hover:shadow-lg hover:brightness-105 active:brightness-95 focus:ring-primary':
        btnType === 'primary' && !disabled,

      /* 次要按钮 */
      'bg-gradient-to-r from-secondary to-secondary-dark text-white shadow-md hover:shadow-lg hover:brightness-105 active:brightness-95 focus:ring-secondary':
        btnType === 'secondary' && !disabled,

      /* 成功按钮 */
      'bg-gradient-to-r from-health-success to-green-600 text-white shadow-md hover:shadow-lg hover:brightness-105 active:brightness-95 focus:ring-green-500':
        btnType === 'success' && !disabled,

      /* 警告按钮 */
      'bg-gradient-to-r from-health-warning to-amber-600 text-white shadow-md hover:shadow-lg hover:brightness-105 active:brightness-95 focus:ring-amber-500':
        btnType === 'warning' && !disabled,

      /* 危险按钮 */
      'bg-gradient-to-r from-health-danger to-red-600 text-white shadow-md hover:shadow-lg hover:brightness-105 active:brightness-95 focus:ring-red-500':
        btnType === 'danger' && !disabled,

      /* 轮廓按钮 */
      'bg-transparent border-2 border-primary text-primary hover:bg-primary-light hover:bg-opacity-10 active:bg-opacity-20 focus:ring-primary':
        btnType === 'outline' && !disabled,

      /* 轻量按钮 */
      'bg-primary-light bg-opacity-10 text-primary hover:bg-opacity-20 active:bg-opacity-30 focus:ring-primary shadow-none':
        btnType === 'light' && !disabled,

      /* 文本按钮 */
      'bg-transparent text-primary hover:underline focus:ring-primary shadow-none':
        btnType === 'text' && !disabled,

      /* 玻璃态按钮 */
      'bg-white bg-opacity-20 backdrop-blur-md text-white border border-white border-opacity-30 shadow-lg hover:bg-opacity-30 active:bg-opacity-40':
        btnType === 'glass' && !disabled,

      /* 禁用状态 */
      'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500 shadow-none':
        disabled
    },

    /* 图标按钮样式调整 */
    { 'p-2': iconOnly && size === 'small' },
    { 'p-2.5': iconOnly && size === 'medium' },
    { 'p-3': iconOnly && size === 'large' }
  ]" :disabled="disabled" @click="onClick">
    <component v-if="icon" :is="icon" :theme="iconTheme" :size="iconSizeValue" :class="[
      { 'mr-2': !iconOnly && $slots.default },
      'text-current'
    ]" />
    <span v-if="!iconOnly" :class="{ 'font-medium': true }">
      <slot></slot>
    </span>
  </button>
</template>

<script lang="ts">
// 使用 Vue 的 Options API 避免 TypeScript 错误
export default {
  name: 'BaseButton',
  props: {
    type: {
      type: String,
      default: 'primary',
      validator: (value: string) => ['primary', 'secondary', 'success', 'warning', 'danger', 'outline', 'light', 'text', 'glass'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value: string) => ['small', 'medium', 'large'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: [Object, String],
      default: null
    },
    iconTheme: {
      type: String,
      default: 'outline'
    },
    iconSize: {
      type: [Number, String],
      default: null
    },
    iconOnly: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    // 解决type属性与HTML button的type冲突
    btnType(): string {
      return this.type;
    },

    // 计算图标尺寸
    iconSizeValue(): number | string {
      if (this.iconSize) return this.iconSize;

      const sizeMap: Record<string, number> = {
        small: 16,
        medium: 18,
        large: 22
      };

      return sizeMap[this.size as keyof typeof sizeMap] || 18;
    }
  },

  methods: {
    onClick(event: MouseEvent): void {
      if (!this.disabled) {
        this.$emit('click', event);
      }
    }
  }
};
</script>
