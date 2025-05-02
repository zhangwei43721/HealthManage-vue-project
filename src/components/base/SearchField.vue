<template>
  <div class="relative">
    <InputField v-model="searchValue" :placeholder="placeholder" :size="size" :disabled="disabled" :leftIcon="Search"
      :iconTheme="iconTheme" :iconSize="iconSize" :error="error" :errorMessage="errorMessage"
      @blur="$emit('blur', $event)" @focus="$emit('focus', $event)" />
    <div v-if="searchValue && !disabled"
      class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-text-secondary hover:text-text-primary"
      @click="clearSearch">
      <component :is="Close" :theme="iconTheme" :size="iconSizeValue" />
    </div>
    <slot name="dropdown"></slot>
  </div>
</template>

<script lang="ts">
import InputField from './InputField.vue'
import { Search, Close } from '@icon-park/vue-next'

export default {
  name: 'SearchField',
  components: {
    InputField
  },
  props: {
    modelValue: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: '搜索...'
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

  data() {
    return {
      Search,
      Close,
      searchValue: this.modelValue
    }
  },

  watch: {
    modelValue(newValue) {
      this.searchValue = newValue;
    },
    searchValue(newValue) {
      this.$emit('update:modelValue', newValue);
      if (newValue) {
        this.$emit('search', newValue);
      }
    }
  },

  computed: {
    // 计算图标尺寸
    iconSizeValue(): number | string {
      if (this.iconSize) return this.iconSize;

      const sizeMap: Record<string, number> = {
        small: 14,
        medium: 16,
        large: 18
      };

      return sizeMap[this.size as keyof typeof sizeMap] || 16;
    }
  },

  methods: {
    clearSearch(): void {
      this.searchValue = '';
      this.$emit('clear');
      this.$nextTick(() => {
        // 触发重新搜索
        this.$emit('search', '');
      });
    }
  }
};
</script>
