<template>
  <Teleport to="body">
    <div v-if="modelValue" @click.self="closeOnClickOutside ? $emit('update:modelValue', false) : null">
      <!-- 背景遮罩 -->
      <div
        class="fixed inset-0 transition-all duration-300 z-40"
        :class="backdropClass"
      ></div>

      <!-- 模态框容器 -->
      <div class="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <!-- 模态框内容 -->
        <div
          class="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 relative"
          :class="[sizeClass, { 'scale-100 opacity-100': modelValue, 'scale-95 opacity-0': !modelValue }]"
        >
          <!-- 关闭按钮 -->
          <button
            v-if="showCloseButton"
            @click="$emit('update:modelValue', false)"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- 标题区域 -->
          <div v-if="title" class="p-5 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
          </div>

          <!-- 内容区域 -->
          <div :class="{'p-5': padding}">
            <slot></slot>
          </div>

          <!-- 底部按钮区域 -->
          <div v-if="$slots.footer" class="p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from '@/composables/vue-imports';

interface Props {
  modelValue: boolean;
  title?: string;
  closeOnClickOutside?: boolean;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  transparent?: boolean;
  dark?: boolean;
  backdropStyle?: 'light' | 'dark' | 'blur' | 'glass' | 'transparent' | 'none';
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  closeOnClickOutside: true,
  showCloseButton: true,
  size: 'md',
  padding: true,
  transparent: false,
  dark: false,
  backdropStyle: 'blur'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

// 计算尺寸类
const sizeClass = computed(() => {
  switch(props.size) {
    case 'sm': return 'max-w-sm';
    case 'md': return 'max-w-md';
    case 'lg': return 'max-w-lg';
    case 'xl': return 'max-w-xl';
    case 'full': return 'max-w-full mx-4';
    default: return 'max-w-md';
  }
});

// 计算背景样式类
const backdropClass = computed(() => {
  if (props.transparent) {
    return 'bg-opacity-0';
  }

  switch (props.backdropStyle) {
    case 'light':
      return 'bg-white/40 backdrop-blur-sm';
    case 'dark':
      return 'bg-gray-900/40 backdrop-blur-sm';
    case 'blur':
      return 'backdrop-blur-sm bg-white/20 dark:bg-gray-900/20';
    case 'glass':
      return 'backdrop-blur-md bg-white/30 dark:bg-gray-800/30';
    case 'transparent':
      return 'bg-opacity-0';
    case 'none':
      return 'hidden';
    default:
      return 'backdrop-blur-sm bg-white/20 dark:bg-gray-900/20';
  }
});

// 监听模态框打开，禁用滚动
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}, { immediate: true });
</script>

<style scoped>
/* 淡入淡出动画 */
.scale-95 {
  transform: scale(0.95);
}
.scale-100 {
  transform: scale(1);
}
.opacity-0 {
  opacity: 0;
}
.opacity-100 {
  opacity: 1;
}
</style>
