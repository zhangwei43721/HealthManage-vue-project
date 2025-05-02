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
    const res = response.data
    // 如果状态码不是20000，则认为请求出错
    if (res.code !== 20000) {
      console.error('接口返回错误:', res.message || '未知错误')

      // 处理登录过期情况
      if (res.code === 20003) {
        // 清除本地token并跳转到登录页
        localStorage.removeItem('token')
        localStorage.removeItem('tokenExpire')
        window.location.href = '/login'
      }

      return Promise.reject(new Error(res.message || '未知错误'))
    } else {
      return res
    }
  },
  (error) => {
    console.error('响应错误:', error)
    return Promise.reject(error)
  },
)

export default api
