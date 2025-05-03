import api from './api'
import type { Role } from '@/types/role' // Assuming types exist

// Define a type for list parameters
interface RoleListParams {
  roleName?: string
  pageNo: number
  pageSize: number
}

// Define a type for the list response
interface RoleListResponse {
  total: number
  rows: Role[]
}

export default {
  getRoleList(params: RoleListParams) {
    return api.get<RoleListResponse>('/role/list', { params })
  },
  addRole(data: Omit<Role, 'roleId'>) {
    // Exclude roleId for adding
    return api.post<any>('/role', data)
  },
  updateRole(data: Role) {
    // Require roleId for updating
    return api.put<any>('/role', data)
  },
  getRoleById(id: number) {
    return api.get<Role>(`/role/${id}`)
  },
  deleteRole(id: number) {
    return api.delete<any>(`/role/${id}`)
  },
  getAllRoles() {
    // Assuming the response data is directly List<Role>
    return api.get<Role[]>('/role/all')
  },
}

// Define Role type if not already defined in @/types/role
/*
export interface Role {
  roleId: number;
  roleName: string;
  roleDesc: string;
  menuIdList: number[]; // Assuming this is part of the role object from API
}
*/
