// Define Menu type
export interface Menu {
  menuId: number
  component?: string
  path?: string
  redirect?: string
  name?: string
  title: string // Essential for tree label and breadcrumbs
  icon?: string
  parentId?: number
  isLeaf?: string // 'Y' or 'N'
  hidden?: boolean
  children?: Menu[] // Use Menu for children
  meta?: {
    // For router meta field
    title?: string
    icon?: string
    requiresAuth?: boolean
    requiresAdmin?: boolean
    [key: string]: any
  }
}

// Define TreeNode type extending Menu for tree structures if needed elsewhere
// export interface TreeNode extends Menu {
//     children?: TreeNode[];
// }
