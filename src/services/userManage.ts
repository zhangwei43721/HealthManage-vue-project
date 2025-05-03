import api from './api'
import type { User } from '@/types/user' // Assuming types exist

// Define a type for list parameters
interface UserListParams {
  username?: string
  phone?: string
  pageNo: number
  pageSize: number
}

// Define a type for the list response (adjust User type as needed)
interface UserListResponse {
  total: number
  rows: User[]
}

export default {
  getUserList(params: UserListParams) {
    // Ensure the actual response structure matches UserListResponse
    return api.get<UserListResponse>('/user/list', { params })
  },
  addUser(data: Omit<User, 'id'>) {
    // Exclude id for adding
    // Ensure response type matches expected success/error message structure
    return api.post<any>('/user/add', data)
  },
  updateUser(data: User) {
    // Require id for updating
    return api.put<any>('/user/update', data)
  },
  getUserById(id: number) {
    return api.get<User>(`/user/${id}`)
  },
  deleteUser(id: number) {
    return api.delete<any>(`/user/${id}`)
  },
  changePassword(data: { id: number; newPassword: string }) {
    // Assuming the backend expects this specific shape for password change
    return api.put<any>('/user/changePassword', data)
  },
}

// Define User type if not already defined in @/types/user
/*
export interface User {
  id: number;
  username: string;
  password?: string; // Password might not always be present or needed
  email?: string;
  phone?: string;
  status?: number;
  avatar?: string;
  deleted?: number;
  roleIdList?: number[]; // May be needed for add/update requests
}
*/
