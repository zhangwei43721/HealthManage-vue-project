// 解决 TypeScript 类型错误问题
declare module 'vue' {
  export interface GlobalComponents {
    BaseButton: (typeof import('./components/base/Button.vue'))['default']
  }
}

// 为 <script setup> 中的宏声明类型
declare const defineProps: <Props>(props?: Props) => Props
declare const defineEmits: <E extends string[]>(
  events: E,
) => { (e: E[number], ...args: any[]): void }
declare const withDefaults: <T, D extends Partial<T>>(props: T, defaults: D) => T & D

// Vue 组件类型
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $slots: {
      default?: () => any
      [key: string]: () => any
    }
  }
}
