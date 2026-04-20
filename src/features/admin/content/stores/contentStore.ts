import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * =========================================================
 * Content Store
 * =========================================================
 *
 * Responsibilities
 * - own shared dashboard state for the Content admin domain
 * - coordinate active domain / active management surface
 * - hold selected records for management workflows
 *
 * Current Scope
 * - active content domain
 * - active management surface
 * - selected creature
 *
 * Notes
 * - This store is being expanded incrementally using the
 *   Playables dashboard as the canonical reference model
 * - Modal visibility and additional selected record types
 *   will be added as the Content domain grows
 * =========================================================
 */

export type ContentDomain = 'creatures' | 'items'

/**
 * ---------------------------------------------------------
 * Creature Browse Record
 * ---------------------------------------------------------
 *
 * Shared store-facing creature shape used for table
 * selection workflows.
 *
 * Notes:
 * - This mirrors the current admin creature browse payload
 * - It is defined locally in the store for now so the store
 *   can own creature selection state without importing from
 *   the service layer
 */
export interface ContentCreatureRecord {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null

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

export const useContentStore = defineStore('content', () => {
  /**
   * ---------------------------------------------------------
   * Active Content Domain
   * ---------------------------------------------------------
   *
   * Determines which Content category the user is currently
   * working in.
   */
  const activeContentDomain = ref<ContentDomain>('creatures')

  /**
   * ---------------------------------------------------------
   * Active Management Surface
   * ---------------------------------------------------------
   *
   * Determines which table (if any) is currently visible
   * in the Content dashboard surface.
   */
  const activeManagementSurface = ref<string | null>(null)

  /**
   * ---------------------------------------------------------
   * Selected Records
   * ---------------------------------------------------------
   *
   * Holds the currently selected content-domain record for
   * workflow actions such as editing.
   *
   * Current scope:
   * - creatures only
   */
  const selectedCreature = ref<ContentCreatureRecord | null>(null)

  /**
   * ---------------------------------------------------------
   * Actions
   * ---------------------------------------------------------
   */

  /**
   * Set the active Content domain and synchronize the
   * management surface accordingly.
   */
  function setActiveContentDomain(domain: ContentDomain) {
    activeContentDomain.value = domain

    switch (domain) {
      case 'creatures':
        activeManagementSurface.value = 'creatures'
        break
      case 'items':
        activeManagementSurface.value = 'items'
        break
    }
  }

  /**
   * Set the currently active management surface.
   */
  function setActiveManagementSurface(surface: string) {
    activeManagementSurface.value = surface
  }

  /**
   * Clear the currently active management surface.
   */
  function clearActiveManagementSurface() {
    activeManagementSurface.value = null
  }

  /**
   * Set the currently selected creature record.
   */
  function setSelectedCreature(creature: ContentCreatureRecord | null) {
    selectedCreature.value = creature
  }

  /**
   * Clear the currently selected creature record.
   */
  function clearSelectedCreature() {
    selectedCreature.value = null
  }

  return {
    activeContentDomain,
    setActiveContentDomain,

    activeManagementSurface,
    setActiveManagementSurface,
    clearActiveManagementSurface,

    selectedCreature,
    setSelectedCreature,
    clearSelectedCreature,
  }
})