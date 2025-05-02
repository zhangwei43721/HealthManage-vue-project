import api from './api'

// 获取用户的健康信息
export const getUserInfo = () => {
  return api.get('/user/getBodyInfo')
}

// 获取用户的历史健康数据
export const getHistoricalData = (userId: number) => {
  return api.get(`/user/getBodyNotes/${userId}`)
}
