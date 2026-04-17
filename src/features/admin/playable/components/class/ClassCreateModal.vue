<template>
  <!--
    =========================================================
    Playable Class Create Modal
    =========================================================

    Primary admin creation surface for a new playable class.

    Responsibilities:
    - collect the minimum required class identity fields
    - auto-generate canonical helper fields from displayName
    - allow manual override of generated name/slug
    - optionally assign tags and passives during initial creation
    - submit the create payload to the backend
  -->
  <AdminModal
    :visible="store.showCreateClassModal"
    title="Create Playable Class"
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
          placeholder="e.g. Wizard"
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
            placeholder="e.g. wizard"
            @input="nameManuallyEdited = true"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Canonical internal form. Uses underscores.
          </p>
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Slug</label>
          <input
            v-model="form.slug"
            type="text"
            :disabled="store.isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
            placeholder="e.g. wizard"
            @input="slugManuallyEdited = true"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Public / URL-safe form. Uses hyphens.
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
        Optional Assignments
        ---------------------------------------------------------

        Assignments are intentionally hidden by default so the
        modal preserves a clean, low-friction core create flow.

        When expanded, this section allows the admin to assign:
        - canonical playable tags
        - canonical playable passives

        Accordion behavior:
        - only one assignment panel is open at a time
        - selections persist while the modal remains open
      -->
      <div class="rounded border dark:border-neutral-700">
        <button
          type="button"
          :disabled="store.isSubmitting"
          class="flex w-full items-center justify-between px-4 py-3 text-left"
          @click="toggleAssignments"
        >
          <div>
            <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Assignments
            </h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Optionally assign tags and passives during initial class creation.
            </p>
          </div>

          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ showAssignments ? 'Hide' : 'Show' }}
          </span>
        </button>

        <div
          v-if="showAssignments"
          class="space-y-3 border-t px-4 py-4 dark:border-neutral-700"
        >
          <!--
            -----------------------------------------------------
            Tags Assignment Panel
            -----------------------------------------------------
          -->
          <div class="rounded border dark:border-neutral-700">
            <button
              type="button"
              :disabled="store.isSubmitting"
              class="flex w-full items-center justify-between px-4 py-3 text-left"
              @click="toggleAssignmentPanel('tags')"
            >
              <div>
                <h4 class="text-sm font-medium text-gray-800 dark:text-gray-100">
                  Tags
                </h4>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Select canonical tags to assign to this class.
                </p>
              </div>

              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ openAssignmentPanel === 'tags' ? 'Hide' : 'Show' }}
              </span>
            </button>

            <div
              v-if="openAssignmentPanel === 'tags'"
              class="border-t px-4 py-4 dark:border-neutral-700"
            >
              <!--
                The parent owns layout constraints for scrolling so the
                selector component itself remains reusable across contexts.
              -->
              <div class="max-h-72 overflow-y-auto pr-1">
                <PlayableTagAssignmentSelector
                  v-model="selectedTagIds"
                  :available-tags="availableTags"
                  :disabled="store.isSubmitting"
                />
              </div>
            </div>
          </div>

          <!--
            -----------------------------------------------------
            Passives Assignment Panel
            -----------------------------------------------------
          -->
          <div class="rounded border dark:border-neutral-700">
            <button
              type="button"
              :disabled="store.isSubmitting"
              class="flex w-full items-center justify-between px-4 py-3 text-left"
              @click="toggleAssignmentPanel('passives')"
            >
              <div>
                <h4 class="text-sm font-medium text-gray-800 dark:text-gray-100">
                  Passives
                </h4>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Select canonical passives to assign to this class.
                </p>
              </div>

              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ openAssignmentPanel === 'passives' ? 'Hide' : 'Show' }}
              </span>
            </button>

            <div
              v-if="openAssignmentPanel === 'passives'"
              class="border-t px-4 py-4 dark:border-neutral-700"
            >
              <!--
                The parent owns layout constraints for scrolling so the
                selector component itself remains reusable across contexts.
              -->
              <div class="max-h-72 overflow-y-auto pr-1">
                <PlayablePassiveAssignmentSelector
                  v-model:selectedPassiveIds="selectedPassiveIds"
                  :available-passives="availablePassives"
                  :disabled="store.isSubmitting"
                />
              </div>
            </div>
          </div>
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
          class="rounded bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400 dark:bg-neutral-700 dark:text-gray-100 dark:hover:bg-neutral-600"
        >
          Cancel
        </button>

        <button
          type="submit"
          :disabled="store.isSubmitting || !isFormValid"
          class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ store.isSubmitting ? 'Creating...' : 'Create Class' }}
        </button>
      </div>
    </form>
  </AdminModal>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Playable Class Create Modal
 * =========================================================
 *
 * This modal creates a new playable class record.
 *
 * Current scope:
 * - displayName
 * - name
 * - slug
 * - description
 * - isActive
 * - optional initial tag/passive assignment
 *
 * Notes:
 * - `name` and `slug` are auto-generated from displayName until
 *   manually edited by the admin.
 * - backend is expected to generate the canonical `id`
 * - relational assignment occurs only after the class record has
 *   been successfully created and returned by the backend
 */

