import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  ContentCreatureRecord,
  ContentDomain,
  ContentItemRecord,
  ContentManagementSurface,
} from '@/features/admin/content/types/contentTypes'

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
  const activeManagementSurface = ref<ContentManagementSurface | null>(null)

  /**
   * ---------------------------------------------------------
   * Selected Records
   * ---------------------------------------------------------
   *
   * Holds the currently selected content-domain records for
   * workflow actions such as editing.
   *
   * Notes:
   * - selectedCreature provides edit context for CreatureEditModal
   * - selectedItem provides edit context for ItemEditModal
   *
   * - selected records DO NOT control modal visibility
   * - explicit modal state flags own visibility
   *
   * Current scope:
   * - creatures
   * - items (MVP foundation)
   */
  const selectedCreature = ref<ContentCreatureRecord | null>(null)
  const selectedItem = ref<ContentItemRecord | null>(null)

  /**
   * ---------------------------------------------------------
   * Modal Visibility
   * ---------------------------------------------------------
   *
   * Explicit visibility state for Content-domain modal workflows.
   *
   * Notes:
   * - visibility is store-controlled (not inferred)
   * - each domain owns its own create/edit modal state
   *
   * Current scope:
   * - creature create/edit/base stats modals
   * - item create/edit modals (MVP foundation)
   */
  const showCreateCreatureModal = ref(false)
  const showEditCreatureModal = ref(false)
  const showCreatureBaseStatsModal = ref(false)
  const showCreateItemModal = ref(false)
  const showEditItemModal = ref(false)

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
  const lastContentRefresh = ref<number | null>(null)

  /**
   * ---------------------------------------------------------
   * Shared Submission State
   * ---------------------------------------------------------
   *
   * Store-owned submission and error state for Content-domain
   * modal workflows.
   *
   * Mirrors the canonical Playables / Users dashboard pattern.
   */
  const isSubmitting = ref(false)
  const submitError = ref('')

  /**
   * ---------------------------------------------------------
   * Actions
   * ---------------------------------------------------------
   */

  /**
   * Set the active Content domain and synchronize the
   * management surface accordingly.
   *
   * Notes:
   * - implemented domains may activate a management surface
   * - placeholder domains clear the active surface until their
   *   systems are built
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

      case 'factions':
      case 'organizations':
      case 'locations':
        activeManagementSurface.value = null
        break
    }
  }

  /**
   * Set the currently active management surface.
   */
  function setActiveManagementSurface(surface: ContentManagementSurface) {
    activeManagementSurface.value = surface
  }

  /**
   * Toggle the currently active management surface.
   */
  function toggleManagementSurface(surface: ContentManagementSurface) {
    activeManagementSurface.value =
      activeManagementSurface.value === surface ? null : surface
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
   * Open the creature edit modal for a selected creature.
   */
  function openEditCreatureModal(creature: ContentCreatureRecord) {
    selectedCreature.value = creature
    showEditCreatureModal.value = true
  }

  /**
   * Close the creature edit modal.
   */
  function closeEditCreatureModal() {
    showEditCreatureModal.value = false
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
   * Set the currently selected item record.
   */
  function setSelectedItem(item: ContentItemRecord | null) {
    selectedItem.value = item
  }

  /**
   * Clear the currently selected item record.
   */
  function clearSelectedItem() {
    selectedItem.value = null
  }

  /**
   * Open the item edit modal for a selected item.
   */
  function openEditItemModal(item: ContentItemRecord) {
    selectedItem.value = item
    showEditItemModal.value = true
  }

  /**
   * Close the item edit modal.
   */
  function closeEditItemModal() {
    showEditItemModal.value = false
    selectedItem.value = null
  }

  /**
   * Open the item create modal.
   */
  function openCreateItemModal() {
    showCreateItemModal.value = true
  }

  /**
   * Close the item create modal.
   */
  function closeCreateItemModal() {
    showCreateItemModal.value = false
  }

  /**
   * Trigger a Content-domain refresh signal for browse views.
   */
  function refreshContentList() {
    lastContentRefresh.value = Date.now()
  }

  function openCreatureBaseStatsModal() {
    showCreatureBaseStatsModal.value = true
  }

  function closeCreatureBaseStatsModal() {
    showCreatureBaseStatsModal.value = false
  }

  /**
   * Set shared Content submission state.
   */
  function setSubmitting(value: boolean) {
    isSubmitting.value = value
  }

  /**
   * Set shared Content submission error message.
   */
  function setSubmitError(message: string) {
    submitError.value = message
  }

  /**
   * Clear shared Content submission error message.
   */
  function clearSubmitError() {
    submitError.value = ''
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

    selectedItem,
    setSelectedItem,
    clearSelectedItem,

    showCreateCreatureModal,
    openCreateCreatureModal,
    closeCreateCreatureModal,

    showCreateItemModal,
    openCreateItemModal,
    closeCreateItemModal,

    showEditItemModal,
    openEditItemModal,
    closeEditItemModal,

    lastContentRefresh,
    refreshContentList,

    showCreatureBaseStatsModal,
    openCreatureBaseStatsModal,
    closeCreatureBaseStatsModal,

    toggleManagementSurface,

    showEditCreatureModal,
    openEditCreatureModal,
    closeEditCreatureModal,

    isSubmitting,
    submitError,
    setSubmitting,
    setSubmitError,
    clearSubmitError,
  }
})