<template>
  <!--
    =========================================================
    Creature Create Modal
    =========================================================

    Primary Content admin creation surface for a new creature.

    Responsibilities:
    - collect required creature identity fields
    - collect required creature classification fields
    - auto-generate canonical helper fields from displayName
    - allow manual override of generated name/slug
    - optionally assign tags during initial creation
    - optionally assign base stats during initial creation
    - submit the create payload to the backend

    Notes:
    - mirrors the established Playables create-modal pattern
    - visibility is controlled by the Content store
    - shared submission state is owned by the Content store
    - optional tag/base stat assignment occurs only after the
      creature record has been successfully created
  -->
  <AdminModal
    :visible="store.showCreateCreatureModal"
    title="Create Creature"
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
          :disabled="isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          placeholder="e.g. Cave Troll"
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
        Optional Tags
        ---------------------------------------------------------
      -->
      <div class="rounded border dark:border-neutral-700">
        <button
          type="button"
          :disabled="isSubmitting"
          class="flex w-full items-center justify-between px-4 py-3 text-left"
          @click="toggleTagAssignment"
        >
          <div>
            <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Optional Tags
            </h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Assign canonical tags during initial creature creation.
            </p>
          </div>

          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ showTagAssignment ? 'Hide' : 'Show' }}
          </span>
        </button>

        <div
          v-if="showTagAssignment"
          class="border-t px-4 py-4 dark:border-neutral-700"
        >
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
        Optional Base Stats
        ---------------------------------------------------------
      -->
      <div class="rounded border dark:border-neutral-700">
        <button
          type="button"
          :disabled="isSubmitting"
          class="flex w-full items-center justify-between px-4 py-3 text-left"
          @click="toggleBaseStats"
        >
          <div>
            <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Optional Base Stats
            </h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Set initial base stat values for this creature.
            </p>
          </div>

          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ showBaseStats ? 'Hide' : 'Show' }}
          </span>
        </button>

        <div
          v-if="showBaseStats"
          class="border-t px-4 py-4 dark:border-neutral-700"
        >
          <div class="max-h-72 overflow-y-auto pr-1">
            <div
              v-for="stat in baseStatRows"
              :key="stat.statId"
              class="grid grid-cols-1 gap-3 border-b py-3 last:border-b-0 dark:border-neutral-700 md:grid-cols-[1fr_10rem]"
            >
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-100">
                  {{ stat.statDisplayName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ stat.statSlug }}
                </p>
              </div>

              <div>
                <label class="mb-1 block text-xs text-gray-500">
                  Base Value
                </label>
                <input
                  v-model.number="stat.baseValue"
                  type="number"
                  step="1"
                  :disabled="isSubmitting"
                  class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
                  placeholder="—"
                />
              </div>
            </div>

            <p
              v-if="!baseStatRows.length"
              class="text-sm text-gray-500 dark:text-gray-400"
            >
              No canonical stats available.
            </p>
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
 * Creates a new creature record and optionally attaches
 * initial relational data after creation.
 *
 * Current scope:
 * - creature identity
 * - required creature classification
 * - active status
 * - optional tag assignment
 * - optional base stat assignment
 *
 * Architectural Notes:
 * - visibility is controlled by the Content store
 * - submission/error state is owned by the Content store
 * - reference data is loaded locally because it is modal-specific
 * - tag/base stat assignment occurs after the creature exists
 */

import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useToastStore } from '@/stores/ui/useToastStore'
import CreatureTagAssignmentSelector from '@/features/admin/content/components/tag/CreatureTagAssignmentSelector.vue'
import {
  createCreature,
  getCreatureTypes,
  getSizeCategories,
  updateCreatureBaseStats,
  updateCreatureTags,
  type CreatureBaseStatEditRow,
  type CreatureTypeOption,
  type SizeCategoryOption,
} from '@/features/admin/content/services/creatureService'
import { useContentStore } from '@/features/admin/content/stores/contentStore'
import {
  getPlayableStats,
  type PlayableStat,
} from '@/features/admin/playable/services/playableStatService'
import {
  getPlayableTags,
  type PlayableTag,
} from '@/features/admin/playable/services/playableTagService'
import AdminModal from '@/features/admin/shared/components/AdminModal.vue'

