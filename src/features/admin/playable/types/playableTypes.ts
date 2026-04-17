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

/**
 * ---------------------------------------------------------
 * Playable Stat Modifier Row
 * ---------------------------------------------------------
 *
 * Unified admin-facing table row shape for the Stat Modifier
 * management system.
 *
 * Responsibilities:
 * - represent a flattened, display-ready record for all stat
 *   modifier contexts in a single table view
 * - normalize backend data from:
 *   - playable_stat_baselines
 *   - playable_species_stat_modifiers
 *   - playable_class_stat_modifiers
 * - support row-click edit workflows via a consistent shape
 *
 * Contexts:
 * - 'baseline'
 *   - global stat baseline value
 *   - no specific species/class target
 *
 * - 'species'
 *   - stat modifier applied to a specific playable species
 *
 * - 'class'
 *   - stat modifier applied to a specific playable class
 *
 * Notes:
 * - This is a UI-layer abstraction, not a direct mapping to any
 *   single backend table.
 * - `targetId` is null for baseline rows.
 * - `targetDisplayName` should be "Global" (or similar) for
 *   baseline rows to maintain table consistency.
 * - The table system consumes a single unified row type to
 *   avoid branching logic across modifier contexts.
 */
export interface PlayableStatModifierRow {
  context: 'baseline' | 'species' | 'class'
  targetId: string | null
  targetDisplayName: string
  statId: string
  statDisplayName: string
  value: number
  updatedAt: string | null
}

/**
 * ---------------------------------------------------------
 * Playable Passive Types
 * ---------------------------------------------------------
 *
 * Represents both:
 * - canonical passive definitions (edit items)
 * - unified passive assignment rows (species/class context)
 *
 * Notes:
 * - `PlayablePassiveEditItem`
 *   mirrors the canonical passive entity returned from the backend
 *   and is used for create/edit modal workflows
 *
 * - `PlayablePassiveAssignmentRow`
 *   is a flattened UI-layer row shape used in the unified
 *   assignment table (species + class)
 *
 * - This mirrors the existing split between:
 *   - PlayableStatEditItem (canonical)
 *   - PlayableStatModifierRow (unified assignment system)
 */

export interface PlayablePassiveEditItem {
  id: string
  name: string
  slug: string
  displayName: string
  description?: string | null
  effectText?: string | null
  effectType?: string | null
  isActive: boolean
  sortOrder: number
  createdAt?: string | null
  updatedAt?: string | null
}

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