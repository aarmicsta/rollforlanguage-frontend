<template>
  <!--
    =========================================================
    Creature Edit Modal
    =========================================================

    Primary Content admin editing surface for a single
    creature record.

    Responsibilities:
    - edit core scalar creature fields
    - manage tag assignment for the creature
    - display read-only creature metadata and classifications
    - persist creature edits through Content-domain services

    Notes:
    - visibility is controlled by selectedCreature store state
    - local editable copy is used to prevent direct mutation
    - relational data is loaded by the modal and passed into
      presentational selector components
  -->
  <AdminModal
    :visible="store.showEditCreatureModal"
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
          <label class="mb-1 block text-xs text-gray-500">Creature Type</label>
          <select
            v-model="editableCreature.creatureTypeId"
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
            v-model="editableCreature.sizeCategoryId"
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

        <div>
          <label class="mb-1 block text-xs text-gray-500">Intelligence</label>
          <select
            v-model="editableCreature.intelligenceCategoryId"
            :disabled="isSubmitting || isLoadingReferenceOptions"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          >
            <option :value="null">Unassigned</option>
            <option
              v-for="category in availableIntelligenceCategories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.displayName }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Threat Level</label>
          <select
            v-model="editableCreature.threatLevelId"
            :disabled="isSubmitting || isLoadingReferenceOptions"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          >
            <option :value="null">Unassigned</option>
            <option
              v-for="level in availableThreatLevels"
              :key="level.id"
              :value="level.id"
            >
              {{ level.displayName }}
            </option>
          </select>
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
        Tag Assignment
        ---------------------------------------------------------
      -->
      <CreatureTagAssignmentSelector
        v-model="selectedTagIds"
        :available-tags="availableTags"
        :disabled="isSubmitting"
      />

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
import { computed, onMounted, ref, watch } from 'vue'
import { useToastStore } from '@/stores/ui/useToastStore'
import CreatureTagAssignmentSelector from '@/features/admin/content/components/tag/CreatureTagAssignmentSelector.vue'
import {
  getCreatureTags,
  getCreatureTypes,
  getIntelligenceCategories,
  getSizeCategories,
  getThreatLevels,
  updateCreature,
  updateCreatureTags,
  type CreatureTypeOption,
  type IntelligenceCategoryOption,
  type SizeCategoryOption,
  type ThreatLevelOption,
} from '@/features/admin/content/services/creatureService'
import {
  useContentStore,
  type ContentCreatureRecord,
} from '@/features/admin/content/stores/contentStore'
import {
  getPlayableTags,
  type PlayableTag,
} from '@/features/admin/playable/services/playableTagService'
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
 * Local Editable Scalar State
 * ---------------------------------------------------------
 *
 * Uses a shallow local copy so the modal can edit safely
 * without directly mutating store-selected records.
 */
const editableCreature = ref<ContentCreatureRecord | null>(null)

/**
 * ---------------------------------------------------------
 * Tag Assignment State
 * ---------------------------------------------------------
 *
 * - `availableTags`
 *   full canonical tag list used by the selector UI
 * - `assignedTags`
 *   resolved currently assigned tags from backend
 * - `selectedTagIds`
 *   ID-only selection model bound to the selector
 */
const selectedTagIds = ref<string[]>([])
const assignedTags = ref<PlayableTag[]>([])
const availableTags = ref<PlayableTag[]>([])

/**
 * ---------------------------------------------------------
 * Classification Reference State
 * ---------------------------------------------------------
 *
 * Canonical option sets used by creature classification
 * selectors in the edit workflow.
 *
 * Notes:
 * - creature type and size category are required creature fields
 * - intelligence category and threat level are optional creature fields
 */
const availableCreatureTypes = ref<CreatureTypeOption[]>([])
const availableSizeCategories = ref<SizeCategoryOption[]>([])
const availableIntelligenceCategories = ref<IntelligenceCategoryOption[]>([])
const availableThreatLevels = ref<ThreatLevelOption[]>([])

/**
 * ---------------------------------------------------------
 * Reference Loading State
 * ---------------------------------------------------------
 *
 * Tracks loading state for classification option retrieval.
 */
const isLoadingReferenceOptions = ref(false)

/**
 * ---------------------------------------------------------
 * Watch: Selected Creature
 * ---------------------------------------------------------
 *
 * Synchronizes local scalar state and relational assignment
 * state whenever the store-selected creature changes.
 */
