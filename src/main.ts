import './assets/tailwind.css' // 使用新的CSS-First文件
import { createApp } from 'vue'
import App from './App.vue'
import { install } from '@icon-park/vue-next/es/all'
import router from './router'

const app = createApp(App)
install(app) // 注册所有 IconPark 图标
app.use(router)
app.mount('#app')
