// src/features/admin/services/playablePassiveService.ts

/**
 * Playable Passive Admin Service
 *
 * Responsibilities:
 * - interact with backend playable passive admin endpoints
 * - provide typed API calls for passive creation, retrieval, and updates
 *
 * Notes:
 * - operates on canonical passive definitions (`playable_passives`)
 * - does NOT manage assignment relationships
 * - aligned with backend response pattern (`{ message, data }` for mutations)
 */

import { axiosInstance } from '@/services/apiClient'

/**
 * Canonical playable passive definition.
 */
export interface PlayablePassive {
  id: string
  name: string
  slug: string
  displayName: string
  description?: string | null
  effectText?: string | null
  effectType?: string | null
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

/**
 * Payload for creating a new passive.
 */
export interface CreatePlayablePassivePayload {
  displayName: string
  name: string
  slug: string
  description?: string | null
  effectText?: string | null
  effectType?: string | null
  isActive?: boolean
}

/**
 * Payload for updating an existing passive.
 */
export interface UpdatePlayablePassivePayload {
  displayName: string
  description?: string | null
  effectText?: string | null
  effectType?: string | null
  isActive?: boolean
  sortOrder?: number
}

/**
 * ---------------------------------------------------------
 * GET: Fetch all playable passives
 * ---------------------------------------------------------
 */
export async function getPlayablePassives(): Promise<PlayablePassive[]> {
  const response = await axiosInstance.get('/admin/playable-passives')
  return response.data
}

/**
 * ---------------------------------------------------------
 * POST: Create a new playable passive
 * ---------------------------------------------------------
 */
export async function createPlayablePassive(
  payload: CreatePlayablePassivePayload
): Promise<PlayablePassive> {
  const response = await axiosInstance.post(
    '/admin/playable-passives',
    payload
  )
  return response.data.data
}

/**
 * ---------------------------------------------------------
 * PATCH: Update a playable passive
 * ---------------------------------------------------------
 */
export async function updatePlayablePassive(
  id: string,
  payload: UpdatePlayablePassivePayload
): Promise<PlayablePassive> {
  const response = await axiosInstance.patch(
    `/admin/playable-passives/${id}`,
    payload
  )
  return response.data.data
}