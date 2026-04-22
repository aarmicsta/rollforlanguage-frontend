// src/features/admin/content/services/creatureService.ts

/**
 * Creature service (admin).
 *
 * Responsibilities:
 * - fetch creature data from backend admin endpoints
 *
 * Notes:
 * - mirrors existing admin service patterns (e.g. playableSpeciesService)
 * - keeps logic thin: no transformation beyond basic typing
 * - assumes backend returns hydrated display fields
 */

import { axiosInstance } from '@/services/apiClient'

/**
 * ---------------------------------------------------------
 * Types
 * ---------------------------------------------------------
 */

export interface CreatureListItem {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null

  creatureType: string
  sizeCategory: string
  intelligenceCategory: string | null
  threatLevel: string | null

  iconMediaAssetId: string | null
  isActive: boolean | null
  sortOrder: number | null
  createdAt: string | null
  updatedAt: string | null
}

/**
 * ---------------------------------------------------------
 * API Calls
 * ---------------------------------------------------------
 */

/**
 * Fetch all creatures for admin browse table.
 */
export async function getCreatures(): Promise<CreatureListItem[]> {
  const response = await axiosInstance.get('/admin/creatures')

  return response.data.data
}

/**
 * Update a creature (admin).
 */
export async function updateCreature(
  id: string,
  data: {
    displayName: string
    description: string | null
    isActive: boolean
  }
): Promise<CreatureListItem | null> {
  const response = await axiosInstance.patch(`/admin/creatures/${id}`, data)

  return response.data.data
}