// src/features/admin/content/services/creatureService.ts

/**
 * Creature service (admin).
 *
 * Responsibilities:
 * - fetch creature data from backend admin endpoints
 * - create new creature records
 * - update existing creature records
 * - manage creature tag assignment
 * - load canonical creature reference options for admin forms
 *
 * Notes:
 * - mirrors existing admin service patterns
 * - keeps logic thin: no transformation beyond basic typing
 * - assumes backend returns hydrated display fields
 */

import { axiosInstance } from '@/services/apiClient'

/**
 * ---------------------------------------------------------
 * Creature Browse Types
 * ---------------------------------------------------------
 */

export interface CreatureListItem {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null

  creatureTypeId: string
  sizeCategoryId: string
  intelligenceCategoryId: string | null
  threatLevelId: string | null

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
 * Creature Create / Update Payloads
 * ---------------------------------------------------------
 */

export interface CreateCreaturePayload {
  displayName: string
  name: string
  slug: string
  description: string | null
  creatureTypeId: string
  sizeCategoryId: string
  isActive: boolean
}

export interface UpdateCreaturePayload {
  displayName: string
  description: string | null
  creatureTypeId: string
  sizeCategoryId: string
  intelligenceCategoryId: string | null
  threatLevelId: string | null
  isActive: boolean
}

export interface UpdateCreatureTagsPayload {
  tagIds: string[]
}

/**
 * ---------------------------------------------------------
 * Reference Lookup Types
 * ---------------------------------------------------------
 *
 * Canonical option shapes used by creature create/edit forms.
 */

export interface CreatureTypeOption {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null
  isActive: boolean
  sortOrder: number
}

export interface SizeCategoryOption {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null
  sizeRank: number | null
  isActive: boolean
  sortOrder: number
}

export interface IntelligenceCategoryOption {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null
  intelligenceRank: number | null
  isActive: boolean
  sortOrder: number
}

export interface ThreatLevelOption {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null
  threatRank: number | null
  recommendedLevelMin: number | null
  recommendedLevelMax: number | null
  isActive: boolean
  sortOrder: number
}

/**
 * ---------------------------------------------------------
 * Creature Browse
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
 * ---------------------------------------------------------
 * Creature Create / Update
 * ---------------------------------------------------------
 */

/**
 * Create a creature (admin).
 */
export async function createCreature(
  data: CreateCreaturePayload
): Promise<CreatureListItem | null> {
  const response = await axiosInstance.post('/admin/creatures', data)

  return response.data.data
}

/**
 * Update a creature (admin).
 */
export async function updateCreature(
  id: string,
  data: UpdateCreaturePayload
): Promise<CreatureListItem | null> {
  const response = await axiosInstance.patch(`/admin/creatures/${id}`, data)

  return response.data.data
}

/**
 * ---------------------------------------------------------
 * Creature Tags
 * ---------------------------------------------------------
 */

/**
 * Fetch assigned tags for a creature (admin).
 */
export async function getCreatureTags(creatureId: string) {
  const response = await axiosInstance.get(`/admin/creatures/${creatureId}/tags`)

  return response.data.data
}

/**
 * Replace assigned tags for a creature (admin).
 */
export async function updateCreatureTags(
  creatureId: string,
  data: UpdateCreatureTagsPayload
) {
  const response = await axiosInstance.patch(
    `/admin/creatures/${creatureId}/tags`,
    data
  )

  return response.data.data
}

/**
 * ---------------------------------------------------------
 * Reference Lookups
 * ---------------------------------------------------------
 */

/**
 * Fetch canonical creature type options for admin forms.
 */
export async function getCreatureTypes(): Promise<CreatureTypeOption[]> {
  const response = await axiosInstance.get('/admin/creature-types')

  return response.data.data
}

/**
 * Fetch canonical size category options for admin forms.
 */
export async function getSizeCategories(): Promise<SizeCategoryOption[]> {
  const response = await axiosInstance.get('/admin/size-categories')

  return response.data.data
}

/**
 * Fetch canonical intelligence category options for admin forms.
 */
export async function getIntelligenceCategories(): Promise<
  IntelligenceCategoryOption[]
> {
  const response = await axiosInstance.get('/admin/intelligence-categories')

  return response.data.data
}

/**
 * Fetch canonical threat level category options for admin forms.
 */
export async function getThreatLevels(): Promise<ThreatLevelOption[]> {
  const response = await axiosInstance.get('/admin/threat-levels')

  return response.data.data
}

/**
 * ---------------------------------------------------------
 * Creature Base Stats Types
 * ---------------------------------------------------------
 */

export interface CreatureBaseStatsTableRow {
  creatureId: string
  creatureDisplayName: string
  creatureType: string
  sizeCategory: string
  assignedStatCount: number
  updatedAt: string | null
}

export interface CreatureBaseStatEditRow {
  statId: string
  statName: string
  statSlug: string
  statDisplayName: string
  baseValue: number | null
  sortOrder: number | null
}

/**
 * =========================================================
 * Creature Base Stats
 * =========================================================
 */

/**
 * ---------------------------------------------------------
 * Get Creature Base Stats Table
 * ---------------------------------------------------------
 */
export async function getCreatureBaseStatsTable(): Promise<
  CreatureBaseStatsTableRow[]
> {
  const res = await axiosInstance.get('/admin/creature-base-stats')
  return res.data.data
}

/**
 * ---------------------------------------------------------
 * Get Creature Base Stats
 * ---------------------------------------------------------
 */
export async function getCreatureBaseStats(
  creatureId: string
): Promise<CreatureBaseStatEditRow[]> {
  const res = await axiosInstance.get(
    `/admin/creatures/${creatureId}/base-stats`
  )
  return res.data.data
}

/**
 * ---------------------------------------------------------
 * Update Creature Base Stats
 * ---------------------------------------------------------
 */
export async function updateCreatureBaseStats(
  creatureId: string,
  stats: Array<{
    statId: string
    baseValue: number | null
  }>
): Promise<CreatureBaseStatEditRow[]> {
  const res = await axiosInstance.patch(
    `/admin/creatures/${creatureId}/base-stats`,
    { stats }
  )
  return res.data.data
}