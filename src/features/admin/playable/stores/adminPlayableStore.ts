import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  PlayableClassEditItem,
  PlayableSpeciesEditItem,
  PlayableStatEditItem,
  PlayableStatModifierRow,
  PlayablePassiveEditItem,
  PlayablePassiveAssignmentRow,
} from '@/features/admin/playable/types/playableTypes'

/**
 * =========================================================
 * Admin Playable Store
 * =========================================================
 *
 * Shared UI orchestration state for the Playables admin dashboard.
 *
 * Responsibilities:
 * - track refresh triggers for playable dashboard widgets/tables
 * - track which primary management surface is currently active
 *   - classes
 *   - species
 *   - stats
 *   - stat modifiers
 *   - passives
 * - track selected canonical entities for edit flows
 *   - species
 *   - classes
 *   - stats
 *   - passives
 * - track selected unified row-based records for assignment/config flows
 *   - stat modifiers
 *   - passive assignments
 * - manage modal visibility for create/edit workflows
 * - track context mode for unified multi-context systems
 *   - stat modifiers: baseline/species/class
 *   - passive assignments: species/class
 * - expose shared submit/error state for modal-based operations
 *
 * Notes:
 * - This store uses explicit parallel state rather than a generic
 *   selected-entity model.
 * - That keeps dashboard flows easier to reason about as the
 *   Playables system grows in complexity.
 * - Create flows do not rely on selected entity state; they begin
 *   from fresh local form state inside their modals.
 * - Unified row types represent UI-layer records, not direct raw
 *   backend table rows.
 * - This store is intentionally an orchestration layer, not a
 *   general-purpose entity cache.
 */
