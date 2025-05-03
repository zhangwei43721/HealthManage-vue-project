import api from './api'
import type { Menu } from '@/types/menu' // Assuming types exist

export default {
  getAllMenus() {
    // Assuming the API returns the menu tree directly in the data field
    return api.get<Menu[]>('/menu')
  },
}
