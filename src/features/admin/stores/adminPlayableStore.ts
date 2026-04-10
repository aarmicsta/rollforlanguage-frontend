import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  PlayableClassEditItem,
  PlayableSpeciesEditItem,
  PlayableStatEditItem,
  PlayableStatModifierRow,
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
 * - track currently selected stat modifier row for modifier edit flows
 * - manage modal visibility for create/edit workflows
 * - track shared stat modifier mode state across baseline/species/class contexts
 * - expose shared submit/error state for modal-based operations
 *
 * Notes:
 * - Species, Classes, Stats, and Stat Modifiers use explicit
 *   parallel state rather than a single generic selected entity model.
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
   * Stat Modifier Selection State
   * ---------------------------------------------------------
   *
   * Unified selected row for Stat Modifier edit workflows.
   *
   * Notes:
   * - This represents a UI-layer row shape, not a direct backend
   *   table record.
   * - It may correspond to:
   *   - a baseline row
   *   - a species modifier row
   *   - a class modifier row
   */
  const selectedStatModifierRow = ref<PlayableStatModifierRow | null>(null)

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
  const showCreateStatModifierModal = ref(false)
  const showEditSpeciesModal = ref(false)
  const showEditClassModal = ref(false)
  const showEditStatModal = ref(false)
  const showEditStatModifierModal = ref(false)

  /**
   * ---------------------------------------------------------
   * Stat Modifier Mode State
   * ---------------------------------------------------------
   *
   * Shared mode state for the unified Stat Modifier system.
   *
   * Contexts:
   * - 'baseline'
   *   global playable stat baseline values
   * - 'species'
   *   species-specific stat modifiers
   * - 'class'
   *   class-specific stat modifiers
   *
   * Notes:
   * - This replaces the narrower statsMode concept that only
   *   pivoted between species and class.
   * - Canonical stat definitions remain a separate system.
   */
  const statModifierMode = ref<'baseline' | 'species' | 'class'>('species')

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

  function openCreateStatsModal() {
    showCreateStatsModal.value = true
    submitError.value = null
  }

  function closeCreateStatsModal() {
    showCreateStatsModal.value = false
    submitError.value = null
  }

  /**
   * ---------------------------------------------------------
   * Stat Modifier Create Modal Actions
   * ---------------------------------------------------------
   *
   * Opens the unified Stat Modifier create flow in the requested
   * context.
   */
  function openCreateStatModifierModal(
    mode: 'baseline' | 'species' | 'class' = 'species'
  ) {
    statModifierMode.value = mode
    showCreateStatModifierModal.value = true
    submitError.value = null
  }

  function closeCreateStatModifierModal() {
    showCreateStatModifierModal.value = false
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

  /**
   * ---------------------------------------------------------
   * Stat Modifier Edit Modal Actions
   * ---------------------------------------------------------
   *
   * Opens the unified Stat Modifier edit flow using the selected
   * modifier row and synchronizes the mode from that row's context.
   */
  function openEditStatModifierModal(row: PlayableStatModifierRow) {
    selectedStatModifierRow.value = row
    statModifierMode.value = row.context
    showEditStatModifierModal.value = true
    submitError.value = null
  }

  function closeEditStatModifierModal() {
    showEditStatModifierModal.value = false
    selectedStatModifierRow.value = null
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
    selectedStatModifierRow,
    showCreateSpeciesModal,
    showCreateClassModal,
    showCreateStatsModal,
    showCreateStatModifierModal,
    showEditSpeciesModal,
    showEditClassModal,
    showEditStatModal,
    showEditStatModifierModal,
    statModifierMode,
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
    openCreateStatModifierModal,
    closeCreateStatModifierModal,
    openEditSpeciesModal,
    closeEditSpeciesModal,
    openEditClassModal,
    closeEditClassModal,
    openEditStatModal,
    closeEditStatModal,
    openEditStatModifierModal,
    closeEditStatModifierModal,
  }
})