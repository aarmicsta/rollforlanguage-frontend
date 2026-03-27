<template>
  <!--
    =========================================================
    Playable Species Edit Modal
    =========================================================

    This modal is the primary admin editing surface for a
    single playable species record.

    Current responsibilities:
    - edit core scalar species fields
      - displayName
      - description
      - isActive
    - show read-only metadata
      - internal name
      - slug
      - updatedAt
    - prepare local state for future relational editing
      - assigned tags
      - selected tag IDs

    Notes:
    - The modal works from a local editable copy of the selected
      species so that the table/store object is not mutated
      directly while the user is editing.
    - Relational editing (tags, passives, stats) will be layered
      in incrementally rather than all at once.
  -->
  <AdminModal
    :visible="store.showEditModal"
    title="Edit Playable Species"
    size="5xl"
    @close="closeModal"
  >
    <!--
      Back button:
      Returns the user to the species browse table without fully
      resetting the surrounding browse/edit workflow.
    -->
    <div class="mb-4">
      <button
        @click="handleBack"
        class="text-sm text-blue-600 hover:underline"
      >
        ← Back to Species Table
      </button>
    </div>

    <!--
      Main edit form:
      Only renders if a species is currently selected and copied
      into local editable state.
    -->
    <form
      v-if="editableSpecies"
      class="space-y-4 text-sm text-gray-800 dark:text-gray-100"
      @submit.prevent="handleSave"
    >
      <!--
        Display Name:
        Primary editable human-facing label for the species.
        The slug is shown beneath it as a stable reference value.
      -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Display Name</label>
        <input
          v-model="editableSpecies.displayName"
          type="text"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ editableSpecies.slug }}
        </p>
      </div>

      <!--
        Metadata / quick-edit grid:
        Mix of read-only informational fields and lightweight
        editable controls.
      -->
      <div class="grid grid-cols-2 gap-4">
        <!--
          Internal canonical name:
          Read-only. Useful for admin reference and debugging,
          but not intended for casual editing in this modal.
        -->
        <div>
          <p class="text-xs text-gray-500">Internal Name</p>
          <p>{{ editableSpecies.name }}</p>
        </div>

        <!--
          Active toggle:
          Editable boolean controlling whether the species is
          currently active/available in the system.
        -->
        <div>
          <label class="mb-1 block text-xs text-gray-500">Active</label>
          <label class="flex items-center gap-2">
            <input
              v-model="editableSpecies.isActive"
              type="checkbox"
              class="h-4 w-4"
              :true-value="true"
              :false-value="false"
            />
            <span>{{ editableSpecies.isActive ? 'Yes' : 'No' }}</span>
          </label>
        </div>

        <!--
          Last Updated:
          Read-only timestamp for quick admin visibility.
        -->
        <div>
          <p class="text-xs text-gray-500">Last Updated</p>
          <p>{{ formatDate(editableSpecies.updatedAt) }}</p>
        </div>
      </div>

      <!--
        Description:
        Multi-line editable narrative/summary field for the species.
      -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Description</label>
        <textarea
          v-model="editableSpecies.description"
          rows="5"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        />
      </div>

      <!--
        Tag assignment:
        Reusable assignment-level selector for applying canonical
        playable tags to this specific species.
      -->
      <PlayableTagAssignmentSelector
        v-model="selectedTagIds"
        :available-tags="availableTags"
      />

      <!--
        Action buttons:
        - Cancel closes and resets the modal
        - Save persists current scalar field edits
      -->
      <div class="flex justify-end gap-2 pt-4">
        <button
          type="button"
          @click="closeModal"
          class="rounded bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400 dark:bg-neutral-700 dark:text-gray-100 dark:hover:bg-neutral-600"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </form>

    <!--
      Empty state:
      Defensive fallback in case the modal opens without a
      selected species.
    -->
    <div v-else class="text-sm text-gray-500">
      No species selected.
    </div>
  </AdminModal>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import PlayableTagAssignmentSelector from '@/features/admin/components/playableDashboard/PlayableTagAssignmentSelector.vue'
import AdminModal from '@/features/admin/components/shared/AdminModal.vue'
import {
  playableSpeciesService,
  type PlayableSpeciesTag,
} from '@/features/admin/services/playableSpeciesService'
import {
  getPlayableTags,
  type PlayableTag,
} from '@/features/admin/services/playableTagService'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'
import type { PlayableSpeciesBrowseItem } from '@/features/admin/types/playableTypes'

/**
 * ---------------------------------------------------------
 * Emits
 * ---------------------------------------------------------
 *
 * `back` is used to return from the edit modal to the browse
 * table modal without fully collapsing the browse/edit flow.
 */
const emit = defineEmits<{
  (e: 'back'): void
}>()

/**
 * ---------------------------------------------------------
 * Store / Local State
 * ---------------------------------------------------------
 *
 * `store` holds shared modal visibility, selection state,
 * and submit/loading/error flags.
 *
 * `editableSpecies` is a local copy of the selected species.
 * This prevents accidental direct mutation of the selected
 * store object while editing.
 *
 * Tag-related local state is split intentionally:
 *
 * `availableTags`
 * - the full canonical tag list available for assignment
 * - loaded once from the shared playable tag reference service
 *
 * `assignedTags`
 * - the full tag objects currently assigned to the selected species
 * - loaded from species-specific assignment endpoints
 */
const store = useAdminPlayableStore()
const editableSpecies = ref<PlayableSpeciesBrowseItem | null>(null)
const selectedTagIds = ref<string[]>([])
const assignedTags = ref<PlayableSpeciesTag[]>([])
const availableTags = ref<PlayableTag[]>([])

