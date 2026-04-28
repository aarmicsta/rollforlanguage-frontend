/**
 * =========================================================
 * Content Admin Types
 * =========================================================
 *
 * Shared frontend type definitions for the Content admin
 * dashboard.
 *
 * Scope of this file:
 * - Content dashboard domain keys
 * - Content management surface keys
 * - Shared Content-domain record shapes
 *
 * Architectural Notes:
 * ---------------------------------------------------------
 * 1. Type Ownership
 *    Shared Content admin types live here so stores, services,
 *    and components can reference the same shapes without
 *    duplicating interfaces.
 *
 * 2. Semantic Aliases
 *    Some layers may use different names for the same backend
 *    payload shape.
 *
 *    Example:
 *    - ContentCreatureRecord: store/UI-facing selected record
 *    - CreatureListItem: service/table-facing browse record
 *
 *    These names are preserved as aliases to keep calling code
 *    readable while preventing shape drift.
 *
 * =========================================================
 */

/**
 * ---------------------------------------------------------
 * ContentDomain
 * ---------------------------------------------------------
 *
 * Top-level Content dashboard domain options.
 */
export type ContentDomain =
  | 'creatures'
  | 'items'
  | 'factions'
  | 'organizations'
  | 'locations'

/**
 * ---------------------------------------------------------
 * ContentManagementSurface
 * ---------------------------------------------------------
 *
 * Management surface keys supported by the Content dashboard.
 */
export type ContentManagementSurface = 'creatures' | 'creatureStats' | 'items'

/**
 * ---------------------------------------------------------
 * ContentCreatureRecord
 * ---------------------------------------------------------
 *
 * Shared frontend shape for a creature record returned by the
 * admin creature browse/update endpoints.
 *
 * Notes:
 * - includes both raw classification IDs and display labels
 * - raw IDs support edit workflows
 * - display labels support browse/table rendering
 */
export interface ContentCreatureRecord {
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
 * CreatureListItem
 * ---------------------------------------------------------
 *
 * Service/table-facing alias for the Content creature browse
 * record shape.
 *
 * This intentionally aliases ContentCreatureRecord so service
 * contracts and store selection state cannot drift apart.
 */
export type CreatureListItem = ContentCreatureRecord


/**
 * ---------------------------------------------------------
 * Content Item Record
 * ---------------------------------------------------------
 *
 * Shared frontend shape for an item record returned by future
 * admin item browse/update endpoints.
 *
 * Notes:
 * - includes both raw classification IDs and display labels
 * - raw IDs support edit workflows
 * - display labels support browse/table rendering
 * - equipment slot assignment remains relational and is loaded
 *   separately when needed
 */
export interface ContentItemRecord {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null

  itemTypeId: string
  rarityLevelId: string

  itemType: string
  rarityLevel: string

  baseValue: number
  weight: string
  maxStackSize: number

  iconMediaAssetId: string | null
  isActive: boolean | null
  sortOrder: number | null
  createdAt: string | null
  updatedAt: string | null
}

/**
 * ---------------------------------------------------------
 * ItemListItem
 * ---------------------------------------------------------
 *
 * Service/table-facing alias for the Content item browse
 * record shape.
 *
 * This intentionally aliases ContentItemRecord so service
 * contracts and store selection state cannot drift apart.
 */
export type ItemListItem = ContentItemRecord

/**
 * ---------------------------------------------------------
 * Item Reference Options
 * ---------------------------------------------------------
 *
 * Canonical option shapes used by future item create/edit
 * forms.
 */
export interface ItemTypeOption {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null
  itemCategory: string | null
  isEquippable: boolean
  isConsumable: boolean
  isCraftingMaterial: boolean
  isActive: boolean
  sortOrder: number
}

export interface RarityLevelOption {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null
  rarityRank: number | null
  colorHex: string | null
  isActive: boolean
  sortOrder: number
}

export interface EquipmentSlotOption {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null
  slotCategory: string | null
  isActive: boolean
  sortOrder: number
}

/**
 * ---------------------------------------------------------
 * Item Equipment Slot Assignment
 * ---------------------------------------------------------
 *
 * Resolved equipment slot assignment shape for item create/edit
 * workflows.
 *
 * Notes:
 * - only equippable items are expected to use slot assignment
 * - non-equippable items may have an empty assignment set
 */
export interface ItemEquipmentSlotAssignment {
  id: string
  name: string
  slug: string
  displayName: string
  slotCategory: string | null
}