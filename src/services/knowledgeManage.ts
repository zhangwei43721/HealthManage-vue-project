import api from './api'
import type { SportInfo } from '@/types/health' // Assuming types exist

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
    return api.post<any>('/sport/add', data)
  },
  updateSportInfo(data: SportInfo) {
    return api.put<any>('/sport/update', data)
  },
  getSportInfoById(id: number) {
    return api.get<SportInfo>(`/sport/${id}`)
  },
  deleteSportInfo(id: number) {
    return api.delete<any>(`/sport/${id}`)
  },
  // getAllSportInfo might be needed if there's a use case for it
  // getAllSportInfo(params: { pageNo: number, pageSize: number }) {
  //   return api.get<ListResponse>('/sport/getAllSportInfo', { params });
  // },
}

// Define SportInfo type if not already defined in @/types/health
/*
export interface SportInfo {
  id: number;
  sportType: string;
  suitableTime: string;
  suitableHeartRate: string;
  suitableFrequency: string;
  recommendedSpeed: string;
}
*/
