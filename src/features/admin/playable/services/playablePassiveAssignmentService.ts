// src/features/admin/services/playablePassiveAssignmentService.ts

/**
 * Playable Passive Assignment Admin Service
 *
 * Responsibilities:
 * - interact with backend playable passive assignment admin endpoints
 * - provide typed API calls for assignment retrieval, creation, and deletion
 *
 * Notes:
 * - operates on passive assignment relationships, not canonical passive definitions
 * - covers:
 *   - playable_species_passives
 *   - playable_class_passives
 * - aligned with backend response pattern (`{ message, data }` for mutations)
 */

import { axiosInstance } from '@/services/apiClient'

export interface PlayablePassiveAssignmentRow {
  context: 'species' | 'class'
  targetId: string
  targetDisplayName: string
  passiveId: string
  passiveDisplayName: string
  passiveDescription?: string | null
  passiveEffectText?: string | null
  passiveEffectType?: string | null
  createdAt?: string | null
}

export interface CreatePlayableSpeciesPassiveAssignmentPayload {
  speciesId: string
  passiveId: string
}

export interface CreatePlayableClassPassiveAssignmentPayload {
  classId: string
  passiveId: string
}

/**
 * ---------------------------------------------------------
 * GET: Fetch all passive assignment rows
 * ---------------------------------------------------------
 */
export async function getPlayablePassiveAssignments(): Promise<
  PlayablePassiveAssignmentRow[]
> {
  const response = await axiosInstance.get('/admin/playable-passive-assignments')
  return response.data
}

/**
 * ---------------------------------------------------------
 * POST: Create a species passive assignment
 * ---------------------------------------------------------
 */
export async function createPlayableSpeciesPassiveAssignment(
  payload: CreatePlayableSpeciesPassiveAssignmentPayload
): Promise<PlayablePassiveAssignmentRow> {
  const response = await axiosInstance.post(
    '/admin/playable-passive-assignments/species',
    payload
  )
  return response.data.data
}

/**
 * ---------------------------------------------------------
 * POST: Create a class passive assignment
 * ---------------------------------------------------------
 */
export async function createPlayableClassPassiveAssignment(
  payload: CreatePlayableClassPassiveAssignmentPayload
): Promise<PlayablePassiveAssignmentRow> {
  const response = await axiosInstance.post(
    '/admin/playable-passive-assignments/classes',
    payload
  )
  return response.data.data
}

/**
 * ---------------------------------------------------------
 * DELETE: Remove a species passive assignment
 * ---------------------------------------------------------
 */
export async function deletePlayableSpeciesPassiveAssignment(
  speciesId: string,
  passiveId: string
): Promise<void> {
  await axiosInstance.delete(
    `/admin/playable-passive-assignments/species/${speciesId}/${passiveId}`
  )
}

/**
 * ---------------------------------------------------------
 * DELETE: Remove a class passive assignment
 * ---------------------------------------------------------
 */
export async function deletePlayableClassPassiveAssignment(
  classId: string,
  passiveId: string
): Promise<void> {
  await axiosInstance.delete(
    `/admin/playable-passive-assignments/classes/${classId}/${passiveId}`
  )
}