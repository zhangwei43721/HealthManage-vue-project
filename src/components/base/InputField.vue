<template>
  <div class="relative w-full">
    <!-- 表单标签 (可选) -->
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-health-danger">*</span>
    </label>

    <!-- 左侧图标 -->
    <component
      v-if="leftIcon"
      :is="leftIcon"
      :theme="iconTheme"
      :size="iconSizeValue"
      class="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
    />

    <!-- 输入框 -->
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :name="name"
      :maxlength="maxLength"
      :step="step"
      :autocomplete="autocomplete"
      :class="[
        /* 基础样式 */
        'w-full transition-all duration-200 rounded-lg border',
        'outline-none focus:ring-2 focus:ring-opacity-20',
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

        /* 状态样式 */
        {
          'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed': disabled,
          'bg-white text-gray-900 border-gray-300 hover:border-gray-400 focus:border-primary focus:ring-primary': !disabled && !error,
          'bg-white text-gray-900 border-health-danger focus:border-health-danger focus:ring-health-danger': !disabled && error,
        }
      ]"
      @input="onInput"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
      @keydown.enter="emit('enter', $event)"
    />

    <!-- 右侧图标 -->
    <component
      v-if="rightIcon"
      :is="rightIcon"
      :theme="iconTheme"
      :size="iconSizeValue"
      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
    />

    <!-- 错误提示 -->
    <p v-if="error && errorMessage" class="mt-1 text-sm text-health-danger">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@/composables/vue-imports';

// 定义 props
interface Props {
  modelValue: string | number;
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  step?: string | number;
  autocomplete?: string;
  leftIcon?: object | string | null;
  rightIcon?: object | string | null;
  iconTheme?: string;
  iconSize?: number | string;
  error?: boolean;
  errorMessage?: string;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  name: undefined,
  type: 'text',
  placeholder: '',
  size: 'medium',
  disabled: false,
  required: false,
  maxLength: undefined,
  step: undefined,
  autocomplete: undefined,
  leftIcon: null,
  rightIcon: null,
  iconTheme: 'outline',
  iconSize: null,
  error: false,
  errorMessage: '',
  label: undefined,
});

// 定义事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'enter', event: KeyboardEvent): void;
}>();

// 计算图标尺寸
const iconSizeValue = computed(() => {
  if (props.iconSize) return props.iconSize;

  const sizeMap: Record<string, number> = {
    small: 16,
    medium: 18,
    large: 22
  };

  return sizeMap[props.size] || 18;
});

// 输入处理
const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<style scoped>
/* 输入框聚焦时的平滑过渡 */
input {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1; /* 确保输入框在其容器上下文中正确堆叠 */
}

/* 输入框容器 */
.relative {
  z-index: 1; /* 防止组件被更高层级的元素覆盖 */
  isolation: isolate; /* 创建新的堆叠上下文，防止子元素溢出 */
}

/* 输入框占位符颜色平滑过渡 */
input::placeholder {
  transition: color 0.2s ease;
}

input:focus::placeholder {
  color: rgba(156, 163, 175, 0.6);
}

/* 自定义自动填充样式 */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset;
  -webkit-text-fill-color: inherit;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
