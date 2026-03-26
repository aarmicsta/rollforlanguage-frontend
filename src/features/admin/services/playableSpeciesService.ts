import { axiosInstance } from '@/services/axiosInstance'

export interface PlayableSpecies {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null
  iconMediaAssetId: string | null
  isActive: boolean | null
  sortOrder: number | null
  createdAt: string | null
  updatedAt: string | null
}

export async function getPlayableSpecies(): Promise<PlayableSpecies[]> {
  const response = await axiosInstance.get<PlayableSpecies[]>('/admin/playable-species')
  return response.data
}

export async function updatePlayableSpecies(
  id: string,
  payload: { 
    displayName: string
    description: string | null
  }
): Promise<{
  message: string
  data: PlayableSpecies | null
}> {
  const response = await axiosInstance.patch(
    `/admin/playable-species/${id}`,
    payload
  )

  return response.data
}

export const playableSpeciesService = {
  getPlayableSpecies,
  updatePlayableSpecies,
}