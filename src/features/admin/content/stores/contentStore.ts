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
 * - control Content-domain modal visibility
 *
 * Current Scope
 * - active content domain
 * - active management surface
 * - selected creature
 * - creature create modal visibility
 *
 * Notes
 * - This store is being expanded incrementally using the
 *   Playables dashboard as the canonical reference model
 * - Edit visibility for creatures is currently driven by
 *   selectedCreature presence
 * - Create visibility is explicitly store-controlled
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
   * Modal Visibility
   * ---------------------------------------------------------
   *
   * Explicit visibility state for Content-domain create
   * workflows.
   *
   * Current scope:
   * - creature create modal
   */
  const showCreateCreatureModal = ref(false)

  /**
   * ---------------------------------------------------------
   * Refresh Sync
   * ---------------------------------------------------------
   *
   * Shared refresh signal for Content-domain browse surfaces.
   *
   * Components can watch this value and re-fetch their data
   * whenever a Content-domain mutation completes.
   */
  const lastContentRefresh = ref(0)

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

  /**
   * Open the creature create modal.
   */
  function openCreateCreatureModal() {
    showCreateCreatureModal.value = true
  }

  /**
   * Close the creature create modal.
   */
  function closeCreateCreatureModal() {
    showCreateCreatureModal.value = false
  }

  /**
   * Trigger a Content-domain refresh signal for browse views.
   */
  function refreshContentList() {
    lastContentRefresh.value++
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

    showCreateCreatureModal,
    openCreateCreatureModal,
    closeCreateCreatureModal,

    lastContentRefresh,
    refreshContentList,
  }
})