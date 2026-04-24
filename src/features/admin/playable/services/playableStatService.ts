/**
 * =========================================================
 * Playable Stat Service (Admin)
 * =========================================================
 *
 * This service provides all frontend API interactions related
 * to canonical playable stat definitions within the admin portal.
 *
 * Scope of this file:
 * - Fetching playable stats for admin browse views
 * - Creating canonical playable stat definitions
 * - Updating canonical playable stat definitions
 *
 * Architectural Notes:
 * ---------------------------------------------------------
 * 1. Separation of Concerns
 *    This file ONLY handles canonical playable stat definition
 *    API calls.
 *
 *    It does NOT manage:
 *    - class stat modifiers
 *    - species stat modifiers
 *    - playable stat baselines
 *    - creature stat values
 *
 * 2. Canonical Stats vs Assignments
 *    Stats defined here represent the global stat vocabulary
 *    for playable entities.
 *
 *    Entity-specific stat behavior belongs in separate systems,
 *    such as modifier or baseline services.
 *
 * 3. Response Shape
 *    The browse endpoint currently returns the stat array
 *    directly.
 *
 *    Mutation endpoints return:
 *      {
 *        message: string,
 *        data: PlayableStat
 *      }
 *
 *    This service preserves the current backend contract while
 *    exposing clean typed frontend functions.
 *
 * =========================================================
 */

import { axiosInstance } from '@/services/apiClient'

/**
 * ---------------------------------------------------------
 * PlayableStat
 * ---------------------------------------------------------
 *
 * Frontend shape for a canonical playable stat definition as
 * returned by the admin stat endpoints.
 *
 * Notes:
 * - `id` is the stable canonical identifier used by the backend.
 * - `name` is the internal canonical name.
 * - `slug` is the URL-safe/public-facing identifier.
 * - `displayName` is the admin/player-facing label.
 * - `description` may be nullable depending on stat definition.
 * - `sortOrder` controls display ordering where applicable.
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
 * ---------------------------------------------------------
 * CreatePlayableStatPayload
 * ---------------------------------------------------------
 *
 * Payload used to create a canonical playable stat definition.
 *
 * Notes:
 * - `name` and `slug` are canonical/internal identifiers.
 * - `displayName` is the admin/player-facing label.
 * - `description` is optional and may be nullable.
 * - `isActive` is optional because the backend can apply its
 *   default active-state behavior.
 */
export interface CreatePlayableStatPayload {
  displayName: string
  name: string
  slug: string
  description?: string | null
  isActive?: boolean
}

/**
 * ---------------------------------------------------------
 * UpdatePlayableStatPayload
 * ---------------------------------------------------------
 *
 * Payload used to update an existing canonical playable stat
 * definition.
 *
 * Notes:
 * - `displayName` is required by the current edit flow.
 * - `description`, `isActive`, and `sortOrder` may be updated
 *   when supplied.
 */
export interface UpdatePlayableStatPayload {
  displayName: string
  description?: string | null
  isActive?: boolean
  sortOrder?: number
}

/**
 * ---------------------------------------------------------
 * getPlayableStats
 * ---------------------------------------------------------
 *
 * Fetches the full browse list of playable stat definitions.
 *
 * Endpoint:
 * GET /admin/playable-stats
 *
 * Returns:
 * - an array of canonical playable stat definitions
 *
 * Typical usage:
 * - stat browse table
 * - stat selector reference loading
 * - refresh after stat creation/editing
 */
export async function getPlayableStats(): Promise<PlayableStat[]> {
  const response = await axiosInstance.get<PlayableStat[]>(
    '/admin/playable-stats'
  )

  return response.data
}

/**
 * ---------------------------------------------------------
 * createPlayableStat
 * ---------------------------------------------------------
 *
 * Creates a new canonical playable stat definition.
 *
 * Endpoint:
 * POST /admin/playable-stats
 *
 * Payload:
 * - displayName
 * - name
 * - slug
 * - description
 * - isActive
 *
 * Returns:
 * - the created stat record from `data`
 */
export async function createPlayableStat(
  payload: CreatePlayableStatPayload
): Promise<PlayableStat> {
  const response = await axiosInstance.post<{
    message: string
    data: PlayableStat
  }>('/admin/playable-stats', payload)

  return response.data.data
}

/**
 * ---------------------------------------------------------
 * updatePlayableStat
 * ---------------------------------------------------------
 *
 * Updates an existing canonical playable stat definition.
 *
 * Endpoint:
 * PATCH /admin/playable-stats/:id
 *
 * Payload:
 * - displayName
 * - description
 * - isActive
 * - sortOrder
 *
 * Returns:
 * - the updated stat record from `data`
 */
export async function updatePlayableStat(
  id: string,
  payload: UpdatePlayableStatPayload
): Promise<PlayableStat> {
  const response = await axiosInstance.patch<{
    message: string
    data: PlayableStat
  }>(`/admin/playable-stats/${id}`, payload)

  return response.data.data
}

/**
 * ---------------------------------------------------------
 * playableStatService
 * ---------------------------------------------------------
 *
 * Convenience service export used by components/stores that
 * prefer object-style access over named imports.
 *
 * This keeps stat-related API calls grouped together in a
 * single namespace:
 *
 * playableStatService.getPlayableStats()
 * playableStatService.createPlayableStat(...)
 * playableStatService.updatePlayableStat(...)
 *
 * Note:
 * Both named exports and the grouped service object are kept
 * available so the calling code can use whichever style fits
 * the surrounding pattern best.
 */
export const playableStatService = {
  getPlayableStats,
  createPlayableStat,
  updatePlayableStat,
}