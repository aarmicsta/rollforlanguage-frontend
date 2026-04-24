import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  ContentCreatureRecord,
  ContentDomain,
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
   * Holds the currently selected content-domain record for
   * workflow actions such as editing.
   *
   * Notes:
   * - selectedCreature provides edit context for CreatureEditModal
   * - selectedCreature does NOT control modal visibility
   * - showEditCreatureModal owns explicit edit modal visibility
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
  const showEditCreatureModal = ref(false)
  const showCreatureBaseStatsModal = ref(false)

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

    showCreateCreatureModal,
    openCreateCreatureModal,
    closeCreateCreatureModal,

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