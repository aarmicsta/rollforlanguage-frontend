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