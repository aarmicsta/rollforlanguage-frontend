<template>
  <!--
    =========================================================
    Creature Edit Modal
    =========================================================

    Primary Content admin editing surface for a single
    creature record.

    Responsibilities:
    - display and edit core scalar creature fields
    - present read-only creature metadata and classifications
    - persist scalar creature edits to the backend
    - provide canonical modal controls for Content workflows

    Notes:
    - This first-pass modal focuses on scalar-edit parity with
      the Playables system
    - Relational editing (tags, stats, etc.) will be added
      in later iterations
  -->
  <AdminModal
    :visible="!!store.selectedCreature"
    title="Edit Creature"
    size="4xl"
    @close="closeModal"
  >
    <div class="mb-4">
      <button
        @click="handleBack"
        class="text-sm text-blue-600 hover:underline"
      >
        ← Back to Creature Table
      </button>
    </div>

    <form
      v-if="editableCreature"
      class="space-y-4 text-sm text-gray-800 dark:text-gray-100"
      @submit.prevent="handleSave"
    >
      <!--
        ---------------------------------------------------------
        Core Editable Fields
        ---------------------------------------------------------
      -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Display Name</label>
        <input
          v-model="editableCreature.displayName"
          type="text"
          :disabled="isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ editableCreature.slug }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-500">Internal Name</p>
          <p>{{ editableCreature.name }}</p>
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Active</label>
          <label class="flex items-center gap-2">
            <input
              v-model="editableCreature.isActive"
              type="checkbox"
              :disabled="isSubmitting"
              class="h-4 w-4"
              :true-value="true"
              :false-value="false"
            />
            <span>{{ editableCreature.isActive ? 'Yes' : 'No' }}</span>
          </label>
        </div>

        <div>
          <p class="text-xs text-gray-500">Creature Type</p>
          <p>{{ editableCreature.creatureType }}</p>
        </div>

        <div>
          <p class="text-xs text-gray-500">Size Category</p>
          <p>{{ editableCreature.sizeCategory }}</p>
        </div>

        <div>
          <p class="text-xs text-gray-500">Intelligence</p>
          <p>{{ editableCreature.intelligenceCategory ?? '—' }}</p>
        </div>

        <div>
          <p class="text-xs text-gray-500">Threat Level</p>
          <p>{{ editableCreature.threatLevel ?? '—' }}</p>
        </div>

        <div>
          <p class="text-xs text-gray-500">Last Updated</p>
          <p>{{ formatDate(editableCreature.updatedAt) }}</p>
        </div>
      </div>

      <div>
        <label class="mb-1 block text-xs text-gray-500">Description</label>
        <textarea
          v-model="editableCreature.description"
          rows="5"
          :disabled="isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        />
      </div>

      <!--
        ---------------------------------------------------------
        Submission Error
        ---------------------------------------------------------
      -->
      <div v-if="submitError" class="text-sm text-red-500">
        {{ submitError }}
      </div>

      <!--
        ---------------------------------------------------------
        Modal Actions
        ---------------------------------------------------------
      -->
      <div class="flex justify-end gap-2 pt-4">
        <button
          type="button"
          @click="closeModal"
          :disabled="isSubmitting"
          class="rounded bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700 dark:text-gray-100 dark:hover:bg-neutral-600"
        >
          Cancel
        </button>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>

    <div v-else class="text-sm text-gray-500">
      No creature selected.
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
import {
  updateCreature,
} from '@/features/admin/content/services/creatureService'
import {
  useContentStore,
  type ContentCreatureRecord,
} from '@/features/admin/content/stores/contentStore'
import AdminModal from '@/features/admin/shared/components/AdminModal.vue'

/**
 * =========================================================
 * Emits
 * =========================================================
 *
 * Mirrors the canonical Playables edit-modal pattern,
 * allowing the modal to request return to the table view.
 */
const emit = defineEmits<{ (e: 'back'): void }>()

/**
 * =========================================================
 * Store
 * =========================================================
 */
const store = useContentStore()

/**
 * =========================================================
 * Local Editable Scalar State
 * =========================================================
 *
 * Maintains a local editable copy of the selected creature
 * so modal edits do not mutate shared selected-record state
 * directly.
 */
const editableCreature = ref<ContentCreatureRecord | null>(null)

/**
 * =========================================================
 * Submission State
 * =========================================================
 *
 * Local modal submission state for save workflow feedback.
 */
const isSubmitting = ref(false)
const submitError = ref('')

/**
 * =========================================================
 * Sync Selected Creature
 * =========================================================
 *
 * Keeps the local editable copy aligned with the selected
 * creature in shared store state.
 */
watch(
  () => store.selectedCreature,
  (value) => {
    editableCreature.value = value ? { ...value } : null
    submitError.value = ''
  },
  { immediate: true }
)

/**
 * =========================================================
 * Helpers
 * =========================================================
 */
function formatDate(dateStr: string | null) {
  return dateStr ? new Date(dateStr).toLocaleDateString() : '—'
}

/**
 * =========================================================
 * Modal Controls
 * =========================================================
 */
function closeModal() {
  store.clearSelectedCreature()
  editableCreature.value = null
  submitError.value = ''
}

function handleBack() {
  closeModal()
  emit('back')
}

/**
 * =========================================================
 * Save Handler
 * =========================================================
 *
 * Persists scalar creature changes to the backend, then
 * updates the shared selected-creature state with the
 * refreshed response record so the modal reflects the
 * saved canonical data shape.
 */
async function handleSave() {
  if (!editableCreature.value) return

  try {
    isSubmitting.value = true
    submitError.value = ''

    const updated = await updateCreature(editableCreature.value.id, {
      displayName: editableCreature.value.displayName,
      description: editableCreature.value.description ?? null,
      isActive: editableCreature.value.isActive ?? false,
    })

    if (updated) {
      store.setSelectedCreature(updated)
      editableCreature.value = { ...updated }
      store.refreshContentList()
    }

    closeModal()
  } catch (error) {
    console.error(error)
    submitError.value = 'Failed to save creature changes.'
  } finally {
    isSubmitting.value = false
  }
}
</script>