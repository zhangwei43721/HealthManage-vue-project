import './assets/tailwind.css' // 使用新的CSS-First文件
import './assets/transitions.css' // 导入全局过渡效果样式
// import './assets/main.css' // Removed this import as @tailwindcss/vite handles CSS injection
import { createApp } from 'vue'
import { createPinia } from 'pinia' // 导入 createPinia
import App from './App.vue'
import { install } from '@icon-park/vue-next/es/all'
import router from './router'

const app = createApp(App)

// 1. 创建 Pinia 实例
const pinia = createPinia()

// 2. 使用 Pinia 实例 (必须在 router 之前)
app.use(pinia)

install(app) // 注册所有 IconPark 图标
app.use(router)
app.mount('#app')
