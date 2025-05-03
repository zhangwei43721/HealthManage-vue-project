import api from './api'
import type { Menu } from '@/types/menu' // Assuming types exist

export default {
  getAllMenus() {
    // Assuming the API returns the menu tree directly in the data field
    return api.get<Menu[]>('/menu')
  },
}

// Define Menu type if not already defined in @/types/menu
/*
export interface Menu {
  menuId: number;
  component?: string;
  path?: string;
  redirect?: string;
  name?: string;
  title: string; // Assuming title is always present for the tree label
  icon?: string;
  parentId?: number;
  isLeaf?: string;
  hidden?: boolean;
  children?: Menu[];
  meta?: { // Adjust meta structure based on actual use
    title?: string;
    icon?: string;
    [key: string]: any;
  };
}
*/
