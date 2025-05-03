// Define Role type
export interface Role {
  roleId: number
  roleName: string
  roleDesc: string
  menuIdList: number[] // List of menu IDs this role has access to
}
