import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user' // 导入 user store
import AiHomePage from '../views/health/AiHomePage.vue'
import Login from '../views/login/index.vue'
import Register from '../views/register/register.vue'
import HealthData from '../views/health/health-data.vue'
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

// 注意：这里不再定义HealthData常量，因为已经从文件导入了health.ts

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
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // --- Restore the original guard logic ---
  const userStore = useUserStore()

  // 首次进入应用或刷新页面时，尝试获取用户信息（如果 token 存在）
  if (!userStore.userInfo && userStore.token) {
    // console.log('App init: Token exists, attempting to fetch user info...'); // Removed log
    await userStore.fetchUserInfo()
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  if (requiresAuth && !userStore.isAuthenticated) {
    // 需要认证但未登录
    // console.log( // Removed log
    //   `Route guard: Denied access to ${to.path} (requires auth, not authenticated). Redirecting to login.`,
    // )
    next({
      path: '/login',
      query: { redirect: to.fullPath }, // 保留重定向地址
    })
  } else if (requiresAdmin && !userStore.isAdmin) {
    // 需要管理员权限但当前用户不是管理员
    // console.log( // Removed log
    //   `Route guard: Denied access to ${to.path} (requires admin, user is not admin). Redirecting to dashboard.`,
    // )
    // 可以跳转到无权限页面或用户首页
    // **重要:** 确认 '/health-data' 是非管理员用户的目标默认页面，如果不是请修改
    next({ path: '/health-data' })
  } else {
    // 其他情况（不需要认证 或 已登录且权限足够）
    next()
  }
  // --- End of restored logic ---
})

router.afterEach(() => {
  // NProgress.done(); // Removed
})

export default router
