/**
 * playableTypes.ts
 *
 * 2026-04-07
 * Modernized to align with the current admin playable architecture.
 *
 * Notes:
 * - The older "full/detail" playable entity model has been retired from this file.
 * - The active admin flow now uses lightweight scalar record shapes, with
 *   relational data (for example, tags) loaded separately as needed.
 * - Species is the canonical model; class types are brought into parity with it.
 */

export interface PlayableClassBrowseItem {
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

export interface PlayableSpeciesBrowseItem {
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