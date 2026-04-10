/**
 * Playable Stat Modifier Admin Service
 *
 * Responsibilities:
 * - interact with backend playable stat modifier admin endpoints
 * - provide typed API calls for baseline and modifier retrieval, creation, and updates
 *
 * Notes:
 * - operates on stat usage/configuration, not canonical stat definitions
 * - covers:
 *   - playable_stat_baselines
 *   - playable_species_stat_modifiers
 *   - playable_class_stat_modifiers
 * - aligned with backend response pattern (`{ message, data }` for mutations)
 */

import { axiosInstance } from '@/services/axiosInstance'
import type { PlayableStatModifierRow } from '@/features/admin/types/playableTypes'

/**
 * Payload for creating a baseline value.
 */
export interface CreatePlayableStatBaselinePayload {
  statId: string
  baseValue: number
}

/**
 * Payload for updating a baseline value.
 */
export interface UpdatePlayableStatBaselinePayload {
  baseValue: number
}

/**
 * Payload for creating a species stat modifier.
 */
export interface CreatePlayableSpeciesStatModifierPayload {
  speciesId: string
  statId: string
  modifierValue: number
}

/**
 * Payload for updating a species stat modifier.
 */
export interface UpdatePlayableSpeciesStatModifierPayload {
  modifierValue: number
}

/**
 * Payload for creating a class stat modifier.
 */
export interface CreatePlayableClassStatModifierPayload {
  classId: string
  statId: string
  modifierValue: number
}

/**
 * Payload for updating a class stat modifier.
 */
export interface UpdatePlayableClassStatModifierPayload {
  modifierValue: number
}

/**
 * ---------------------------------------------------------
 * GET: Fetch all stat modifier rows
 * ---------------------------------------------------------
 *
 * Returns:
 * - unified list of baseline/species/class modifier rows
 */
export async function getPlayableStatModifiers(): Promise<PlayableStatModifierRow[]> {
  const response = await axiosInstance.get('/admin/playable-stat-modifiers')
  return response.data
}

/**
 * ---------------------------------------------------------
 * POST: Create a baseline value
 * ---------------------------------------------------------
 *
 * Returns:
 * - newly created baseline row (from `response.data.data`)
 */
export async function createPlayableStatBaseline(
  payload: CreatePlayableStatBaselinePayload
): Promise<PlayableStatModifierRow> {
  const response = await axiosInstance.post(
    '/admin/playable-stat-modifiers/baselines',
    payload
  )
  return response.data.data
}

/**
 * ---------------------------------------------------------
 * PATCH: Update a baseline value
 * ---------------------------------------------------------
 *
 * Returns:
 * - updated baseline row (from `response.data.data`)
 */
export async function updatePlayableStatBaseline(
  statId: string,
  payload: UpdatePlayableStatBaselinePayload
): Promise<PlayableStatModifierRow> {
  const response = await axiosInstance.patch(
    `/admin/playable-stat-modifiers/baselines/${statId}`,
    payload
  )
  return response.data.data
}

/**
 * ---------------------------------------------------------
 * POST: Create a species stat modifier
 * ---------------------------------------------------------
 *
 * Returns:
 * - newly created species modifier row (from `response.data.data`)
 */
export async function createPlayableSpeciesStatModifier(
  payload: CreatePlayableSpeciesStatModifierPayload
): Promise<PlayableStatModifierRow> {
  const response = await axiosInstance.post(
    '/admin/playable-stat-modifiers/species',
    payload
  )
  return response.data.data
}

/**
 * ---------------------------------------------------------
 * PATCH: Update a species stat modifier
 * ---------------------------------------------------------
 *
 * Returns:
 * - updated species modifier row (from `response.data.data`)
 */
export async function updatePlayableSpeciesStatModifier(
  speciesId: string,
  statId: string,
  payload: UpdatePlayableSpeciesStatModifierPayload
): Promise<PlayableStatModifierRow> {
  const response = await axiosInstance.patch(
    `/admin/playable-stat-modifiers/species/${speciesId}/${statId}`,
    payload
  )
  return response.data.data
}

/**
 * ---------------------------------------------------------
 * POST: Create a class stat modifier
 * ---------------------------------------------------------
 *
 * Returns:
 * - newly created class modifier row (from `response.data.data`)
 */
export async function createPlayableClassStatModifier(
  payload: CreatePlayableClassStatModifierPayload
): Promise<PlayableStatModifierRow> {
  const response = await axiosInstance.post(
    '/admin/playable-stat-modifiers/classes',
    payload
  )
  return response.data.data
}

/**
 * ---------------------------------------------------------
 * PATCH: Update a class stat modifier
 * ---------------------------------------------------------
 *
 * Returns:
 * - updated class modifier row (from `response.data.data`)
 */
export async function updatePlayableClassStatModifier(
  classId: string,
  statId: string,
  payload: UpdatePlayableClassStatModifierPayload
): Promise<PlayableStatModifierRow> {
  const response = await axiosInstance.patch(
    `/admin/playable-stat-modifiers/classes/${classId}/${statId}`,
    payload
  )
  return response.data.data
}