import api from './api'

// 用户接口定义
export interface User {
  id?: number
  username: string
  password?: string
  email?: string
  phone?: string
  status?: number
  avatar?: string
  roleIdList?: number[]
}

// 登录接口
export const login = (username: string, password: string) => {
  return api.post('/user/login', { username, password }).then((response) => {
    // 存储token到localStorage
    const { token } = response.data
    if (token) {
      // 设置token过期时间为12小时
      const expireTime = new Date().getTime() + 12 * 60 * 60 * 1000
      localStorage.setItem('token', token)
      localStorage.setItem('tokenExpire', expireTime.toString())
    }
    return response
  })
}

// 注册接口
export const register = (userData: User) => {
  return api.post('/user/register', userData)
}

// 登出接口
export const logout = () => {
  return api.post('/user/logout').finally(() => {
    // 无论成功失败都清除token
    localStorage.removeItem('token')
    localStorage.removeItem('tokenExpire')
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return api.get('/user/info')
}

// 检查token是否有效
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token')
  const expireTime = localStorage.getItem('tokenExpire')

  if (!token || !expireTime) {
    return false
  }

  // 检查token是否已过期
  const now = new Date().getTime()
  return now < parseInt(expireTime)
}

// 获取当前token
export const getToken = (): string | null => {
  if (isAuthenticated()) {
    return localStorage.getItem('token')
  }
  return null
}

// 清除认证信息
export const clearAuth = (): void => {
  localStorage.removeItem('token')
  localStorage.removeItem('tokenExpire')
}
