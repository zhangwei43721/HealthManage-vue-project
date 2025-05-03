import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api' // 假设你的axios实例封装在 @/services/api
import type { UserInfo } from '@/types/user' // 假设你有一个类型定义文件
import {
  isAuthenticated as checkAuth,
  clearAuth as clearLocalAuth,
  setAuth as setLocalAuth,
} from '@/utils/auth' // 假设你有 auth 工具函数

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
      const response = await api.get<any>('/user/info') // API 返回结构根据后端调整
      if (response && response.data) {
        const userData = response.data // 直接取 data 部分
        userInfo.value = userData // 存储整个用户信息对象
        roles.value = userData.roles || [] // 存储角色列表
        return userData
      } else {
        console.error('Invalid user info response structure:', response)
        resetState()
        return null
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error)
      resetState() // 获取失败时重置状态并清除 token
      return null
    }
  }

  // 登录
  async function login(credentials: { username: string; password: string }) {
    try {
      const response = await api.post<any>('/user/login', credentials)
      if (response && response.data && response.data.token) {
        setToken(response.data.token)
        await fetchUserInfo() // 登录成功后立即获取用户信息
        return true
      } else {
        console.error('Login failed: Token not found in response', response)
        return false
      }
    } catch (error) {
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
