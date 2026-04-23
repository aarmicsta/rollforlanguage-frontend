<template>
  <!--
    =========================================================
    Creature Create Modal
    =========================================================

    Primary Content admin creation surface for a new creature.

    Responsibilities:
    - collect the minimum required creature identity fields
    - collect required creature classification fields
    - auto-generate canonical helper fields from displayName
    - allow manual override of generated name/slug
    - optionally assign tags during initial creation
    - submit the create payload to the backend

    Notes:
    - this mirrors the established Playables create-modal pattern
    - required classification fields are loaded from canonical
      reference tables via backend lookup endpoints
    - tag assignment occurs only after the creature record has
      been successfully created and returned by the backend
    - assignment UI is intentionally collapsed by default to
      preserve a clean, low-friction core create flow
  -->
  <AdminModal
    :visible="store.showCreateCreatureModal"
    title="Create Creature"
    size="4xl"
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
          :disabled="isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          placeholder="e.g. Cave Troll"
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
            :disabled="isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
            placeholder="e.g. cave_troll"
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
            :disabled="isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
            placeholder="e.g. cave-troll"
            @input="slugManuallyEdited = true"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Public / URL-safe form. Uses hyphens.
          </p>
        </div>
      </div>

      <!--
        ---------------------------------------------------------
        Required Classification Fields
        ---------------------------------------------------------

        These fields are required by the creature schema and are
        populated from canonical backend reference lookups.
      -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs text-gray-500">Creature Type</label>
          <select
            v-model="form.creatureTypeId"
            :disabled="isSubmitting || isLoadingReferenceOptions"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          >
            <option value="">Select creature type...</option>
            <option
              v-for="type in availableCreatureTypes"
              :key="type.id"
              :value="type.id"
            >
              {{ type.displayName }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Size Category</label>
          <select
            v-model="form.sizeCategoryId"
            :disabled="isSubmitting || isLoadingReferenceOptions"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          >
            <option value="">Select size category...</option>
            <option
              v-for="size in availableSizeCategories"
              :key="size.id"
              :value="size.id"
            >
              {{ size.displayName }}
            </option>
          </select>
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
          :disabled="isSubmitting"
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
            :disabled="isSubmitting"
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

        When expanded, this section allows the admin to assign
        canonical tags during initial creation.
      -->
      <div class="rounded border dark:border-neutral-700">
        <button
          type="button"
          :disabled="isSubmitting"
          class="flex w-full items-center justify-between px-4 py-3 text-left"
          @click="toggleAssignments"
        >
          <div>
            <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Assignments
            </h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Optionally assign tags during initial creature creation.
            </p>
          </div>

          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ showAssignments ? 'Hide' : 'Show' }}
          </span>
        </button>

        <div
          v-if="showAssignments"
          class="border-t px-4 py-4 dark:border-neutral-700"
        >
          <!--
            The parent owns layout constraints for scrolling so the
            selector component itself remains reusable across contexts.
          -->
          <div class="max-h-72 overflow-y-auto pr-1">
            <CreatureTagAssignmentSelector
              v-model="selectedTagIds"
              :available-tags="availableTags"
              :disabled="isSubmitting"
            />
          </div>
        </div>
      </div>

      <!--
        ---------------------------------------------------------
        Submission / Loading Feedback
        ---------------------------------------------------------
      -->
      <p
        v-if="referenceLoadError"
        class="text-sm text-red-600 dark:text-red-400"
      >
        {{ referenceLoadError }}
      </p>

      <p
        v-if="submitError"
        class="text-sm text-red-600 dark:text-red-400"
      >
        {{ submitError }}
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
          :disabled="isSubmitting"
          class="rounded bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400 dark:bg-neutral-700 dark:text-gray-100 dark:hover:bg-neutral-600"
        >
          Cancel
        </button>

        <button
          type="submit"
          :disabled="isSubmitting || isLoadingReferenceOptions || !isFormValid"
          class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ isSubmitting ? 'Creating...' : 'Create Creature' }}
        </button>
      </div>
    </form>
  </AdminModal>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Creature Create Modal
 * =========================================================
 *
 * This modal creates a new creature record.
 *
 * Current scope:
 * - displayName
 * - name
 * - slug
 * - description
 * - creatureTypeId
 * - sizeCategoryId
 * - isActive
 * - optional initial tag assignment
 *
 * Notes:
 * - `name` and `slug` are auto-generated from displayName until
 *   manually edited by the admin
 * - creatureTypeId and sizeCategoryId are required by schema
 * - backend is expected to generate the canonical `id`
 * - relational tag assignment occurs only after the creature
 *   record has been successfully created and returned
 */

import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useToastStore } from '@/stores/ui/useToastStore'
import CreatureTagAssignmentSelector from '@/features/admin/content/components/tag/CreatureTagAssignmentSelector.vue'
import {
  createCreature,
  getCreatureTypes,
  getSizeCategories,
  updateCreatureTags,
  type CreatureTypeOption,
  type SizeCategoryOption,
} from '@/features/admin/content/services/creatureService'
import { useContentStore } from '@/features/admin/content/stores/contentStore'
import {
  getPlayableTags,
  type PlayableTag,
} from '@/features/admin/playable/services/playableTagService'
import AdminModal from '@/features/admin/shared/components/AdminModal.vue'