watch(
  () => store.selectedCreature,
  async (value) => {
    editableCreature.value = value ? { ...value } : null
    store.clearSubmitError()

    if (!value) {
      assignedTags.value = []
      selectedTagIds.value = []
      availableTags.value = []
      return
    }

    try {
      if (!availableTags.value.length) {
        await loadAvailableTags()
      }

      await loadAssignedTags(value.id)
    } catch (error) {
      console.error('Failed to synchronize creature tag state:', error)
      assignedTags.value = []
      selectedTagIds.value = []
    }
  },
  { immediate: true }
)

/**
 * ---------------------------------------------------------
 * Reference Data Loading
 * ---------------------------------------------------------
 *
 * Loads the master option sets used by relational selectors.
 */
async function loadAvailableTags() {
  try {
    availableTags.value = await getPlayableTags(false)
  } catch (error) {
    console.error('Failed to load creature tag options:', error)
    availableTags.value = []
  }
}

async function loadAssignedTags(creatureId: string) {
  try {
    const tags: PlayableTag[] = await getCreatureTags(creatureId)
    assignedTags.value = tags
    selectedTagIds.value = tags.map((tag) => tag.id)
  } catch (error) {
    console.error('Failed to load assigned creature tags:', error)
    assignedTags.value = []
    selectedTagIds.value = []
  }
}

/**
 * ---------------------------------------------------------
 * Load Classification Reference Options
 * ---------------------------------------------------------
 *
 * Loads canonical creature classification option sets used by
 * the edit modal.
 *
 * Sources:
 * - creature types
 * - size categories
 * - intelligence categories
 * - threat levels
 *
 * Notes:
 * - failures fall back to empty arrays to prevent modal breakage
 * - validation remains handled by required select bindings and
 *   backend schema expectations
 */
async function loadReferenceOptions() {
  try {
    isLoadingReferenceOptions.value = true

    const [
      creatureTypes,
      sizeCategories,
      intelligenceCategories,
      threatLevels,
    ] = await Promise.all([
      getCreatureTypes(),
      getSizeCategories(),
      getIntelligenceCategories(),
      getThreatLevels(),
    ])

    availableCreatureTypes.value = creatureTypes
    availableSizeCategories.value = sizeCategories
    availableIntelligenceCategories.value = intelligenceCategories
    availableThreatLevels.value = threatLevels
  } catch (error) {
    console.error('Failed to load creature classification options:', error)

    availableCreatureTypes.value = []
    availableSizeCategories.value = []
    availableIntelligenceCategories.value = []
    availableThreatLevels.value = []
  } finally {
    isLoadingReferenceOptions.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    loadAvailableTags(),
    loadReferenceOptions(),
  ])
})

/**
 * ---------------------------------------------------------
 * Formatting
 * ---------------------------------------------------------
 *
 * Lightweight formatter for nullable backend date strings.
 */
function formatDate(dateStr: string | null) {
  return dateStr ? new Date(dateStr).toLocaleDateString() : '—'
}

/**
 * ---------------------------------------------------------
 * Modal Controls
 * ---------------------------------------------------------
 */
function closeModal() {
  store.closeEditCreatureModal()
  editableCreature.value = null
  store.clearSubmitError()
}

function handleBack() {
  closeModal()
  emit('back')
}

/**
 * ---------------------------------------------------------
 * Save Handler
 * ---------------------------------------------------------
 *
 * Save order:
 * 1. scalar creature fields
 * 2. creature tag assignments
 *
 * This mirrors the canonical Playables save pattern:
 * scalar update first, then relational replace-all updates.
 */
async function handleSave() {
  if (!editableCreature.value) return

  try {
    store.setSubmitting(true)
    store.clearSubmitError()

    const updated = await updateCreature(editableCreature.value.id, {
      displayName: editableCreature.value.displayName,
      description: editableCreature.value.description ?? null,
      creatureTypeId: editableCreature.value.creatureTypeId,
      sizeCategoryId: editableCreature.value.sizeCategoryId,
      intelligenceCategoryId:
        editableCreature.value.intelligenceCategoryId || null,
      threatLevelId: editableCreature.value.threatLevelId || null,
      isActive: editableCreature.value.isActive ?? false,
    })

    await updateCreatureTags(editableCreature.value.id, {
      tagIds: selectedTagIds.value,
    })

    if (updated) {
      store.setSelectedCreature(updated)
      editableCreature.value = { ...updated }
      store.refreshContentList()
    }

    closeModal()
    toastStore.showToast('Creature updated successfully.', 'success')
  } catch (error) {
    console.error(error)
    store.setSubmitError('Failed to save creature changes.')
  } finally {
    store.setSubmitting(false)
  }
}
</script>