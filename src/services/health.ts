import api from './api'

// 获取用户的健康信息
export const getUserInfo = () => {
  return api.get('/user/getBodyInfo')
}

// 获取用户的历史健康数据
export const getHistoricalData = (userId: number) => {
  return api.get(`/user/getBodyNotes/${userId}`)
}

// 获取所有运动知识（分页）
export const getAllSportInfo = (pageNo: number, pageSize: number) => {
  return api.get('/sport/getAllSportInfo', {
    params: { pageNo, pageSize },
  })
}

// 根据运动类型获取运动知识（分页）
export const getSportList = (sportType: string | null, pageNo: number, pageSize: number) => {
  return api.get('/sport/getSportList', {
    params: { sportType, pageNo, pageSize },
  })
}

// 根据ID获取运动知识
export const getSportById = (id: number) => {
  return api.get(`/sport/${id}`)
}

// 根据运动名称获取运动详情
export const getDetailInfoByName = (sportName: string) => {
  return api.get(`/detail/DetailInfo/${sportName}`)
}

// 获取运动详情列表（分页）
export const getDetailList = (sportType: string | null, pageNo: number, pageSize: number) => {
  return api.get('/detail/getDetailList', {
    params: { sportType, pageNo, pageSize },
  })
}

// 根据ID获取运动详情
export const getDetailById = (id: number) => {
  return api.get(`/detail/getDetailById/${id}`)
}
