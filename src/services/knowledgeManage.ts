import api from './api'

// 定义SportInfo接口，因为无法导入@/types/health
interface SportInfo {
  id: number
  sportType: string
  suitableTime: string
  suitableHeartRate: string
  suitableFrequency: string
  recommendedSpeed: string
}

interface ListParams {
  sportType?: string
  pageNo: number
  pageSize: number
}

interface ListResponse {
  total: number
  rows: SportInfo[]
}

export default {
  getSportList(params: ListParams) {
    return api.get<ListResponse>('/sport/getSportList', { params })
  },
  addSportInfo(data: Omit<SportInfo, 'id'>) {
    return api.post<SportInfo>('/sport/add', data)
  },
  updateSportInfo(data: SportInfo) {
    return api.put<SportInfo>('/sport/update', data)
  },
  getSportInfoById(id: number) {
    return api.get<SportInfo>(`/sport/${id}`)
  },
  deleteSportInfo(id: number) {
    return api.delete<void>(`/sport/${id}`)
  },
}