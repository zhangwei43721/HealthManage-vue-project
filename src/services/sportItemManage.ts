import api from './api'

// 定义SportDetail接口，因为无法导入@/types/health
interface SportDetail {
  id: number
  sportType: string
  disease: string
  method: string
  notes: string
}

interface ListParams {
  sportType?: string
  pageNo: number
  pageSize: number
}

interface ListResponse {
  total: number
  rows: SportDetail[]
}

export default {
  getDetailList(params: ListParams) {
    return api.get<ListResponse>('/detail/getDetailList', { params })
  },
  addDetail(data: Omit<SportDetail, 'id'>) {
    return api.post<SportDetail>('/detail/addDetail', data)
  },
  updateDetail(data: SportDetail) {
    return api.put<SportDetail>('/detail/updateDetail', data)
  },
  getDetailById(id: number) {
    return api.get<SportDetail>(`/detail/getDetailById/${id}`)
  },
  deleteDetail(id: number) {
    return api.delete<void>(`/detail/deleteDetailById/${id}`)
  },
  // getDetailInfoByName might be needed if there's a use case for it
  // getDetailInfoByName(sportName: string) {
  //   // Note: API doc says this returns the first item in a list
  //   return api.get<SportDetail>(`/detail/DetailInfo/${sportName}`);
  // },
}

// Define SportDetail type if not already defined in @/types/health
/*
export interface SportDetail {
  id: number;
  sportType: string; // Relates to SportInfo
  disease: string;
  method: string;
  notes: string;
}
*/
