<template>
  <!--
    =========================================================
    Faction Edit Modal
    =========================================================

    Structure-only edit modal for canonical faction records.

    Current scope:
    - display selected faction data
    - validate modal/store wiring
    - close cleanly through Content store state

    Future scope:
    - editable scalar fields
    - alignment selector
    - save/update workflow
    - faction tag assignments
  -->
  <AdminModal
    :visible="store.showEditFactionModal"
    title="Edit Faction"
    size="3xl"
    @close="closeModal"
  >
    <div
      v-if="store.selectedFaction"
      class="space-y-4 text-sm text-gray-100"
    >
      <!-- Identity -->
      <div>
        <p class="text-xs text-gray-400">Display Name</p>
        <input
          v-if="editableFaction"
          v-model="editableFaction.displayName"
          type="text"
          class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
        />
        <p class="mt-1 text-xs text-gray-500">
          {{ store.selectedFaction.slug }}
        </p>
      </div>

      <!-- Details -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-400">Internal Name</p>
          <p>{{ store.selectedFaction.name }}</p>
        </div>

        <div>
          <p class="text-xs text-gray-400">Alignment</p>
          <p>{{ store.selectedFaction.alignment ?? '—' }}</p>
        </div>

        <div>
          <p class="text-xs text-gray-400">Active</p>
          <label class="inline-flex items-center gap-2">
            <input
              v-if="editableFaction"
              type="checkbox"
              v-model="editableFaction.isActive"
              class="rounded border-gray-300 text-blue-600"
            />
            <span>{{ editableFaction?.isActive ? 'Active' : 'Inactive' }}</span>
          </label>
        </div>

        <div>
          <p class="text-xs text-gray-400">Sort Order</p>
          <p>{{ store.selectedFaction.sortOrder ?? '—' }}</p>
        </div>
      </div>

      <!-- Description -->
      <div>
        <p class="text-xs text-gray-400">Description</p>
        <textarea
          v-if="editableFaction"
          v-model="editableFaction.description"
          rows="3"
          class="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100"
        />
      </div>

      <!-- Modal Actions -->
      <div class="flex justify-end gap-2 pt-4">
        <button
          type="button"
          class="rounded bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400 dark:bg-neutral-700 dark:text-gray-100 dark:hover:bg-neutral-600"
          @click="closeModal"
        >
          Cancel
        </button>

        <button
          type="button"
          class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          :disabled="isSubmitting"
          @click="handleSave"
        >
          {{ isSubmitting ? 'Saving...' : 'Save' }}
        </button>
      </div>

      <p v-if="submitError" class="text-sm text-red-500">
        {{ submitError }}
      </p>
    </div>

    <div v-else class="text-sm text-gray-400">
      No faction selected.
    </div>
  </AdminModal>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Imports
 * =========================================================
 */
import { ref, watch } from 'vue'
import { updateFaction } from '@/features/admin/content/services/factionService'
import { useContentStore } from '@/features/admin/content/stores/contentStore'
import AdminModal from '@/features/admin/shared/components/AdminModal.vue'

/**
 * =========================================================
 * Store
 * =========================================================
 *
 * Provides:
 * - selectedFaction (source of truth)
 * - modal visibility state
 */
const store = useContentStore()

/**
 * =========================================================
 * Store
 * =========================================================
 *
 * Provides:
 * - selectedFaction (source of truth)
 * - modal visibility state
 */
const editableFaction = ref<{
  displayName: string
  description: string | null
  isActive: boolean
} | null>(null)

/**
 * =========================================================
 * Submission State
 * =========================================================
 *
 * Tracks save progress and error state for the modal.
 */
const isSubmitting = ref(false)
const submitError = ref('')

/**
 * Sync editable state when selected faction changes
 */
watch(
  () => store.selectedFaction,
  (faction) => {
    if (!faction) {
      editableFaction.value = null
      return
    }

    editableFaction.value = {
      displayName: faction.displayName,
      description: faction.description,
      isActive: faction.isActive ?? false,
    }
  },
  { immediate: true }
)

/**
 * ---------------------------------------------------------
 * Modal Controls
 * ---------------------------------------------------------
 */
function closeModal() {
  store.closeEditFactionModal()
}

/**
 * ---------------------------------------------------------
 * Save Handler
 * ---------------------------------------------------------
 *
 * Persists edited faction data to backend.
 *
 * Flow:
 * editableFaction → API → updated record → store update → close modal
 */
async function handleSave() {
  if (!editableFaction.value || !store.selectedFaction) return

  try {
    isSubmitting.value = true
    submitError.value = ''

    const updated = await updateFaction(store.selectedFaction.id, {
      displayName: editableFaction.value.displayName,
      description: editableFaction.value.description,
      isActive: editableFaction.value.isActive,
    })

    if (updated) {
      store.setSelectedFaction(updated)
      store.refreshContentList?.() // safe optional for now
    }

    closeModal()
  } catch (error) {
    console.error(error)
    submitError.value = 'Failed to save faction changes.'
  } finally {
    isSubmitting.value = false
  }
}
</script>