/**
 * ---------------------------------------------------------
 * Stores
 * ---------------------------------------------------------
 *
 * `store`
 * - owns shared Content dashboard state
 * - controls modal visibility
 * - owns shared submission/error state
 *
 * `toastStore`
 * - displays global success/error feedback
 */
const store = useContentStore()
const toastStore = useToastStore()

/**
 * ---------------------------------------------------------
 * Shared Submission State
 * ---------------------------------------------------------
 *
 * Mirrors Content store-owned submission state into this
 * modal for template readability.
 */
const isSubmitting = computed(() => store.isSubmitting)
const submitError = computed(() => store.submitError)

/**
 * ---------------------------------------------------------
 * Creature Identity Form State
 * ---------------------------------------------------------
 *
 * Local create-form state for required creature identity and
 * classification fields.
 *
 * Notes:
 * - displayName drives automatic name/slug generation
 * - name and slug may be manually overridden
 * - creatureTypeId and sizeCategoryId are required
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
 * ---------------------------------------------------------
 * Manual Identity Override Flags
 * ---------------------------------------------------------
 *
 * Prevent automatic name/slug generation from overwriting
 * deliberate user edits.
 */
const nameManuallyEdited = ref(false)
const slugManuallyEdited = ref(false)

/**
 * ---------------------------------------------------------
 * Optional Section Visibility
 * ---------------------------------------------------------
 *
 * Controls collapsed/expanded state for optional create-time
 * assignment sections.
 */
const showTagAssignment = ref(false)
const showBaseStats = ref(false)

/**
 * ---------------------------------------------------------
 * Tag Assignment State
 * ---------------------------------------------------------
 *
 * `availableTags`
 * - canonical tag options loaded from the Playables tag service
 *
 * `selectedTagIds`
 * - selected tag IDs to attach after creature creation
 */
const availableTags = ref<PlayableTag[]>([])
const selectedTagIds = ref<string[]>([])

/**
 * ---------------------------------------------------------
 * Base Stat Assignment State
 * ---------------------------------------------------------
 *
 * Editable base stat rows generated from canonical stat
 * definitions.
 *
 * Notes:
 * - only entered numeric values are submitted
 * - blank/null values are treated as unassigned
 */
const baseStatRows = ref<CreatureBaseStatEditRow[]>([])

/**
 * ---------------------------------------------------------
 * Classification Reference State
 * ---------------------------------------------------------
 *
 * Canonical option sets used by required classification
 * selectors.
 */
const availableCreatureTypes = ref<CreatureTypeOption[]>([])
const availableSizeCategories = ref<SizeCategoryOption[]>([])

/**
 * ---------------------------------------------------------
 * Reference Loading State
 * ---------------------------------------------------------
 *
 * Tracks reference option loading separately from submission.
 */
const isLoadingReferenceOptions = ref(false)
const referenceLoadError = ref('')

/**
 * ---------------------------------------------------------
 * Load Reference Options
 * ---------------------------------------------------------
 *
 * Loads all reference data required by the create modal:
 * - creature types
 * - size categories
 * - playable tags
 * - playable stats
 *
 * Notes:
 * - creature type and size are required for create
 * - tags and base stats are optional post-create assignments
 * - failures clear local option arrays to prevent stale UI
 */
async function loadReferenceOptions() {
  try {
    isLoadingReferenceOptions.value = true
    referenceLoadError.value = ''

    const [creatureTypes, sizeCategories, tags, stats] = await Promise.all([
      getCreatureTypes(),
      getSizeCategories(),
      getPlayableTags(false),
      getPlayableStats(),
    ])

    availableCreatureTypes.value = creatureTypes
    availableSizeCategories.value = sizeCategories
    availableTags.value = tags
    baseStatRows.value = stats.map((stat: PlayableStat) => ({
      statId: stat.id,
      statName: stat.name,
      statSlug: stat.slug,
      statDisplayName: stat.displayName,
      baseValue: null,
      sortOrder: stat.sortOrder ?? null,
    }))
  } catch (error) {
    console.error('Failed to load creature create reference options:', error)

    availableCreatureTypes.value = []
    availableSizeCategories.value = []
    availableTags.value = []
    baseStatRows.value = []
    referenceLoadError.value =
      'Failed to load required creature create options.'
  } finally {
    isLoadingReferenceOptions.value = false
  }
}

