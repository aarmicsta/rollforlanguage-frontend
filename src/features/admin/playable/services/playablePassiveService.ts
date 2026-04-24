/**
 * =========================================================
 * Playable Passive Service (Admin)
 * =========================================================
 *
 * This service provides all frontend API interactions related
 * to canonical playable passive definitions within the admin
 * portal.
 *
 * Scope of this file:
 * - Fetching playable passives for admin browse views
 * - Creating canonical playable passive definitions
 * - Updating canonical playable passive definitions
 *
 * Architectural Notes:
 * ---------------------------------------------------------
 * 1. Separation of Concerns
 *    This file ONLY handles canonical playable passive
 *    definition API calls.
 *
 *    It does NOT manage:
 *    - class passive assignments
 *    - species passive assignments
 *    - passive selector state
 *
 *    Assignment workflows are handled through class/species
 *    services because those relationships belong to junction
 *    tables, not the passive definition itself.
 *
 * 2. Canonical Passives vs Assignments
 *    Passives defined here represent reusable canonical traits,
 *    abilities, or effects that may later be assigned to
 *    playable classes and species.
 *
 *    Entity-specific passive assignment belongs in separate
 *    class/species assignment endpoints.
 *
 * 3. Response Shape
 *    The browse endpoint currently returns the passive array
 *    directly.
 *
 *    Mutation endpoints return:
 *      {
 *        message: string,
 *        data: PlayablePassive
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
 * PlayablePassive
 * ---------------------------------------------------------
 *
 * Frontend shape for a canonical playable passive definition
 * as returned by the admin passive endpoints.
 *
 * Notes:
 * - `id` is the stable canonical identifier used by the backend.
 * - `name` is the internal canonical name.
 * - `slug` is the URL-safe/public-facing identifier.
 * - `displayName` is the admin/player-facing label.
 * - `description` provides admin-facing context where present.
 * - `effectText` describes the passive's gameplay effect.
 * - `effectType` supports grouping/filtering in selector UIs.
 * - `sortOrder` controls display ordering where applicable.
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
 * ---------------------------------------------------------
 * CreatePlayablePassivePayload
 * ---------------------------------------------------------
 *
 * Payload used to create a canonical playable passive
 * definition.
 *
 * Notes:
 * - `name` and `slug` are canonical/internal identifiers.
 * - `displayName` is the admin/player-facing label.
 * - `description`, `effectText`, and `effectType` are optional
 *   because not every passive may need all descriptive fields.
 * - `isActive` is optional because the backend can apply its
 *   default active-state behavior.
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
 * ---------------------------------------------------------
 * UpdatePlayablePassivePayload
 * ---------------------------------------------------------
 *
 * Payload used to update an existing canonical playable
 * passive definition.
 *
 * Notes:
 * - `displayName` is required by the current edit flow.
 * - descriptive/effect fields may be updated when supplied.
 * - `isActive` and `sortOrder` may also be updated when
 *   supported by the calling UI.
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
 * getPlayablePassives
 * ---------------------------------------------------------
 *
 * Fetches the full browse list of playable passive definitions.
 *
 * Endpoint:
 * GET /admin/playable-passives
 *
 * Returns:
 * - an array of canonical playable passive definitions
 *
 * Typical usage:
 * - passive browse table
 * - passive selector reference loading
 * - refresh after passive creation/editing
 */
export async function getPlayablePassives(): Promise<PlayablePassive[]> {
  const response = await axiosInstance.get<PlayablePassive[]>(
    '/admin/playable-passives'
  )

  return response.data
}

/**
 * ---------------------------------------------------------
 * createPlayablePassive
 * ---------------------------------------------------------
 *
 * Creates a new canonical playable passive definition.
 *
 * Endpoint:
 * POST /admin/playable-passives
 *
 * Payload:
 * - displayName
 * - name
 * - slug
 * - description
 * - effectText
 * - effectType
 * - isActive
 *
 * Returns:
 * - the created passive record from `data`
 */
export async function createPlayablePassive(
  payload: CreatePlayablePassivePayload
): Promise<PlayablePassive> {
  const response = await axiosInstance.post<{
    message: string
    data: PlayablePassive
  }>('/admin/playable-passives', payload)

  return response.data.data
}

/**
 * ---------------------------------------------------------
 * updatePlayablePassive
 * ---------------------------------------------------------
 *
 * Updates an existing canonical playable passive definition.
 *
 * Endpoint:
 * PATCH /admin/playable-passives/:id
 *
 * Payload:
 * - displayName
 * - description
 * - effectText
 * - effectType
 * - isActive
 * - sortOrder
 *
 * Returns:
 * - the updated passive record from `data`
 */
export async function updatePlayablePassive(
  id: string,
  payload: UpdatePlayablePassivePayload
): Promise<PlayablePassive> {
  const response = await axiosInstance.patch<{
    message: string
    data: PlayablePassive
  }>(`/admin/playable-passives/${id}`, payload)

  return response.data.data
}

/**
 * ---------------------------------------------------------
 * playablePassiveService
 * ---------------------------------------------------------
 *
 * Convenience service export used by components/stores that
 * prefer object-style access over named imports.
 *
 * This keeps passive-related API calls grouped together in a
 * single namespace:
 *
 * playablePassiveService.getPlayablePassives()
 * playablePassiveService.createPlayablePassive(...)
 * playablePassiveService.updatePlayablePassive(...)
 *
 * Note:
 * Both named exports and the grouped service object are kept
 * available so the calling code can use whichever style fits
 * the surrounding pattern best.
 */
export const playablePassiveService = {
  getPlayablePassives,
  createPlayablePassive,
  updatePlayablePassive,
}