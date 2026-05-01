// src/features/admin/content/services/factionService.ts

/**
 * Faction service (admin).
 *
 * Responsibilities:
 * - fetch faction data from backend admin endpoints
 *
 * Notes:
 * - mirrors the itemService pattern
 * - assumes backend returns hydrated display fields
 */

import { axiosInstance } from '@/services/apiClient'
import type {
  AlignmentOption,
  FactionListItem,
} from '@/features/admin/content/types/contentTypes'

/**
 * ---------------------------------------------------------
 * Faction Browse
 * ---------------------------------------------------------
 */

/**
 * Fetch all factions for admin browse table.
 */
export async function getFactions(): Promise<FactionListItem[]> {
  const response = await axiosInstance.get('/admin/factions')

  return response.data.data
}

/**
 * ---------------------------------------------------------
 * Update Faction
 * ---------------------------------------------------------
 */
export async function updateFaction(
  id: string,
  payload: {
    displayName: string
    description: string | null
    alignmentId: string | null
    isActive: boolean
  }
) {
  const response = await axiosInstance.patch(
    `/admin/factions/${id}`,
    payload
  )

  return response.data.data
}

/**
 * ---------------------------------------------------------
 * Alignment Options
 * ---------------------------------------------------------
 */
export async function getAlignments(): Promise<AlignmentOption[]> {
  const response = await axiosInstance.get('/admin/alignments')
  return response.data.data
}