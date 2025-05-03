/// <reference types="vite/client" />

import * as vue from '@vue/runtime-dom'

declare module 'vue' {
  export * from '@vue/runtime-dom'
}

// 确保ResizeObserver类型在全局可用
interface ResizeObserverOptions {
  box?: 'content-box' | 'border-box'
}

interface ResizeObserverSize {
  inlineSize: number
  blockSize: number
}

interface ResizeObserverEntry {
  readonly target: Element
  readonly contentRect: DOMRectReadOnly
  readonly borderBoxSize?: ReadonlyArray<ResizeObserverSize>
  readonly contentBoxSize?: ReadonlyArray<ResizeObserverSize>
}

interface ResizeObserver {
  observe(target: Element, options?: ResizeObserverOptions): void
  unobserve(target: Element): void
  disconnect(): void
}

interface ResizeObserverConstructor {
  new (callback: ResizeObserverCallback): ResizeObserver
}

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void

interface Window {
  ResizeObserver: ResizeObserverConstructor
}