import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useToastStore } from '@/stores/ui/useToastStore'


import AdminModal from '@/features/admin/components/shared/AdminModal.vue'
import PlayablePassiveAssignmentSelector from '@/features/admin/playable/components/passive/PassiveAssignmentSelector.vue'
import PlayableTagAssignmentSelector from '@/features/admin/playable/components/tag/TagAssignmentSelector.vue'
import {
  createPlayableClass,
  updatePlayableClassTags,
  updatePlayableClassPassives,
} from '@/features/admin/services/playableClassService'
import type { PlayablePassive } from '@/features/admin/services/playablePassiveService'
import { getPlayablePassives } from '@/features/admin/services/playablePassiveService'
import type { PlayableTag } from '@/features/admin/services/playableTagService'
import { getPlayableTags } from '@/features/admin/services/playableTagService'
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

const nameManuallyEdited = ref(false)
const slugManuallyEdited = ref(false)

/**
 * ---------------------------------------------------------
 * Assignment UI State
 * ---------------------------------------------------------
 *
 * These refs support optional tag/passive assignment during the
 * initial class creation workflow.
 *
 * Design notes:
 * - all assignment UI is collapsed by default
 * - tag/passive selections persist while the modal remains open
 * - selectors remain presentational-only; this modal owns loading
 *   and submission flow
 */
const showAssignments = ref(false)
const openAssignmentPanel = ref<'tags' | 'passives' | null>(null)

const availableTags = ref<PlayableTag[]>([])
const availablePassives = ref<PlayablePassive[]>([])

const selectedTagIds = ref<string[]>([])
const selectedPassiveIds = ref<string[]>([])

/**
 * ---------------------------------------------------------
 * loadAssignmentOptions
 * ---------------------------------------------------------
 *
 * Loads canonical tag and passive options for optional assignment
 * during class creation.
 *
 * Architectural note:
 * - this fetches reference data only
 * - actual class/tag and class/passive relationships are created
 *   only after the class itself has been successfully created
 */
async function loadAssignmentOptions() {
  availableTags.value = await getPlayableTags(false)
  availablePassives.value = await getPlayablePassives()
}

onMounted(() => {
  loadAssignmentOptions()
})

/**
 * ---------------------------------------------------------
 * Assignment Section Toggles
 * ---------------------------------------------------------
 *
 * Controls progressive disclosure for optional assignment UI.
 *
 * Rules:
 * - closing the main Assignments section also closes any open
 *   nested panel
 * - only one nested panel may be open at a time
 * - closing a panel does not clear current selections
 */
function toggleAssignments() {
  showAssignments.value = !showAssignments.value

  if (!showAssignments.value) {
    openAssignmentPanel.value = null
  }
}

function toggleAssignmentPanel(panel: 'tags' | 'passives') {
  openAssignmentPanel.value =
    openAssignmentPanel.value === panel ? null : panel
}

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
 *
 * Resets both scalar form fields and optional assignment state
 * so each modal session starts clean.
 */
function resetForm() {
  form.displayName = ''
  form.name = ''
  form.slug = ''
  form.description = ''
  form.isActive = true

  nameManuallyEdited.value = false
  slugManuallyEdited.value = false

  showAssignments.value = false
  openAssignmentPanel.value = null

  selectedTagIds.value = []
  selectedPassiveIds.value = []
}

function closeModal() {
  store.closeCreateClassModal()
  resetForm()
}

/**
 * ---------------------------------------------------------
 * Submit
 * ---------------------------------------------------------
 *
 * Create flow:
 * 1. create the core playable class record
 * 2. if selected, assign tags via replace-all endpoint
 * 3. if selected, assign passives via replace-all endpoint
 *
 * Important:
 * - tag/passive assignment is optional
 * - assignment calls are only made when there is at least one
 *   selected ID for that relation type
 */
async function handleCreate() {
  if (!isFormValid.value) return

  try {
    store.isSubmitting = true
    store.submitError = null

    const response = await createPlayableClass({
      displayName: form.displayName.trim(),
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      isActive: form.isActive,
    })

    const createdClass = response.data

    if (!createdClass?.id) {
      throw new Error('Playable class creation did not return a valid class ID.')
    }

    if (selectedTagIds.value.length > 0) {
      await updatePlayableClassTags(createdClass.id, {
        tagIds: selectedTagIds.value,
      })
    }

    if (selectedPassiveIds.value.length > 0) {
      await updatePlayableClassPassives(createdClass.id, {
        passiveIds: selectedPassiveIds.value,
      })
    }

    store.refreshPlayableList()
    closeModal()
    toastStore.showToast('Playable class created successfully.', 'success')
  } catch (error) {
    console.error(error)
    store.submitError = 'Failed to create playable class.'
  } finally {
    store.isSubmitting = false
  }
}
</script>