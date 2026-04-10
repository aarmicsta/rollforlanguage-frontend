/**
 * =========================================================
 * Playable Admin Types
 * =========================================================
 *
 * Shared lightweight record shapes for Playables admin table
 * and modal workflows.
 *
 * Responsibilities:
 * - define scalar admin-facing record types used by edit flows
 * - keep species, classes, and stats aligned structurally where
 *   their admin workflows follow the same general pattern
 *
 * Notes:
 * - These are intentionally lightweight admin-facing shapes.
 * - Relational data (for example, tags) is loaded separately
 *   by the specific modal/workflow that needs it.
 * - Types remain explicit per entity rather than being forced
 *   into a generic base abstraction.
 */

/**
 * ---------------------------------------------------------
 * Playable Class Edit Item
 * ---------------------------------------------------------
 *
 * Scalar admin-facing record shape for playable class table
 * and edit workflows.
 */
export interface PlayableClassEditItem {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null
  iconMediaAssetId: string | null
  isActive: boolean | null
  sortOrder: number | null
  createdAt: string | null
  updatedAt: string | null
}

/**
 * ---------------------------------------------------------
 * Playable Species Edit Item
 * ---------------------------------------------------------
 *
 * Scalar admin-facing record shape for playable species table
 * and edit workflows.
 */
export interface PlayableSpeciesEditItem {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null
  iconMediaAssetId: string | null
  isActive: boolean | null
  sortOrder: number | null
  createdAt: string | null
  updatedAt: string | null
}

/**
 * ---------------------------------------------------------
 * Playable Stat Edit Item
 * ---------------------------------------------------------
 *
 * Scalar admin-facing record shape for canonical playable stat
 * table and edit workflows.
 *
 * Notes:
 * - Stats currently represent canonical stat definitions.
 * - Baselines and species/class modifiers are separate systems.
 */
export interface PlayableStatEditItem {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null
  isActive: boolean | null
  sortOrder: number | null
  createdAt: string | null
  updatedAt: string | null
}