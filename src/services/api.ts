// eslint-disable no-constant-binary-expression
import axios from 'axios'

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
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
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
    // 检查 HTTP 状态码是否成功 (2xx)
    if (response.status >= 200 && response.status < 300) {
      const res = response.data

      // 检查返回的数据是否包含 code 属性 (标准后端格式)
      if (res && typeof res === 'object' && res.hasOwnProperty('code')) {
        // 如果状态码不是20000，则认为请求出错
        if (res.code !== 20000) {
          console.error('接口返回逻辑错误:', res.message || '未知错误', 'Code:', res.code)

          // 处理登录过期情况
          if (res.code === 20003) {
            localStorage.removeItem('token')
            localStorage.removeItem('tokenExpire')
            // Consider using router push for better SPA navigation if router is available here
            window.location.href = '/login'
          }

          return Promise.reject(new Error(res.message || '未知错误'))
        } else {
          // code 为 20000，返回整个 res 对象以兼容其他页面
          console.log('标准成功响应 (code=20000)，返回整个响应对象:', res)
          return res
        }
      } else {
        // 如果返回的数据没有 code 属性 (例如 /viewHistory 直接返回数组)
        // 并且 HTTP 状态码是成功的，直接返回数据 (即 res)
        console.log('非标准成功响应 (无 code 字段)，直接返回数据:', res)
        return res // 返回原始的 response.data
      }
    } else {
      // 处理非 2xx 的 HTTP 错误状态码
      console.error('HTTP 错误:', response.status, response.statusText)
      return Promise.reject(
        new Error(`HTTP 错误: ${response.status} ${response.statusText}` || '网络请求失败'),
      )
    }
  },
  (error) => {
    console.error('响应错误:', error)
    // 可以根据 error.response?.status 进一步处理网络错误
    return Promise.reject(error)
  },
)

export default api