/**
 * ---------------------------------------------------------
 * Lifecycle
 * ---------------------------------------------------------
 *
 * Load create-modal reference options when the modal component
 * is mounted.
 */
onMounted(() => {
  loadReferenceOptions()
})

/**
 * ---------------------------------------------------------
 * Optional Section Toggles
 * ---------------------------------------------------------
 */
function toggleTagAssignment() {
  showTagAssignment.value = !showTagAssignment.value
}

function toggleBaseStats() {
  showBaseStats.value = !showBaseStats.value
}

/**
 * ---------------------------------------------------------
 * Name Normalization
 * ---------------------------------------------------------
 *
 * Converts display labels into canonical internal names.
 *
 * Example:
 * - "Cave Troll" -> "cave_troll"
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

/**
 * ---------------------------------------------------------
 * Slug Normalization
 * ---------------------------------------------------------
 *
 * Converts display labels into URL-safe slugs.
 *
 * Example:
 * - "Cave Troll" -> "cave-troll"
 */
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
 * Watch: Display Name
 * ---------------------------------------------------------
 *
 * Auto-generates name and slug while preserving manual
 * overrides once the user edits either field directly.
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
 * Form Validity
 * ---------------------------------------------------------
 *
 * Minimum schema-valid create requirements.
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
 * Reset Form
 * ---------------------------------------------------------
 *
 * Restores create-modal state after close or successful create.
 *
 * Notes:
 * - keeps loaded reference option arrays intact
 * - clears selected optional assignments
 * - resets base stat input values without discarding stat rows
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

  showTagAssignment.value = false
  showBaseStats.value = false

  selectedTagIds.value = []
  baseStatRows.value = baseStatRows.value.map((stat) => ({
    ...stat,
    baseValue: null,
  }))

  store.clearSubmitError()
  referenceLoadError.value = ''
}

/**
 * ---------------------------------------------------------
 * Close Modal
 * ---------------------------------------------------------
 *
 * Closes the create modal and clears local form state.
 */
function closeModal() {
  store.closeCreateCreatureModal()
  resetForm()
}

/**
 * ---------------------------------------------------------
 * Entered Base Stats
 * ---------------------------------------------------------
 *
 * Extracts only intentionally entered numeric base stat values.
 *
 * Notes:
 * - `0` is preserved as a valid intentional value
 * - null/blank/NaN values are omitted
 */
function getEnteredBaseStats() {
  return baseStatRows.value
    .filter(
      (stat) =>
        typeof stat.baseValue === 'number' && !Number.isNaN(stat.baseValue)
    )
    .map((stat) => ({
      statId: stat.statId,
      baseValue: stat.baseValue,
    }))
}

/**
 * ---------------------------------------------------------
 * Create Handler
 * ---------------------------------------------------------
 *
 * Save order:
 * 1. create core creature record
 * 2. optionally attach selected tags
 * 3. optionally attach entered base stats
 *
 * Notes:
 * - relational assignments require the created creature ID
 * - shared submission/error state is owned by the Content store
 * - refresh signal updates Content browse surfaces after success
 */
async function handleCreate() {
  if (!isFormValid.value) return

  try {
    store.setSubmitting(true)
    store.clearSubmitError()

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

    const enteredBaseStats = getEnteredBaseStats()

    if (enteredBaseStats.length > 0) {
      await updateCreatureBaseStats(createdCreature.id, enteredBaseStats)
    }

    store.refreshContentList()
    closeModal()
    toastStore.showToast('Creature created successfully.', 'success')
  } catch (error) {
    console.error(error)
    store.setSubmitError('Failed to create creature.')
  } finally {
    store.setSubmitting(false)
  }
}
</script>