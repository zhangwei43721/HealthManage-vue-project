import { createRouter, createWebHistory } from 'vue-router'
import ButtonShowcase from '../components/ButtonShowcase.vue'
import CardShowcase from '../components/CardShowcase.vue'

// 页面组件
const Home = {
  template: `
    <div class="py-8">
      <h1 class="text-3xl font-bold text-center text-primary mb-8">健康管理系统首页</h1>
      <p class="text-center text-text-secondary mb-8">这是使用Vue 3和Tailwind CSS v4构建的健康管理系统</p>
      <div class="max-w-6xl mx-auto">
        <ButtonShowcase />
        <CardShowcase />
      </div>
    </div>
  `,
  components: {
    ButtonShowcase,
    CardShowcase,
  },
}

const Features = {
  template: `
    <div class="py-8">
      <h1 class="text-3xl font-bold text-center text-primary mb-8">功能介绍</h1>
      <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">主要功能</h2>
        <ul class="space-y-2 mb-6">
          <li class="flex items-center text-gray-700">
            <span class="bg-green-100 text-green-600 rounded-full p-1 mr-3">✓</span>
            健康数据记录与追踪
          </li>
          <li class="flex items-center text-gray-700">
            <span class="bg-green-100 text-green-600 rounded-full p-1 mr-3">✓</span>
            饮食计划与营养分析
          </li>
          <li class="flex items-center text-gray-700">
            <span class="bg-green-100 text-green-600 rounded-full p-1 mr-3">✓</span>
            运动计划与活动记录
          </li>
          <li class="flex items-center text-gray-700">
            <span class="bg-green-100 text-green-600 rounded-full p-1 mr-3">✓</span>
            健康报告与数据分析
          </li>
        </ul>
      </div>
    </div>
  `,
}

const About = {
  template: `
    <div class="py-8">
      <h1 class="text-3xl font-bold text-center text-primary mb-8">关于我们</h1>
      <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <p class="text-text-secondary mb-4">
          健康管理系统是一个专注于个人健康数据管理的平台，帮助用户记录、分析和改善健康状况。
        </p>
        <p class="text-text-secondary">
          我们的使命是通过技术手段，让健康管理变得简单而有效，帮助每个人实现更健康的生活方式。
        </p>
      </div>
    </div>
  `,
}

// 健康数据页面
const HealthData = {
  template: `
    <div class="py-8">
      <h1 class="text-3xl font-bold text-center text-primary mb-8">健康数据</h1>
      <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-primary/10 rounded-lg">
            <h3 class="text-lg font-medium text-primary mb-2">身体指标</h3>
            <p class="text-text-secondary">查看和记录您的身高、体重、BMI等身体指标数据</p>
          </div>
          <div class="p-4 bg-secondary/10 rounded-lg">
            <h3 class="text-lg font-medium text-secondary mb-2">健康报告</h3>
            <p class="text-text-secondary">生成您的健康状况报告和分析</p>
          </div>
        </div>
      </div>
    </div>
  `,
}

// 饮食管理页面
const Diet = {
  template: `
    <div class="py-8">
      <h1 class="text-3xl font-bold text-center text-primary mb-8">饮食管理</h1>
      <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-primary/10 rounded-lg">
            <h3 class="text-lg font-medium text-primary mb-2">饮食记录</h3>
            <p class="text-text-secondary">记录每日饮食，跟踪卡路里摄入</p>
          </div>
          <div class="p-4 bg-secondary/10 rounded-lg">
            <h3 class="text-lg font-medium text-secondary mb-2">营养分析</h3>
            <p class="text-text-secondary">分析您的营养摄入情况</p>
          </div>
        </div>
      </div>
    </div>
  `,
}

// 运动计划页面
const Exercise = {
  template: `
    <div class="py-8">
      <h1 class="text-3xl font-bold text-center text-primary mb-8">运动计划</h1>
      <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-primary/10 rounded-lg">
            <h3 class="text-lg font-medium text-primary mb-2">运动记录</h3>
            <p class="text-text-secondary">记录您的运动情况</p>
          </div>
          <div class="p-4 bg-secondary/10 rounded-lg">
            <h3 class="text-lg font-medium text-secondary mb-2">个性化计划</h3>
            <p class="text-text-secondary">根据您的健康状况制定个性化运动计划</p>
          </div>
        </div>
      </div>
    </div>
  `,
}

// 路由配置
const routes = [
  { path: '/', component: Home },
  { path: '/features', component: Features },
  { path: '/about', component: About },
  { path: '/health-data', component: HealthData },
  { path: '/diet', component: Diet },
  { path: '/exercise', component: Exercise },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