/**
 * ---------------------------------------------------------
 * Store / Global Feedback
 * ---------------------------------------------------------
 */
const store = useContentStore()
const toastStore = useToastStore()

/**
 * ---------------------------------------------------------
 * Local Form State
 * ---------------------------------------------------------
 *
 * `name` and `slug` begin as generated helpers derived from
 * displayName, but may be manually overridden before submit.
 */
const form = reactive({
  displayName: '',
  name: '',
  slug: '',
  description: '',
  creatureTypeId: '',
  sizeCategoryId: '',
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
 * Assignment UI State
 * ---------------------------------------------------------
 *
 * These refs support optional tag assignment during the
 * initial creature creation workflow.
 *
 * Design notes:
 * - assignment UI is collapsed by default
 * - selections persist while the modal remains open
 * - selector remains presentational-only; this modal owns
 *   loading and submission flow
 */
const showAssignments = ref(false)

const availableTags = ref<PlayableTag[]>([])
const selectedTagIds = ref<string[]>([])

/**
 * ---------------------------------------------------------
 * Reference Lookup State
 * ---------------------------------------------------------
 *
 * Required reference options used to satisfy schema-valid
 * creature creation.
 */
const availableCreatureTypes = ref<CreatureTypeOption[]>([])
const availableSizeCategories = ref<SizeCategoryOption[]>([])
const isLoadingReferenceOptions = ref(false)
const referenceLoadError = ref('')

/**
 * ---------------------------------------------------------
 * Submission State
 * ---------------------------------------------------------
 */
const isSubmitting = ref(false)
const submitError = ref('')

/**
 * ---------------------------------------------------------
 * loadReferenceOptions
 * ---------------------------------------------------------
 *
 * Loads required classification options and optional tag
 * options for the create modal.
 */
async function loadReferenceOptions() {
  try {
    isLoadingReferenceOptions.value = true
    referenceLoadError.value = ''

    const [creatureTypes, sizeCategories, tags] = await Promise.all([
      getCreatureTypes(),
      getSizeCategories(),
      getPlayableTags(false),
    ])

    availableCreatureTypes.value = creatureTypes
    availableSizeCategories.value = sizeCategories
    availableTags.value = tags
  } catch (error) {
    console.error('Failed to load creature create reference options:', error)

    availableCreatureTypes.value = []
    availableSizeCategories.value = []
    availableTags.value = []
    referenceLoadError.value =
      'Failed to load required creature create options.'
  } finally {
    isLoadingReferenceOptions.value = false
  }
}

onMounted(() => {
  loadReferenceOptions()
})

/**
 * ---------------------------------------------------------
 * Assignment Section Toggle
 * ---------------------------------------------------------
 */
function toggleAssignments() {
  showAssignments.value = !showAssignments.value
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
 *
 * displayName drives name/slug until those fields are manually
 * edited by the admin.
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
    form.slug.trim().length > 0 &&
    form.creatureTypeId.trim().length > 0 &&
    form.sizeCategoryId.trim().length > 0
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
  form.creatureTypeId = ''
  form.sizeCategoryId = ''
  form.isActive = true

  nameManuallyEdited.value = false
  slugManuallyEdited.value = false

  showAssignments.value = false
  selectedTagIds.value = []
  submitError.value = ''
  referenceLoadError.value = ''
}

function closeModal() {
  store.closeCreateCreatureModal()
  resetForm()
}

/**
 * ---------------------------------------------------------
 * Submit
 * ---------------------------------------------------------
 *
 * Create flow:
 * 1. create the core creature record
 * 2. if selected, assign tags via replace-all endpoint
 * 3. refresh the creature table
 * 4. close modal
 * 5. show success toast
 *
 * Important:
 * - tag assignment is optional
 * - assignment call is only made when there is at least one
 *   selected tag ID
 *
 * Current dependency note:
 * - this requires backend POST /admin/creatures to exist
 */
async function handleCreate() {
  if (!isFormValid.value) return

  try {
    isSubmitting.value = true
    submitError.value = ''

    const createdCreature = await createCreature({
      displayName: form.displayName.trim(),
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      creatureTypeId: form.creatureTypeId,
      sizeCategoryId: form.sizeCategoryId,
      isActive: form.isActive,
    })

    if (!createdCreature?.id) {
      throw new Error('Creature creation did not return a valid creature ID.')
    }

    if (selectedTagIds.value.length > 0) {
      await updateCreatureTags(createdCreature.id, {
        tagIds: selectedTagIds.value,
      })
    }

    store.refreshContentList()
    closeModal()
    toastStore.showToast('Creature created successfully.', 'success')
  } catch (error) {
    console.error(error)
    submitError.value = 'Failed to create creature.'
  } finally {
    isSubmitting.value = false
  }
}
</script>