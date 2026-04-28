// src/features/admin/content/services/itemService.ts

/**
 * Item service (admin).
 *
 * Responsibilities:
 * - fetch item data from backend admin endpoints
 * - create new canonical item records
 * - update existing canonical item records
 * - manage item equipment slot assignment
 * - load canonical item/equipment reference options for admin forms
 *
 * Notes:
 * - mirrors the Content creature service pattern
 * - keeps logic thin: no transformation beyond basic typing
 * - assumes backend returns hydrated display fields
 * - future item systems such as effects, crafting, inventory,
 *   loot, and equipment stats should be added as separate
 *   service sections/endpoints
 */

import { axiosInstance } from '@/services/apiClient'
import type {
  EquipmentSlotOption,
  ItemEquipmentSlotAssignment,
  ItemListItem,
  ItemTypeOption,
  RarityLevelOption,
} from '@/features/admin/content/types/contentTypes'

/**
 * ---------------------------------------------------------
 * Item Create / Update Payloads
 * ---------------------------------------------------------
 */

export interface CreateItemPayload {
  displayName: string
  name: string
  slug: string
  description: string | null
  itemTypeId: string
  rarityLevelId: string
  baseValue: number
  weight: string
  maxStackSize: number
  isActive: boolean
}

export interface UpdateItemPayload {
  displayName: string
  description: string | null
  itemTypeId: string
  rarityLevelId: string
  baseValue: number
  weight: string
  maxStackSize: number
  isActive: boolean
}

export interface UpdateItemEquipmentSlotsPayload {
  equipmentSlotIds: string[]
}

/**
 * ---------------------------------------------------------
 * Item Browse
 * ---------------------------------------------------------
 */

/**
 * Fetch all items for admin browse table.
 */
export async function getItems(): Promise<ItemListItem[]> {
  const response = await axiosInstance.get('/admin/items')

  return response.data.data
}

/**
 * ---------------------------------------------------------
 * Item Create / Update
 * ---------------------------------------------------------
 */

/**
 * Create an item (admin).
 */
export async function createItem(
  data: CreateItemPayload
): Promise<ItemListItem | null> {
  const response = await axiosInstance.post('/admin/items', data)

  return response.data.data
}

/**
 * Update an item (admin).
 */
export async function updateItem(
  id: string,
  data: UpdateItemPayload
): Promise<ItemListItem | null> {
  const response = await axiosInstance.patch(`/admin/items/${id}`, data)

  return response.data.data
}

/**
 * ---------------------------------------------------------
 * Item Equipment Slots
 * ---------------------------------------------------------
 */

/**
 * Fetch assigned equipment slots for an item (admin).
 */
export async function getItemEquipmentSlots(
  itemId: string
): Promise<ItemEquipmentSlotAssignment[]> {
  const response = await axiosInstance.get(
    `/admin/items/${itemId}/equipment-slots`
  )

  return response.data.data
}

/**
 * Replace assigned equipment slots for an item (admin).
 */
export async function updateItemEquipmentSlots(
  itemId: string,
  data: UpdateItemEquipmentSlotsPayload
): Promise<ItemEquipmentSlotAssignment[]> {
  const response = await axiosInstance.patch(
    `/admin/items/${itemId}/equipment-slots`,
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
 * Fetch canonical item type options for admin forms.
 */
export async function getItemTypes(): Promise<ItemTypeOption[]> {
  const response = await axiosInstance.get('/admin/item-types')

  return response.data.data
}

/**
 * Fetch canonical rarity level options for admin forms.
 */
export async function getRarityLevels(): Promise<RarityLevelOption[]> {
  const response = await axiosInstance.get('/admin/rarity-levels')

  return response.data.data
}

/**
 * Fetch canonical equipment slot options for admin forms.
 */
export async function getEquipmentSlots(): Promise<EquipmentSlotOption[]> {
  const response = await axiosInstance.get('/admin/equipment-slots')

  return response.data.data
}