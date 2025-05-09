// eslint-disable no-constant-binary-expression
import axios from 'axios'
import { useUserStore } from '@/stores/user'

// 创建axios实例
const api = axios.create({
  baseURL: 'http://127.0.0.1:9401', // 后端API地址
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers['X-Token'] = token
    }
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const res = response.data

    // 检查 res 是否是对象并且包含 code 属性
    if (typeof res === 'object' && res !== null && 'code' in res) {
      if (res.code !== 20000) {
        console.error(
          'API Business Error:',
          res.message || '未知错误',
          '| Code:',
          res.code,
          '| Path:',
          response.config.url
        )

        if (res.code === 20003) {
          console.warn('Token expired or invalid. Handling logout.')
          localStorage.removeItem('token')
          return Promise.reject(new Error(res.message || 'Token invalid or expired'))
        }
        return Promise.reject(new Error(res.message || `Error Code: ${res.code}`))
      } else {
        return res.data || res
      }
    } else {
      return res
    }
  },
  (error) => {
    console.error('Network/HTTP Error:', error.response?.data || error.message || error)
    return Promise.reject(error)
  },
)

export default api
