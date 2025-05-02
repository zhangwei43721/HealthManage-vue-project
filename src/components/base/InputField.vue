<template>
  <div class="relative w-full">
    <!-- 左侧图标 -->
    <component v-if="leftIcon" :is="leftIcon" :theme="iconTheme" :size="iconSizeValue"
      class="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />

    <!-- 输入框 -->
    <input :type="type" :value="modelValue" :placeholder="placeholder" :disabled="disabled" :class="[
      /* 基础样式 */
      'w-full transition-all duration-200 rounded-lg border border-gray-300',
      'outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20',
      'font-medium placeholder:text-text-light',

      /* 尺寸控制 */
      {
        'py-1.5 text-sm': size === 'small',
        'py-2 text-base': size === 'medium',
        'py-2.5 text-lg': size === 'large',
      },

      /* 图标间距控制 */
      {
        'pl-10': leftIcon,
        'pl-4': !leftIcon,
        'pr-10': rightIcon,
        'pr-4': !rightIcon,
      },

      /* 禁用状态 */
      {
        'bg-gray-100 text-gray-400 cursor-not-allowed': disabled,
        'bg-white': !disabled,
      },

      /* 错误状态 */
      {
        'border-health-danger focus:border-health-danger focus:ring-health-danger focus:ring-opacity-20': error,
      }
    ]" @input="onInput" @blur="$emit('blur', $event)" @focus="$emit('focus', $event)" />

    <!-- 右侧图标 -->
    <component v-if="rightIcon" :is="rightIcon" :theme="iconTheme" :size="iconSizeValue"
      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />

    <!-- 错误提示 -->
    <p v-if="error && errorMessage" class="mt-1 text-sm text-health-danger">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script lang="ts">
// 使用 Vue 的 Options API 避免 TypeScript 错误
export default {
  name: 'BaseInputField',
  props: {
    modelValue: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
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
    leftIcon: {
      type: [Object, String],
      default: null
    },
    rightIcon: {
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
    error: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },

  computed: {
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
    onInput(event: Event): void {
      const target = event.target as HTMLInputElement;
      this.$emit('update:modelValue', target.value);
    }
  }
};
</script>
