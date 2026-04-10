import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  PlayableClassEditItem,
  PlayableSpeciesEditItem,
  PlayableStatEditItem,
} from '@/features/admin/types/playableTypes'

/**
 * =========================================================
 * Admin Playable Store
 * =========================================================
 *
 * Shared UI state for the Playables admin dashboard.
 *
 * Responsibilities:
 * - track refresh triggers for playable dashboard widgets/tables
 * - track currently selected species/class/stat records for edit flows
 * - manage modal visibility for create/edit workflows
 * - track shared stats mode state for stat-related workflows
 * - expose shared submit/error state for modal-based operations
 *
 * Notes:
 * - Species, Classes, and Stats use explicit parallel state
 *   rather than a single generic "selectedPlayable" model.
 * - This keeps modal flows clearer and avoids ambiguous typing
 *   as the Playables dashboard grows in complexity.
 * - Create flows do not rely on selected entity state; they
 *   begin from fresh local form state inside their modals.
 */
export const useAdminPlayableStore = defineStore('adminPlayableStore', () => {
  /**
   * ---------------------------------------------------------
   * Refresh State
   * ---------------------------------------------------------
   *
   * Timestamp-style refresh key used to trigger refetches in
   * widgets/tables that watch for playable-data changes.
   */
  const lastPlayableRefresh = ref(Date.now())

  /**
   * ---------------------------------------------------------
   * Selection State
   * ---------------------------------------------------------
   *
   * Explicit edit targets for each playable entity type.
   *
   * Why split these?
   * - avoids one generic selected object pretending to be all
   *   playable entity types at once
   * - keeps edit modal flows type-safe and easier to follow
   * - supports a cleaner modal-container architecture
   */
  const selectedSpecies = ref<PlayableSpeciesEditItem | null>(null)
  const selectedClass = ref<PlayableClassEditItem | null>(null)
  const selectedStat = ref<PlayableStatEditItem | null>(null)

  /**
   * ---------------------------------------------------------
   * Modal Visibility State
   * ---------------------------------------------------------
   *
   * Explicit modal state for create/edit workflows.
   *
   * These are intentionally separate rather than generic so the
   * UI flow remains easy to reason about as more modal-based
   * admin tooling is added.
   */
  const showCreateSpeciesModal = ref(false)
  const showCreateClassModal = ref(false)
  const showCreateStatsModal = ref(false)
  const showEditSpeciesModal = ref(false)
  const showEditClassModal = ref(false)
  const showEditStatModal = ref(false)

  /**
   * ---------------------------------------------------------
   * Stats Mode State
   * ---------------------------------------------------------
   *
   * Shared mode state for stat-related workflows that can pivot
   * between Species and Class contexts.
   *
   * Current usage:
   * - create stat modal toggle shell
   *
   * Future usage:
   * - stat assignment/configuration workflows
   * - stat table/edit modal context switching where appropriate
   */
  const statsMode = ref<'species' | 'class'>('species')

  /**
   * ---------------------------------------------------------
   * Submission / Error State
   * ---------------------------------------------------------
   *
   * Shared UI state for modal-driven async operations.
   *
   * Current usage:
   * - disable form actions during submit
   * - surface save/create failures within modal workflows
   *
   * Note:
   * This remains shared for now because only one Playables modal
   * workflow should be active at a time.
   */
  const isSubmitting = ref(false)
  const submitError = ref<string | null>(null)

  /**
   * ---------------------------------------------------------
   * Refresh Actions
   * ---------------------------------------------------------
   *
   * Trigger downstream table/widget reloads after successful
   * create/edit operations.
   */
  function refreshPlayableList() {
    lastPlayableRefresh.value = Date.now()
  }

  /**
   * ---------------------------------------------------------
   * Create Modal Actions
   * ---------------------------------------------------------
   *
   * Create flows start with no selected entity and fresh local
   * form state inside the modal itself.
   */
  function openCreateSpeciesModal() {
    showCreateSpeciesModal.value = true
    submitError.value = null
  }

  function closeCreateSpeciesModal() {
    showCreateSpeciesModal.value = false
    submitError.value = null
  }

  function openCreateClassModal() {
    showCreateClassModal.value = true
    submitError.value = null
  }

  function closeCreateClassModal() {
    showCreateClassModal.value = false
    submitError.value = null
  }

  function openCreateStatsModal(mode: 'species' | 'class' = 'species') {
    statsMode.value = mode
    showCreateStatsModal.value = true
    submitError.value = null
  }

  function closeCreateStatsModal() {
    showCreateStatsModal.value = false
    submitError.value = null
  }

  /**
   * ---------------------------------------------------------
   * Edit Modal Actions
   * ---------------------------------------------------------
   *
   * Edit flows set the selected entity first, then open the
   * corresponding modal.
   */
  function openEditSpeciesModal(species: PlayableSpeciesEditItem) {
    selectedSpecies.value = species
    showEditSpeciesModal.value = true
    submitError.value = null
  }

  function closeEditSpeciesModal() {
    showEditSpeciesModal.value = false
    selectedSpecies.value = null
    submitError.value = null
  }

  function openEditClassModal(classItem: PlayableClassEditItem) {
    selectedClass.value = classItem
    showEditClassModal.value = true
    submitError.value = null
  }

  function closeEditClassModal() {
    showEditClassModal.value = false
    selectedClass.value = null
    submitError.value = null
  }

  function openEditStatModal(stat: PlayableStatEditItem) {
    selectedStat.value = stat
    showEditStatModal.value = true
    submitError.value = null
  }

  function closeEditStatModal() {
    showEditStatModal.value = false
    selectedStat.value = null
    submitError.value = null
  }

  return {
    /**
     * -------------------------------------------------------
     * State
     * -------------------------------------------------------
     */
    lastPlayableRefresh,
    selectedSpecies,
    selectedClass,
    selectedStat,
    showCreateSpeciesModal,
    showCreateClassModal,
    showCreateStatsModal,
    showEditSpeciesModal,
    showEditClassModal,
    showEditStatModal,
    statsMode,
    isSubmitting,
    submitError,

    /**
     * -------------------------------------------------------
     * Actions
     * -------------------------------------------------------
     */
    refreshPlayableList,
    openCreateSpeciesModal,
    closeCreateSpeciesModal,
    openCreateClassModal,
    closeCreateClassModal,
    openCreateStatsModal,
    closeCreateStatsModal,
    openEditSpeciesModal,
    closeEditSpeciesModal,
    openEditClassModal,
    closeEditClassModal,
    openEditStatModal,
    closeEditStatModal,
  }
})