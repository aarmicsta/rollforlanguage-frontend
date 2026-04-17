<template>
  <!--
    =========================================================
    Playable Stat Create Modal
    =========================================================

    Primary admin creation surface for a new canonical playable
    stat definition.

    Responsibilities:
    - collect required stat identity fields
    - auto-generate canonical helper fields from displayName
    - allow manual override of generated name/slug
    - submit the create payload to the backend
  -->
  <AdminModal
    :visible="store.showCreateStatsModal"
    title="Create Playable Stat"
    size="5xl"
    @close="closeModal"
  >
    <form
      class="space-y-4 text-sm text-gray-800 dark:text-gray-100"
      @submit.prevent="handleCreate"
    >
      <!--
        ---------------------------------------------------------
        Display Name
        ---------------------------------------------------------

        Primary admin-facing input. Canonical helper fields are
        generated from this until manually overridden.
      -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Display Name</label>
        <input
          v-model="form.displayName"
          type="text"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          placeholder="e.g. Attack"
        />
      </div>

      <!--
        ---------------------------------------------------------
        Canonical Identity Fields
        ---------------------------------------------------------

        These auto-generate from displayName by default, but may
        be edited manually before submission.
      -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs text-gray-500">Internal Name</label>
          <input
            v-model="form.name"
            type="text"
            :disabled="store.isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
            placeholder="e.g. attack"
            @input="nameManuallyEdited = true"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Canonical internal form. Uses lowercase machine-safe text.
          </p>
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Slug</label>
          <input
            v-model="form.slug"
            type="text"
            :disabled="store.isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
            placeholder="e.g. attack"
            @input="slugManuallyEdited = true"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            URL-safe/public form.
          </p>
        </div>
      </div>

      <!--
        ---------------------------------------------------------
        Optional / Status Fields
        ---------------------------------------------------------
      -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Description</label>
        <textarea
          v-model="form.description"
          rows="5"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          placeholder="Optional description..."
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
          :disabled="store.isSubmitting || !isFormValid"
          class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ store.isSubmitting ? 'Creating...' : 'Create Stat' }}
        </button>
      </div>
    </form>
  </AdminModal>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Playable Stat Create Modal
 * =========================================================
 *
 * This modal creates a new canonical playable stat record.
 *
 * Current scope:
 * - displayName
 * - name
 * - slug
 * - description
 * - isActive
 *
 * Notes:
 * - `name` and `slug` are auto-generated from displayName until
 *   manually edited by the admin.
 * - backend is expected to generate the canonical `id`
 * - canonical stat creation is class/species agnostic
 */

import { computed, reactive, ref, watch } from 'vue'
import { useToastStore } from '@/stores/ui/useToastStore'
import AdminModal from '@/features/admin/components/shared/AdminModal.vue'
import { createPlayableStat } from '@/features/admin/services/playableStatService'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'

/**
 * ---------------------------------------------------------
 * Store / Global Feedback
 * ---------------------------------------------------------
 */
const store = useAdminPlayableStore()
const toastStore = useToastStore()

/**
 * ---------------------------------------------------------
 * Local Form State
 * ---------------------------------------------------------
 */
const form = reactive({
  displayName: '',
  name: '',
  slug: '',
  description: '',
  isActive: true,
})

/**
 * Tracks whether the admin has manually overridden the
 * auto-generated helper fields.
 */
const nameManuallyEdited = ref(false)
const slugManuallyEdited = ref(false)

/**
 * ---------------------------------------------------------
 * Normalization Helpers
 * ---------------------------------------------------------
 */
function normalizeToName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/[^\p{L}\p{N}_]/gu, '')
    .replace(/^_+|_+$/g, '')
}

function normalizeToSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/^-+|-+$/g, '')
}

/**
 * ---------------------------------------------------------
 * Auto-Generation Sync
 * ---------------------------------------------------------
 */
watch(
  () => form.displayName,
  (value) => {
    if (!nameManuallyEdited.value) {
      form.name = normalizeToName(value)
    }

    if (!slugManuallyEdited.value) {
      form.slug = normalizeToSlug(value)
    }
  }
)

/**
 * ---------------------------------------------------------
 * Validation
 * ---------------------------------------------------------
 */
const isFormValid = computed(() => {
  return (
    form.displayName.trim().length > 0 &&
    form.name.trim().length > 0 &&
    form.slug.trim().length > 0
  )
})

/**
 * ---------------------------------------------------------
 * Reset / Close
 * ---------------------------------------------------------
 */
function resetForm() {
  form.displayName = ''
  form.name = ''
  form.slug = ''
  form.description = ''
  form.isActive = true

  nameManuallyEdited.value = false
  slugManuallyEdited.value = false
}

function closeModal() {
  store.closeCreateStatsModal()
  resetForm()
}

/**
 * ---------------------------------------------------------
 * Submit
 * ---------------------------------------------------------
 */
async function handleCreate() {
  if (!isFormValid.value) return

  try {
    store.isSubmitting = true
    store.submitError = null

    await createPlayableStat({
      displayName: form.displayName.trim(),
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      isActive: form.isActive,
    })

    store.refreshPlayableList()
    closeModal()
    toastStore.showToast('Playable stat created successfully.', 'success')
  } catch (error) {
    console.error(error)
    store.submitError = 'Failed to create playable stat.'
  } finally {
    store.isSubmitting = false
  }
}
</script>