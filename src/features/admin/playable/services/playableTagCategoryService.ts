import { axiosInstance } from '@/services/apiClient'

export interface TagCategory {
  id: string
  name: string
  displayName?: string
  description?: string
  colorHex: string
  sortOrder?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// 🔍 GET all tag categories
export async function getAllTagCategories(): Promise<TagCategory[]> {
  const response = await axiosInstance.get('/admin/playable-tag-categories')
  return response.data
}
