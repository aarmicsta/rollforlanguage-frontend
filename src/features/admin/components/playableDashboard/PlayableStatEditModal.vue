<template>
  <!--
    =========================================================
    Playable Stat Edit Modal
    =========================================================

    Primary admin editing surface for a single canonical
    playable stat record.

    Responsibilities:
    - edit core scalar stat fields
      - displayName
      - description
      - isActive
      - sortOrder
    - show read-only metadata
      - internal name
      - slug
      - updatedAt
    - preserve stats mode context for future stat assignment /
      configuration workflows
  -->
  <AdminModal
    :visible="store.showEditStatModal"
    title="Edit Playable Stat"
    size="5xl"
    @close="closeModal"
  >
    <!--
      Back button:
      Returns the user to the stats table without fully
      resetting the surrounding edit workflow.
    -->
    <div class="mb-4">
      <button
        @click="handleBack"
        class="text-sm text-blue-600 hover:underline"
      >
        ← Back to Stats Table
      </button>
    </div>

    <form
      v-if="editableStat"
      class="space-y-4 text-sm text-gray-800 dark:text-gray-100"
      @submit.prevent="handleSave"
    >
      <!--
        ---------------------------------------------------------
        Mode Toggle
        ---------------------------------------------------------

        This preserves the broader stats workflow direction,
        where stat-related admin flows can pivot between
        Species and Class contexts.

        Current note:
        - canonical stat editing itself is shared
        - the selected mode is not yet submitted to backend
      -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Stat Context</label>
        <div class="inline-flex rounded border dark:border-neutral-700">
          <button
            type="button"
            :class="[
              'px-4 py-2 text-sm transition',
              store.statsMode === 'species'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 dark:bg-neutral-900 dark:text-gray-100'
            ]"
            @click="store.statsMode = 'species'"
          >
            Species
          </button>
          <button
            type="button"
            :class="[
              'px-4 py-2 text-sm transition border-l dark:border-neutral-700',
              store.statsMode === 'class'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 dark:bg-neutral-900 dark:text-gray-100'
            ]"
            @click="store.statsMode = 'class'"
          >
            Class
          </button>
        </div>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Current mode is stored for future stat assignment/configuration flows.
        </p>
      </div>

      <!--
        ---------------------------------------------------------
        Display Name
        ---------------------------------------------------------
      -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Display Name</label>
        <input
          v-model="editableStat.displayName"
          type="text"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ editableStat.slug }}
        </p>
      </div>

      <!--
        ---------------------------------------------------------
        Metadata / Quick-Edit Grid
        ---------------------------------------------------------
      -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-500">Internal Name</p>
          <p>{{ editableStat.name }}</p>
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Active</label>
          <label class="flex items-center gap-2">
            <input
              v-model="editableStat.isActive"
              type="checkbox"
              :disabled="store.isSubmitting"
              class="h-4 w-4"
              :true-value="true"
              :false-value="false"
            />
            <span>{{ editableStat.isActive ? 'Yes' : 'No' }}</span>
          </label>
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Sort Order</label>
          <input
            v-model.number="editableStat.sortOrder"
            type="number"
            :disabled="store.isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          />
        </div>

        <div>
          <p class="text-xs text-gray-500">Last Updated</p>
          <p>{{ formatDate(editableStat.updatedAt) }}</p>
        </div>
      </div>

      <!--
        ---------------------------------------------------------
        Description
        ---------------------------------------------------------
      -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Description</label>
        <textarea
          v-model="editableStat.description"
          rows="5"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        />
      </div>

      <!--
        ---------------------------------------------------------
        Error Feedback
        ---------------------------------------------------------
      -->
      <p
        v-if="store.submitError"
        class="text-sm text-red-600 dark:text-red-400"
      >
        {{ store.submitError }}
      </p>

      <!--
        ---------------------------------------------------------
        Action Buttons
        ---------------------------------------------------------
      -->
      <div class="flex justify-end gap-2 pt-4">
        <button
          type="button"
          @click="closeModal"
          :disabled="store.isSubmitting"
          class="rounded bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400 dark:bg-neutral-700 dark:text-gray-100 dark:hover:bg-neutral-600"
        >
          Cancel
        </button>

        <button
          type="submit"
          :disabled="store.isSubmitting"
          class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ store.isSubmitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>

    <div v-else class="text-sm text-gray-500">
      No stat selected.
    </div>
  </AdminModal>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Playable Stat Edit Modal
 * =========================================================
 *
 * This modal edits a canonical playable stat record.
 *
 * Current fields:
 * - displayName
 * - description
 * - isActive
 * - sortOrder
 *
 * Notes:
 * - works from a local editable copy of the selected stat
 * - does not edit name/slug in this modal
 * - baseline/modifier editing is intentionally deferred
 */

import { ref, watch } from 'vue'
import { useToastStore } from '@/stores/ui/useToastStore'
import AdminModal from '@/features/admin/components/shared/AdminModal.vue'
import { updatePlayableStat } from '@/features/admin/services/playableStatService'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'
import type { PlayableStatEditItem } from '@/features/admin/types/playableTypes'

/**
 * ---------------------------------------------------------
 * Emits
 * ---------------------------------------------------------
 *
 * `back` returns the user from edit view back to the stats
 * table without collapsing the surrounding workflow.
 */
const emit = defineEmits<{
  (e: 'back'): void
}>()

/**
 * ---------------------------------------------------------
 * Store / Local State
 * ---------------------------------------------------------
 */
const store = useAdminPlayableStore()
const editableStat = ref<PlayableStatEditItem | null>(null)
const toastStore = useToastStore()

/**
 * ---------------------------------------------------------
 * Sync selected stat into local editable state
 * ---------------------------------------------------------
 */
watch(
  () => store.selectedStat,
  (value) => {
    editableStat.value = value ? { ...value } : null
  },
  { immediate: true }
)

/**
 * ---------------------------------------------------------
 * Formatting
 * ---------------------------------------------------------
 */
function formatDate(dateStr: string | null) {
  return dateStr ? new Date(dateStr).toLocaleDateString() : '—'
}

/**
 * ---------------------------------------------------------
 * Close / Back
 * ---------------------------------------------------------
 */
function closeModal() {
  store.closeEditStatModal()
  editableStat.value = null
}

function handleBack() {
  store.closeEditStatModal()
  editableStat.value = null
  emit('back')
}

/**
 * ---------------------------------------------------------
 * Submit
 * ---------------------------------------------------------
 */
async function handleSave() {
  if (!editableStat.value) return

  try {
    store.isSubmitting = true
    store.submitError = null

    const updated = await updatePlayableStat(editableStat.value.id, {
      displayName: editableStat.value.displayName,
      description: editableStat.value.description ?? null,
      isActive: editableStat.value.isActive ?? false,
      sortOrder: editableStat.value.sortOrder ?? 0,
    })

    store.selectedStat = {
    ...updated,
    description: updated.description ?? null,
    isActive: updated.isActive ?? false,
    sortOrder: updated.sortOrder ?? 0,
    createdAt: updated.createdAt ?? null,
    updatedAt: updated.updatedAt ?? null,
    }
    store.refreshPlayableList()
    closeModal()
    toastStore.showToast('Playable stat updated successfully.', 'success')
  } catch (error) {
    console.error(error)
    store.submitError = 'Failed to save playable stat changes.'
  } finally {
    store.isSubmitting = false
  }
}
</script>