export const useAdminPlayableStore = defineStore('adminPlayableStore', () => {
  /**
   * ---------------------------------------------------------
   * Refresh State
   * ---------------------------------------------------------
   *
   * Timestamp-style refresh key used to trigger refetches in
   * widgets/tables that watch for playable-data changes.
   *
   * Typical flow:
   * - create/edit/delete operation succeeds
   * - refreshPlayableList() updates this key
   * - interested widgets/tables reactively refetch
   */
  const lastPlayableRefresh = ref(Date.now())

  /**
   * ---------------------------------------------------------
   * Management Surface State
   * ---------------------------------------------------------
   *
   * Tracks which primary management table is currently active
   * in the Playables dashboard.
   *
   * This supports the "first-class management surface" model:
   * - the sidebar does not open local browse modals
   * - instead, it activates a dashboard-level table surface
   * - clicking the same tool again toggles that surface off
   *
   * `null` means:
   * - no management table is currently shown
   * - the dashboard remains in summary-only mode
   */
  const activeManagementSurface = ref<
    'classes'
    | 'species'
    | 'stats'
    | 'statModifiers'
    | 'passives'
    | null
  >(null)

  /**
   * ---------------------------------------------------------
   * Canonical Entity Selection State
   * ---------------------------------------------------------
   *
   * Explicit edit targets for canonical playable entity types.
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
  const selectedPassive = ref<PlayablePassiveEditItem | null>(null)

  /**
   * ---------------------------------------------------------
   * Unified Row Selection State
   * ---------------------------------------------------------
   *
   * Selected UI-layer rows for unified multi-context systems.
   *
   * Current systems:
   * - Stat Modifiers
   *   - baseline row
   *   - species modifier row
   *   - class modifier row
   * - Passive Assignments
   *   - species assignment row
   *   - class assignment row
   */
  const selectedStatModifierRow = ref<PlayableStatModifierRow | null>(null)
  const selectedPassiveAssignmentRow =
    ref<PlayablePassiveAssignmentRow | null>(null)

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

  // Create modals
  const showCreateSpeciesModal = ref(false)
  const showCreateClassModal = ref(false)
  const showCreateStatsModal = ref(false)
  const showCreatePassiveModal = ref(false)
  const showCreateStatModifierModal = ref(false)
  const showCreatePassiveAssignmentModal = ref(false)

  // Edit modals
  const showEditSpeciesModal = ref(false)
  const showEditClassModal = ref(false)
  const showEditStatModal = ref(false)
  const showEditPassiveModal = ref(false)
  const showEditStatModifierModal = ref(false)
  const showEditPassiveAssignmentModal = ref(false)

  /**
   * ---------------------------------------------------------
   * Unified System Mode State
   * ---------------------------------------------------------
   *
   * Shared mode state for unified multi-context systems.
   *
   * Stat Modifier contexts:
   * - 'baseline'
   *   global playable stat baseline values
   * - 'species'
   *   species-specific stat modifiers
   * - 'class'
   *   class-specific stat modifiers
   *
   * Passive Assignment contexts:
   * - 'species'
   *   species-to-passive assignments
   * - 'class'
   *   class-to-passive assignments
   *
   * Notes:
   * - Canonical stat definitions remain a separate system.
   * - Canonical passive definitions remain a separate system.
   * - These mode refs help unified create/edit modals understand
   *   which context they should operate in.
   */
  const statModifierMode = ref<'baseline' | 'species' | 'class'>('species')
  const passiveAssignmentMode = ref<'species' | 'class'>('species')

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
   * create/edit/delete operations.
   */
  function refreshPlayableList() {
    lastPlayableRefresh.value = Date.now()
  }

  /**
   * ---------------------------------------------------------
   * Management Surface Actions
   * ---------------------------------------------------------
   *
   * Controls which primary dashboard-level management table is
   * currently visible.
   *
   * Behavior:
   * - clicking a tool for a different surface switches to it
   * - clicking a tool for the currently active surface hides it
   *
   * Example:
   * - active = 'classes'
   * - toggleManagementSurface('species')
   *   => active becomes 'species'
   *
   * - active = 'classes'
   * - toggleManagementSurface('classes')
   *   => active becomes null
   */
  function toggleManagementSurface(
    surface: 'classes' | 'species' | 'stats' | 'statModifiers' | 'passives'
  ) {
    activeManagementSurface.value =
      activeManagementSurface.value === surface ? null : surface
  }

  /**
   * Clears the currently active management surface entirely.
   *
   * Useful if some future flow needs to explicitly return the
   * dashboard to summary-only mode.
   */
  function clearActiveManagementSurface() {
    activeManagementSurface.value = null
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

  function openCreatePassiveModal() {
    showCreatePassiveModal.value = true
    submitError.value = null
  }

  function closeCreatePassiveModal() {
    showCreatePassiveModal.value = false
    submitError.value = null
  }

  /**
   * ---------------------------------------------------------
   * Unified Create Modal Actions
   * ---------------------------------------------------------
   *
   * Opens unified create flows in the requested context.
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

  function openCreatePassiveAssignmentModal(
    mode: 'species' | 'class' = 'species'
  ) {
    passiveAssignmentMode.value = mode
    showCreatePassiveAssignmentModal.value = true
    submitError.value = null
  }

  function closeCreatePassiveAssignmentModal() {
    showCreatePassiveAssignmentModal.value = false
    submitError.value = null
  }

  /**
   * ---------------------------------------------------------
   * Canonical Edit Modal Actions
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

  function openEditPassiveModal(passive: PlayablePassiveEditItem) {
    selectedPassive.value = passive
    showEditPassiveModal.value = true
    submitError.value = null
  }

  function closeEditPassiveModal() {
    showEditPassiveModal.value = false
    selectedPassive.value = null
    submitError.value = null
  }

  /**
   * ---------------------------------------------------------
   * Unified Edit Modal Actions
   * ---------------------------------------------------------
   *
   * Opens unified edit flows using the selected row and
   * synchronizes mode from that row's context.
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

  function openEditPassiveAssignmentModal(row: PlayablePassiveAssignmentRow) {
    selectedPassiveAssignmentRow.value = row
    passiveAssignmentMode.value = row.context
    showEditPassiveAssignmentModal.value = true
    submitError.value = null
  }

  function closeEditPassiveAssignmentModal() {
    showEditPassiveAssignmentModal.value = false
    selectedPassiveAssignmentRow.value = null
    submitError.value = null
  }

  return {
    /**
     * -------------------------------------------------------
     * State
     * -------------------------------------------------------
     */
    lastPlayableRefresh,

    // Management surface state
    activeManagementSurface,

    // Canonical entity selection
    selectedSpecies,
    selectedClass,
    selectedStat,
    selectedPassive,

    // Unified row selection
    selectedStatModifierRow,
    selectedPassiveAssignmentRow,

    // Create modal visibility
    showCreateSpeciesModal,
    showCreateClassModal,
    showCreateStatsModal,
    showCreatePassiveModal,
    showCreateStatModifierModal,
    showCreatePassiveAssignmentModal,

    // Edit modal visibility
    showEditSpeciesModal,
    showEditClassModal,
    showEditStatModal,
    showEditPassiveModal,
    showEditStatModifierModal,
    showEditPassiveAssignmentModal,

    // Unified mode state
    statModifierMode,
    passiveAssignmentMode,

    // Shared async state
    isSubmitting,
    submitError,

    /**
     * -------------------------------------------------------
     * Actions
     * -------------------------------------------------------
     */
    refreshPlayableList,

    // Management surface actions
    toggleManagementSurface,
    clearActiveManagementSurface,

    // Canonical create modal actions
    openCreateSpeciesModal,
    closeCreateSpeciesModal,
    openCreateClassModal,
    closeCreateClassModal,
    openCreateStatsModal,
    closeCreateStatsModal,
    openCreatePassiveModal,
    closeCreatePassiveModal,

    // Unified create modal actions
    openCreateStatModifierModal,
    closeCreateStatModifierModal,
    openCreatePassiveAssignmentModal,
    closeCreatePassiveAssignmentModal,

    // Canonical edit modal actions
    openEditSpeciesModal,
    closeEditSpeciesModal,
    openEditClassModal,
    closeEditClassModal,
    openEditStatModal,
    closeEditStatModal,
    openEditPassiveModal,
    closeEditPassiveModal,

    // Unified edit modal actions
    openEditStatModifierModal,
    closeEditStatModifierModal,
    openEditPassiveAssignmentModal,
    closeEditPassiveAssignmentModal,
  }
})