// src/features/admin/services/playableSpeciesService.ts

import { axiosInstance } from '@/services/axiosInstance'
import type { PlayableSpeciesBrowseItem } from '@/features/admin/types/playableTypes'

export async function getPlayableSpecies(): Promise<PlayableSpeciesBrowseItem[]> {
  const response = await axiosInstance.get<PlayableSpeciesBrowseItem[]>('/admin/playable-species')
  return response.data
}

export const playableSpeciesService = {
  getPlayableSpecies,
}