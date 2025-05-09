import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api' // 假设你的axios实例封装在 @/services/api
// 定义用户信息接口
interface UserInfo {
  id?: string
  name: string
  email?: string
  roles: string[]
  avatar?: string
  menuList?: any[]
  // 其他用户信息字段
}
import {
  isAuthenticated as checkAuth,
  clearAuth as clearLocalAuth,
  setAuth as setLocalAuth,
} from '@/utils/auth' // 假设你有 auth 工具函数

// 定义登录响应接口
interface LoginResponse {
  token: string
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const userInfo = ref<UserInfo | null>(null)
  const roles = ref<string[]>([])

  const isAuthenticated = computed(() => !!token.value && checkAuth())
  const isAdmin = computed(() => roles.value.includes('admin')) // 判断是否包含 admin 角色

  // 设置 Token
  function setToken(newToken: string) {
    token.value = newToken
    setLocalAuth(newToken) // 同时更新 localStorage
  }

  // 获取用户信息
  async function fetchUserInfo() {
    if (!isAuthenticated.value) {
      resetState()
      return null
    }
    try {
      const userDataPayload = await api.get<UserInfo>('/user/info')

      // 检查核心字段是否存在且类型正确
      if (
        userDataPayload &&
        typeof userDataPayload.name === 'string' &&
        Array.isArray(userDataPayload.roles)
      ) {
        userInfo.value = {
          id: userDataPayload.id,
          name: userDataPayload.name,
          email: userDataPayload.email,
          roles: userDataPayload.roles,
          avatar: userDataPayload.avatar,
          menuList: userDataPayload.menuList,
        }
        roles.value = userDataPayload.roles

        return userInfo.value
      } else {
        console.error('Invalid user info response structure or missing required fields (name, roles):', userDataPayload)
        resetState()
        return null
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error)
      resetState()
      return null
    }
  }

  // 登录
  async function login(credentials: { username: string; password: string }) {
    try {
      // api.post 返回的已经是拦截器处理过的响应体
      // 对于登录接口，它直接是 { token: "..." }
      const loginResponsePayload = await api.post<LoginResponse>('/user/login', credentials)

      // 直接从 loginResponsePayload 中获取 token
      if (loginResponsePayload && typeof loginResponsePayload.token === 'string') {
        setToken(loginResponsePayload.token)
        await fetchUserInfo() // 登录成功后立即获取用户信息
        return true
      } else {
        // 如果 loginResponsePayload 不是预期的 {token: "..."} 结构
        console.error('Login failed: Token not found in response payload or payload is invalid', loginResponsePayload)
        return false
      }
    } catch (error) {
      // api.post 本身 reject 的错误 (网络错误，或拦截器中 reject 的业务错误)
      console.error('Login request failed:', error)
      return false
    }
  }

  // 登出
  async function logout() {
    try {
      // 可选：调用后端登出接口
      if (token.value) {
        await api.post('/user/logout')
      }
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // 总是清除本地状态和存储
      resetState()
    }
  }

  // 重置状态
  function resetState() {
    token.value = null
    userInfo.value = null
    roles.value = []
    clearLocalAuth() // 清除 localStorage
  }

  return {
    token,
    userInfo,
    roles,
    isAuthenticated,
    isAdmin,
    setToken,
    fetchUserInfo,
    login,
    logout,
    resetState,
  }
})

// 建议创建类型定义文件 src/types/user.ts
/*
export interface UserInfo {
  id: number;
  username: string;
  name: string;
  email?: string;
  phone?: string;
  status?: number;
  avatar?: string;
  roles: string[];
  // 其他可能的字段
}
*/

// 建议创建 auth 工具函数 src/utils/auth.ts
/*
const TOKEN_KEY = 'token';
const TOKEN_EXPIRE_KEY = 'tokenExpire';
const DEFAULT_EXPIRE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expireTime = localStorage.getItem(TOKEN_EXPIRE_KEY);

  if (!token || !expireTime) {
    return false;
  }

  const now = new Date().getTime();
  return now < parseInt(expireTime);
};

export const getToken = (): string | null => {
  if (isAuthenticated()) {
    return localStorage.getItem(TOKEN_KEY);
  }
  clearAuth(); // 如果过期或无效，清除
  return null;
};

export const setAuth = (token: string): void => {
  const expireTime = new Date().getTime() + DEFAULT_EXPIRE_DURATION;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRE_KEY, expireTime.toString());
};

export const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRE_KEY);
};
*/
