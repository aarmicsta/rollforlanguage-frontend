/**
 * Playable Stat Admin Service
 *
 * Responsibilities:
 * - interact with backend playable stat admin endpoints
 * - provide typed API calls for stat creation, retrieval, and updates
 *
 * Notes:
 * - operates on canonical stat definitions (`ref_playable_stats`)
 * - does NOT manage baselines or modifiers
 * - aligned with backend response pattern (`{ message, data }` for mutations)
 */

import { axiosInstance } from '@/services/axiosInstance'

/**
 * Canonical playable stat definition.
 */
export interface PlayableStat {
  id: string
  name: string
  slug: string
  displayName: string
  description?: string | null
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

/**
 * Payload for creating a new stat.
 */
export interface CreatePlayableStatPayload {
  displayName: string
  name: string
  slug: string
  description?: string | null
  isActive?: boolean
}

/**
 * Payload for updating an existing stat.
 */
export interface UpdatePlayableStatPayload {
  displayName: string
  description?: string | null
  isActive?: boolean
  sortOrder?: number
}

/**
 * ---------------------------------------------------------
 * GET: Fetch all playable stats
 * ---------------------------------------------------------
 *
 * Returns:
 * - list of canonical stat definitions
 */
export async function getPlayableStats(): Promise<PlayableStat[]> {
  const response = await axiosInstance.get('/admin/playable-stats')
  return response.data
}

/**
 * ---------------------------------------------------------
 * POST: Create a new playable stat
 * ---------------------------------------------------------
 *
 * Returns:
 * - newly created stat (from `response.data.data`)
 */
export async function createPlayableStat(
  payload: CreatePlayableStatPayload
): Promise<PlayableStat> {
  const response = await axiosInstance.post('/admin/playable-stats', payload)
  return response.data.data
}

/**
 * ---------------------------------------------------------
 * PATCH: Update a playable stat
 * ---------------------------------------------------------
 *
 * Returns:
 * - updated stat (from `response.data.data`)
 */
export async function updatePlayableStat(
  id: string,
  payload: UpdatePlayableStatPayload
): Promise<PlayableStat> {
  const response = await axiosInstance.patch(
    `/admin/playable-stats/${id}`,
    payload
  )
  return response.data.data
}