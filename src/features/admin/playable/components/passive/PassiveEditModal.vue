<template>
  <!--
    =========================================================
    Playable Passive Edit Modal
    =========================================================

    Canonical admin edit surface for playable passive
    definitions.

    Responsibilities:
    - edit mutable passive fields
    - preserve canonical identity fields
    - persist passive updates through Playables-domain services

    Notes:
    - name and slug are canonical identity fields and remain
      read-only during edit
    - assignment relationships are managed separately by class
      and species edit workflows
    - visibility and submission state are controlled by the
      Playables store
  -->
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
      <!--
        ---------------------------------------------------------
        Display Name
        ---------------------------------------------------------
      -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Display Name</label>
        <input
          v-model="form.displayName"
          type="text"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        />
      </div>

      <!--
        ---------------------------------------------------------
        Canonical Identity Fields
        ---------------------------------------------------------

        Internal name and slug are intentionally read-only once a
        passive exists so references remain stable.
      -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs text-gray-500">Internal Name</label>
          <input
            :value="selectedPassive.name"
            type="text"
            disabled
            class="w-full rounded border bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-400"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Slug</label>
          <input
            :value="selectedPassive.slug"
            type="text"
            disabled
            class="w-full rounded border bg-gray-100 px-3 py-2 text-sm text-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-400"
          />
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
          v-model="form.description"
          rows="3"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        />
      </div>

      <!--
        ---------------------------------------------------------
        Effect Fields
        ---------------------------------------------------------
      -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Effect Text</label>
        <textarea
          v-model="form.effectText"
          rows="3"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        />
      </div>

      <div>
        <label class="mb-1 block text-xs text-gray-500">Effect Type</label>
        <input
          v-model="form.effectType"
          type="text"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        />
      </div>

      <!--
        ---------------------------------------------------------
        Sort Order / Active Status
        ---------------------------------------------------------
      -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs text-gray-500">Sort Order</label>
          <input
            v-model.number="form.sortOrder"
            type="number"
            :disabled="store.isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Active</label>
          <label class="flex items-center gap-2">
            <input
              v-model="form.isActive"
              type="checkbox"
              :disabled="store.isSubmitting"
              class="h-4 w-4"
              :true-value="true"
              :false-value="false"
            />
            <span>{{ form.isActive ? 'Yes' : 'No' }}</span>
          </label>
        </div>
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
          class="rounded bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700 dark:text-gray-100 dark:hover:bg-neutral-600"
        >
          Cancel
        </button>

        <button
          type="submit"
          :disabled="!isFormValid || store.isSubmitting"
          class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ store.isSubmitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>

    <div v-else class="text-sm text-gray-500">
      No passive selected.
    </div>
  </AdminModal>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Imports
 * =========================================================
 */
import { computed, reactive, watch } from 'vue'
import { updatePlayablePassive } from '@/features/admin/playable/services/playablePassiveService'
import { useAdminPlayableStore } from '@/features/admin/playable/stores/adminPlayableStore'
import AdminModal from '@/features/admin/shared/components/AdminModal.vue'

/**
 * ---------------------------------------------------------
 * Store
 * ---------------------------------------------------------
 */
const store = useAdminPlayableStore()

/**
 * ---------------------------------------------------------
 * Selected Passive Context
 * ---------------------------------------------------------
 *
 * The selected passive supplies the edit target. Modal
 * visibility is controlled separately by store modal state.
 */
const selectedPassive = computed(() => store.selectedPassive)

/**
 * ---------------------------------------------------------
 * Local Editable Form State
 * ---------------------------------------------------------
 *
 * Local form state prevents direct mutation of the selected
 * store record while the admin edits values.
 */
const form = reactive({
  displayName: '',
  description: '',
  effectText: '',
  effectType: '',
  isActive: true,
  sortOrder: 0,
})

/**
 * ---------------------------------------------------------
 * Watch: Selected Passive
 * ---------------------------------------------------------
 *
 * Synchronizes local editable state whenever the selected
 * passive changes.
 */
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

/**
 * ---------------------------------------------------------
 * Validation
 * ---------------------------------------------------------
 */
const isFormValid = computed(() => {
  return form.displayName.trim().length > 0
})

/**
 * ---------------------------------------------------------
 * Modal Controls
 * ---------------------------------------------------------
 */
function closeModal() {
  if (store.isSubmitting) return

  store.submitError = null
  store.closeEditPassiveModal()
}

/**
 * ---------------------------------------------------------
 * Submit Handler
 * ---------------------------------------------------------
 *
 * Persists mutable passive fields while preserving canonical
 * identity fields such as name and slug.
 */
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
    closeModal()
  } catch (err) {
    console.error(err)
    store.submitError = 'Failed to update passive'
  } finally {
    store.isSubmitting = false
  }
}
</script>