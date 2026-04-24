<template>
  <!--
    =========================================================
    Playable Passive Create Modal
    =========================================================

    Primary admin creation surface for a new playable passive.

    Responsibilities:
    - collect the minimum required passive identity fields
    - auto-generate canonical helper fields from displayName
    - allow manual override of generated name/slug
    - submit the create payload to the backend
  -->
  <AdminModal
    :visible="store.showCreatePassiveModal"
    title="Create Playable Passive"
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
      -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Display Name</label>
        <input
          v-model="form.displayName"
          type="text"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          placeholder="e.g. Night Vision"
        />
      </div>

      <!--
        ---------------------------------------------------------
        Canonical Identity Fields
        ---------------------------------------------------------
      -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs text-gray-500">Internal Name</label>
          <input
            v-model="form.name"
            type="text"
            :disabled="store.isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
            placeholder="e.g. night_vision"
            @input="nameManuallyEdited = true"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Slug</label>
          <input
            v-model="form.slug"
            type="text"
            :disabled="store.isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
            placeholder="e.g. night-vision"
            @input="slugManuallyEdited = true"
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
        Active Status
        ---------------------------------------------------------

        This follows the same alignment and interaction pattern used
        in the other create modals for consistency across admin UI.
      -->
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

        Uses the same button layout and styling pattern as the
        other playable create modals for visual consistency.
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
          :disabled="!isFormValid || store.isSubmitting"
          class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ store.isSubmitting ? 'Creating...' : 'Create Passive' }}
        </button>
      </div>
    </form>
  </AdminModal>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Playable Passive Create Modal
 * =========================================================
 *
 * This modal creates a new playable passive record.
 *
 * Current scope:
 * - displayName
 * - name
 * - slug
 * - description
 * - effectText
 * - effectType
 * - isActive
 *
 * Notes:
 * - `name` and `slug` are auto-generated from displayName until
 *   manually edited by the admin.
 * - backend is expected to generate the canonical `id`
 */

import { computed, reactive, ref, watch } from 'vue'
import { createPlayablePassive } from '@/features/admin/playable/services/playablePassiveService'
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
 * Local Form State
 * ---------------------------------------------------------
 */
const form = reactive({
  displayName: '',
  name: '',
  slug: '',
  description: '',
  effectText: '',
  effectType: '',
  isActive: true,
})

const nameManuallyEdited = ref(false)
const slugManuallyEdited = ref(false)

/**
 * ---------------------------------------------------------
 * Normalization Helpers
 * ---------------------------------------------------------
 *
 * Converts admin-facing display text into canonical helper values
 * for internal name and URL-safe slug fields.
 */
function normalizeToName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_')
    .replace(/[^\w_]/g, '')
}

function normalizeToSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
}

/**
 * ---------------------------------------------------------
 * Auto-Generation Sync
 * ---------------------------------------------------------
 *
 * displayName drives name/slug until those fields are manually
 * edited by the admin.
 */
watch(
  () => form.displayName,
  (val) => {
    if (!nameManuallyEdited.value) {
      form.name = normalizeToName(val)
    }

    if (!slugManuallyEdited.value) {
      form.slug = normalizeToSlug(val)
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
  form.effectText = ''
  form.effectType = ''
  form.isActive = true

  nameManuallyEdited.value = false
  slugManuallyEdited.value = false
}

function closeModal() {
  if (store.isSubmitting) return

  resetForm()
  store.submitError = null
  store.closeCreatePassiveModal()
}

/**
 * ---------------------------------------------------------
 * Submit
 * ---------------------------------------------------------
 */
async function handleCreate() {
  if (!isFormValid.value) return

  store.isSubmitting = true
  store.submitError = null

  try {
    await createPlayablePassive({
      displayName: form.displayName,
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      effectText: form.effectText || null,
      effectType: form.effectType || null,
      isActive: form.isActive,
    })

    store.refreshPlayableList()
    closeModal()
  } catch (error) {
    console.error(error)
    store.submitError = 'Failed to create passive.'
  } finally {
    store.isSubmitting = false
  }
}
</script>