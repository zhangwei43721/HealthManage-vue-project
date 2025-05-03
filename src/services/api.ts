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

    // 检查响应代码是否表示成功
    if (res.code !== 20000) {
      // 非成功状态处理
      console.error(
        'API Error:',
        res.message || '未知错误',
        '| Code:',
        res.code,
        '| Path:',
        response.config.url,
      )

      // 处理特定的错误代码，例如Token过期
      if (res.code === 20003) {
        // 在这里触发用户登出逻辑，例如通过 Pinia store
        // import { useUserStore } from '@/stores/user';
        // const userStore = useUserStore();
        // userStore.logout();
        console.warn('Token expired or invalid. Redirecting to login.')
        // 可以选择直接跳转或通过 store action 处理
        // window.location.href = '/login';
        // 为了更好的用户体验，最好是触发 store action
        const userStore = useUserStore() // Ensure pinia is initialized before this runs
        userStore.resetState() // Reset state and clear token
        // Optionally push router to login page if router is accessible here
        // import router from '@/router';
        // router.push('/login');
      }

      // 使用Element Plus等UI库显示错误消息 (示例)
      /*
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      */

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      // 成功状态 (code === 20000)
      // console.log('标准成功响应 (code=20000)，返回整个响应对象:', res); // Removed this log
      // 只返回 data 部分，或者根据需要返回整个 res
      return res // Revert: Return the full response object (res = response.data)
    }
  },
  (error) => {
    // 处理网络错误等
    console.error('Network/Request Error:', error.message || error)
    // 使用Element Plus等UI库显示错误消息 (示例)
    /*
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    */
    return Promise.reject(error)
  },
)

export default api
