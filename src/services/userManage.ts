import api from './api'

// 定义用户类型
export interface User {
  id: number
  username: string
  password?: string // 密码可能不总是存在或需要
  email?: string
  phone?: string
  status?: number
  avatar?: string
  deleted?: number
  roleIdList?: number[] // 可能需要用于添加/更新请求
}

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
    // 假设成功时返回创建的 User
    return api.post<User>('/user/add', data)
  },
  updateUser(data: User) {
    // Require id for updating
    // 假设成功时返回更新的 User
    return api.put<User>('/user/update', data)
  },
  getUserById(id: number) {
    return api.get<User>(`/user/${id}`)
  },
  deleteUser(id: number) {
    // 假设成功时没有特定的返回数据
    return api.delete<void>(`/user/${id}`)
  },
  changePassword(data: { id: number; newPassword: string }) {
    // Assuming the backend expects this specific shape for password change
    // 假设成功时没有特定的返回数据
    return api.put<void>('/user/changePassword', data)
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