/**
 * ---------------------------------------------------------
 * Sync selected species + load relational data
 * ---------------------------------------------------------
 *
 * Whenever the selected playable changes:
 * 1. Copy it into local editable state (scalar fields)
 * 2. Fetch assigned relational data (currently: tags)
 * 3. Normalize relational data into local editing models
 *
 * Scalar sync:
 * - Creates a local copy of the selected species to avoid
 *   mutating shared store state during editing.
 *
 * Relational sync (current: tags):
 * - Fetches assigned tags from the backend
 * - Stores full tag objects in `assignedTags` (display/use)
 * - Stores tag IDs in `selectedTagIds` (editing/persistence)
 *
 * Why this split?
 * - Objects are useful for UI display
 * - IDs are required for backend update payloads
 *
 * Reset behavior:
 * - If no species is selected, all local state is cleared
 * - If fetch fails, relational state is safely reset
 *
 * `immediate: true` ensures the modal initializes correctly
 * when opened with a pre-selected species.
 *
 * Loads the full canonical playable tag list from the shared
 * tag reference service.
 *
 * Important distinction:
 * - this is the full available option pool
 * - it is NOT the same thing as the tags currently assigned
 *   to the selected species
 *
 * The selector UI needs both:
 * - availableTags   -> all assignable options
 * - selectedTagIds  -> current assignment state
 * Future expansion:
 * - This same pattern will be extended for:
 *   - passives
 *   - stat modifiers
 */

watch(
  () => store.selectedPlayable,
  async (value) => {
    editableSpecies.value = value ? { ...value } : null

    if (!value) {
      assignedTags.value = []
      selectedTagIds.value = []
      availableTags.value = []
      return
    }

    try {
      if (!availableTags.value.length) {
        await loadAvailableTags()
      }

      const tags = await playableSpeciesService.getPlayableSpeciesTags(value.id)
      assignedTags.value = tags
      selectedTagIds.value = tags.map((tag) => tag.id)
    } catch (error) {
      console.error('Failed to load playable species tags:', error)
      assignedTags.value = []
      selectedTagIds.value = []
    }
  },
  { immediate: true }
)

async function loadAvailableTags() {
  try {
    availableTags.value = await getPlayableTags(false)
  } catch (error) {
    console.error('Failed to load playable tags:', error)
    availableTags.value = []
  }
}

/**
 * ---------------------------------------------------------
 * Initial reference-data load
 * ---------------------------------------------------------
 *
 * Load shared canonical tag options once when the modal
 * component is mounted.
 *
 * These options are reused as different species are selected,
 * while the assigned tag set is refreshed per selected species
 * inside the watcher.
 */

onMounted(async () => {
  await loadAvailableTags()
})

/**
 * ---------------------------------------------------------
 * formatDate
 * ---------------------------------------------------------
 *
 * Lightweight UI formatter for nullable date strings returned
 * from the backend.
 */
function formatDate(dateStr: string | null) {
  return dateStr ? new Date(dateStr).toLocaleDateString() : '—'
}

/**
 * ---------------------------------------------------------
 * closeModal
 * ---------------------------------------------------------
 *
 * Fully closes and resets the edit modal state.
 *
 * Used when:
 * - the user clicks Cancel
 * - the modal emits a close event
 * - save completes successfully
 *
 * This clears:
 * - modal visibility
 * - selected species in store
 * - local editable copy
 * - submit error state
 *
 * Note:
 * As relational editing expands, this function should also
 * reset any additional local relation state (tags, passives,
 * stats, etc.) to avoid stale modal data between edits.
 */
function closeModal() {
  store.showEditModal = false
  store.selectedPlayable = null
  editableSpecies.value = null
  store.submitError = null
}

/**
 * ---------------------------------------------------------
 * handleBack
 * ---------------------------------------------------------
 *
 * Returns the user from edit view back to the browse view
 * without treating it as a full cancel/reset of the outer
 * flow.
 *
 * This intentionally emits `back` so the parent can reopen
 * the browse table/modal as needed.
 */
function handleBack() {
  store.showEditModal = false
  editableSpecies.value = null
  emit('back')
}

/**
 * ---------------------------------------------------------
 * handleSave
 * ---------------------------------------------------------
 *
 * Persists the currently editable scalar species fields to the
 * backend via the species PATCH endpoint.
 *
 * Current fields saved:
 * - displayName
 * - description
 * - isActive
 *
 * Behavior:
 * 1. enable submitting/loading state
 * 2. clear prior submit error
 * 3. send PATCH request
 * 4. if backend returns updated data, apply it to the store
 * 5. trigger list refresh
 * 6. close the modal
 *
 * Why use returned backend data?
 * - keeps frontend aligned with server-confirmed values
 * - avoids trusting only local form state
 * - prepares for future reduction of unnecessary refetching
 *
 * Note:
 * Tags are not yet saved here. Relational updates will be
 * integrated incrementally once the tag editing UI is wired.
 */
async function handleSave() {
  if (!editableSpecies.value) return

  try {
    store.isSubmitting = true
    store.submitError = null

    const response = await playableSpeciesService.updatePlayableSpecies(
      editableSpecies.value.id,
      {
        displayName: editableSpecies.value.displayName,
        description: editableSpecies.value.description ?? null,
        isActive: editableSpecies.value.isActive ?? false,
      }
    )

    if (response.data) {
      store.selectedPlayable = response.data
    }

    store.refreshPlayableList()
    closeModal()
  } catch (error) {
    console.error(error)
    store.submitError = 'Failed to save playable species changes.'
  } finally {
    store.isSubmitting = false
  }
}
</script>