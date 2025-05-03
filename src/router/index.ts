import { createRouter, createWebHistory } from 'vue-router'
import AiHomePage from '../views/AiHomePage.vue'
import Login from '../views/login/index.vue'
import Register from '../views/register/register.vue'
import HealthData from '../views/health-data.vue'
import HealthKnowledge from '../views/health-knowledge.vue'
import HealthLog from '../views/health/health-log.vue'
import AiQaPage from '../views/health/ai-qa.vue'
import { isAuthenticated } from '../services/auth'

// 页面组件

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
            健康知识与运动指南
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

// 注意：这里不再定义HealthData常量，因为已经从文件导入了

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

// 路由配置
const routes = [
  {
    path: '/',
    component: AiHomePage,
    meta: { requiresAuth: false },
  },
  {
    path: '/features',
    component: Features,
    meta: { requiresAuth: true, title: '功能介绍' },
  },
  {
    path: '/about',
    component: About,
    meta: { requiresAuth: true, title: '关于我们' },
  },
  {
    path: '/health-data',
    component: HealthData,
    meta: { requiresAuth: true, title: '健康数据中心' },
  },
  {
    path: '/health-knowledge',
    component: HealthKnowledge,
    meta: { requiresAuth: true, title: '健康知识库' },
  },
  {
    path: '/health-log',
    name: 'HealthLog',
    component: HealthLog,
    meta: { requiresAuth: true, title: '健康数据日志' },
  },
  {
    path: '/ai-qa',
    name: 'AiQaPage',
    component: AiQaPage,
    meta: { requiresAuth: true, title: 'AI 健康问答' },
  },
  // 登录注册路由
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }, // 不需要身份验证
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }, // 不需要身份验证
  },
  // 默认重定向到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 判断路由是否需要登录权限
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 检查是否已登录
    if (!isAuthenticated()) {
      // 未登录则跳转到登录页
      next({
        path: '/login',
        // 保存用户原本想访问的页面路径，以便登录成功后直接跳转
        query: { redirect: to.fullPath },
      })
    } else {
      // 已登录则放行
      next()
    }
  } else {
    // 不需要登录权限的页面直接放行
    next()
  }
})

export default router
