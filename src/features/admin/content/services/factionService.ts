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
import type { FactionListItem } from '@/features/admin/content/types/contentTypes'

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