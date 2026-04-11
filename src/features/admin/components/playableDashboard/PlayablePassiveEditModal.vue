<template>
  <AdminModal
    :visible="store.showEditPassiveModal"
    title="Edit Playable Passive"
    size="5xl"
    @close="closeModal"
  >
    <form
      v-if="selectedPassive"
      class="space-y-4 text-sm text-gray-800 dark:text-gray-100"
      @submit.prevent="handleUpdate"
    >
      <!-- Display Name -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Display Name</label>
        <input
          v-model="form.displayName"
          type="text"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2"
        />
      </div>

      <!-- Canonical Identity (read-only on edit) -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs text-gray-500">Internal Name</label>
          <input
            :value="selectedPassive.name"
            type="text"
            disabled
            class="w-full rounded border bg-gray-100 px-3 py-2 text-gray-500 dark:bg-neutral-800 dark:text-gray-400"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Slug</label>
          <input
            :value="selectedPassive.slug"
            type="text"
            disabled
            class="w-full rounded border bg-gray-100 px-3 py-2 text-gray-500 dark:bg-neutral-800 dark:text-gray-400"
          />
        </div>
      </div>

      <!-- Description -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2"
        />
      </div>

      <!-- Effect -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Effect Text</label>
        <textarea
          v-model="form.effectText"
          rows="3"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label class="mb-1 block text-xs text-gray-500">Effect Type</label>
        <input
          v-model="form.effectType"
          type="text"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2"
        />
      </div>

      <!-- Sort / Active -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs text-gray-500">Sort Order</label>
          <input
            v-model.number="form.sortOrder"
            type="number"
            :disabled="store.isSubmitting"
            class="w-full rounded border px-3 py-2"
          />
        </div>

        <div class="flex items-end">
          <label class="flex items-center gap-2">
            <input
              v-model="form.isActive"
              type="checkbox"
              :disabled="store.isSubmitting"
            />
            <span>Active</span>
          </label>
        </div>
      </div>

      <!-- Error -->
      <p v-if="store.submitError" class="text-red-500">
        {{ store.submitError }}
      </p>

      <!-- Actions -->
      <div class="flex justify-end gap-2 pt-4">
        <button type="button" @click="closeModal" :disabled="store.isSubmitting">
          Cancel
        </button>
        <button type="submit" :disabled="!isFormValid || store.isSubmitting">
          {{ store.isSubmitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </AdminModal>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Playable Passive Edit Modal
 * =========================================================
 *
 * Canonical edit surface for playable passive definitions.
 *
 * Responsibilities:
 * - edit mutable passive fields
 * - preserve canonical identity fields
 * - submit updates to backend
 *
 * Notes:
 * - `name` and `slug` are treated as canonical identity fields
 *   and are intentionally read-only during edit
 * - assignment relationships are managed separately
 */

import { computed, reactive, watch } from 'vue'
import AdminModal from '@/features/admin/components/shared/AdminModal.vue'
import { updatePlayablePassive } from '@/features/admin/services/playablePassiveService'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'

const store = useAdminPlayableStore()

const selectedPassive = computed(() => store.selectedPassive)

const form = reactive({
  displayName: '',
  description: '',
  effectText: '',
  effectType: '',
  isActive: true,
  sortOrder: 0,
})

watch(
  selectedPassive,
  (passive) => {
    if (!passive) return

    form.displayName = passive.displayName ?? ''
    form.description = passive.description ?? ''
    form.effectText = passive.effectText ?? ''
    form.effectType = passive.effectType ?? ''
    form.isActive = passive.isActive ?? true
    form.sortOrder = passive.sortOrder ?? 0
  },
  { immediate: true }
)

const isFormValid = computed(() => {
  return form.displayName.trim().length > 0
})

function closeModal() {
  if (store.isSubmitting) return
  store.closeEditPassiveModal()
}

async function handleUpdate() {
  if (!selectedPassive.value || !isFormValid.value) return

  store.isSubmitting = true
  store.submitError = null

  try {
    await updatePlayablePassive(selectedPassive.value.id, {
      displayName: form.displayName.trim(),
      description: form.description.trim() || null,
      effectText: form.effectText.trim() || null,
      effectType: form.effectType.trim() || null,
      isActive: form.isActive,
      sortOrder: form.sortOrder,
    })

    store.refreshPlayableList()
    store.closeEditPassiveModal()
  } catch (err) {
    console.error(err)
    store.submitError = 'Failed to update passive'
  } finally {
    store.isSubmitting = false
  }
}
</script>