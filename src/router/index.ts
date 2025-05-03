import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user' // 导入 user store

// --- Layouts ---
import AdminLayout from '@/layouts/AdminLayout.vue' // Import Admin Layout
// Assume main layout is implicitly handled by App.vue or another mechanism

// --- Page Components ---
import AiHomePage from '../views/health/AiHomePage.vue'
import Login from '../views/login/index.vue'
import Register from '../views/register/register.vue'
import HealthData from '../views/health/health-data.vue'
import HealthKnowledge from '../views/health-knowledge.vue'
import HealthLog from '../views/health/health-log.vue'
import AiQaPage from '../views/health/ai-qa.vue'
import SysIndex from '../views/sys/SysIndex.vue' // Import Admin Index page
import Profile from '../views/profile/index.vue' // 导入个人中心页面
// Admin page components (lazy loaded)
const UserManagement = () => import('@/views/sys/user.vue')
const RoleManagement = () => import('@/views/sys/role.vue')
const KnowledgeManage = () => import('@/views/sys/knowledge-manage.vue')
const SportItemManage = () => import('@/views/sys/sport-item-manage.vue')
const UserHealthManage = () => import('@/views/sys/user-health-manage.vue')

// Temporary components for Features and About
const Features = { template: '<div>Features Page (Requires Auth)</div>' }
const About = { template: '<div>About Page (Requires Auth)</div>' }

// 路由配置
const routes = [
  // --- Main Application Routes (using default layout in App.vue) ---
  {
    path: '/',
    component: AiHomePage,
    meta: { requiresAuth: false }, // 首页通常不需要登录
  },
  {
    path: '/features',
    component: Features,
    meta: { requiresAuth: true, title: '功能介绍' }, // 需要登录
  },
  {
    path: '/about',
    component: About,
    meta: { requiresAuth: true, title: '关于我们' }, // 需要登录
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
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true, title: '个人中心' },
  },
  // --- Authentication Routes ---
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false },
  },
  // --- Admin Section Routes (using AdminLayout) ---
  {
    path: '/sys',
    component: AdminLayout, // Use the admin layout for all /sys routes
    meta: { requiresAuth: true, requiresAdmin: true }, // All admin routes require auth and admin role
    children: [
      {
        path: '', // Default route for /sys
        name: 'AdminIndex',
        component: SysIndex,
        meta: { title: '管理后台首页' },
      },
      {
        path: 'user',
        name: 'UserManagement',
        component: UserManagement,
        meta: { title: '用户管理' },
      },
      {
        path: 'role',
        name: 'RoleManagement',
        component: RoleManagement,
        meta: { title: '角色管理' },
      },
      {
        path: 'knowledge-manage',
        name: 'KnowledgeManage',
        component: KnowledgeManage,
        meta: { title: '知识管理' },
      },
      {
        path: 'sport-item-manage',
        name: 'SportItemManage',
        component: SportItemManage,
        meta: { title: '运动项管理' },
      },
      {
        path: 'user-health-manage',
        name: 'UserHealthManage',
        component: UserHealthManage,
        meta: { title: '用户健康数据' },
      },
      // Add other sys routes here
    ],
  },
  // --- Catch-all Route ---
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
