// Vue Composition API 导入封装
// 这样可以避免直接从vue模块导入引起的类型错误

// @ts-ignore 忽略类型检查
import * as Vue from 'vue'

// 创建替代导出
export const ref = Vue.ref
export const reactive = Vue.reactive
export const computed = Vue.computed
export const watch = Vue.watch
export const onMounted = Vue.onMounted
export const onUnmounted = Vue.onUnmounted
export const nextTick = Vue.nextTick
export const provide = Vue.provide
export const inject = Vue.inject
export const toRef = Vue.toRef
export const toRefs = Vue.toRefs

// 添加更多Vue组合API函数导出...

// 导出适配器，使用时只需将导入路径从'vue'改为'@/composables/vue-imports'
