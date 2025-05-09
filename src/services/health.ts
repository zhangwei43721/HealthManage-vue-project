import api from './api'
import type { Body } from '@/types/health' // Assuming types are defined here

// 获取用户的健康信息 (可能指最新的那条，与日志列表不同)
export const getUserBodyInfo = () => {
  return api.get('/user/getBodyInfo')
}

// 获取指定用户的历史健康数据日志 (旧接口，可能未使用)
export const getHistoricalData = (userId: number) => {
  return api.get(`/user/getBodyNotes/${userId}`)
}

// === 健康数据日志 (log.vue) 相关接口 ===

// 获取当前登录用户的体征记录列表 (分页)
export const getUserBodyList = (params: { pageNo: number; pageSize: number; name?: string }) => {
  // 注意：API文档显示此接口不需要name参数，搜索可能在前端完成或需要后端更新接口
  return api.get('/user/getUserBodyList', {
    params: { pageNo: params.pageNo, pageSize: params.pageSize },
  })
}

// 用户新增自己的体征记录
// 注意：API文档将 POST /user/BodyInformationNotes 描述为管理员接口，但DELETE/PUT存在用户接口，此处假设此POST也供用户使用
export const addBodyInformationNotes = (data: Partial<Body>) => {
  return api.post('/user/BodyInformationNotes', data)
}

// 用户修改自己的指定体征记录
export const updateUserBody = (data: Partial<Body>) => {
  // 需要确保 data 中包含 notesid
  return api.put('/user/updateUserBody', data)
}

// 用户删除自己的指定体征记录
export const deleteUserBodyById = (notesid: number) => {
  return api.delete(`/user/deleteUserBodyById/${notesid}`)
}

// === END 健康数据日志相关接口 ===

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

// 导出 default 以便兼容之前的 import 方式？ 或者确保所有地方都用命名导入
// export default {
//   getUserBodyInfo,
//   getHistoricalData,
//   getUserBodyList,
//   addBodyInformationNotes,
//   updateUserBody,
//   deleteUserBodyById,
//   getAllSportInfo,
//   getSportList,
//   getSportById,
//   getDetailInfoByName,
//   getDetailList,
//   getDetailById
// }
