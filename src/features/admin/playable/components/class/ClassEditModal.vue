<template>
  <AdminModal
    :visible="store.showEditClassModal"
    title="Edit Playable Class"
    size="5xl"
    @close="closeModal"
  >
    <div class="mb-4">
      <button
        @click="handleBack"
        class="text-sm text-blue-600 hover:underline"
      >
        ← Back to Class Table
      </button>
    </div>

    <form
      v-if="editableClass"
      class="space-y-4 text-sm text-gray-800 dark:text-gray-100"
      @submit.prevent="handleSave"
    >
      <div>
        <label class="mb-1 block text-xs text-gray-500">Display Name</label>
        <input
          v-model="editableClass.displayName"
          type="text"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ editableClass.slug }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-500">Internal Name</p>
          <p>{{ editableClass.name }}</p>
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Active</label>
          <label class="flex items-center gap-2">
            <input
              v-model="editableClass.isActive"
              type="checkbox"
              :disabled="store.isSubmitting"
              class="h-4 w-4"
              :true-value="true"
              :false-value="false"
            />
            <span>{{ editableClass.isActive ? 'Yes' : 'No' }}</span>
          </label>
        </div>

        <div>
          <p class="text-xs text-gray-500">Last Updated</p>
          <p>{{ formatDate(editableClass.updatedAt) }}</p>
        </div>
      </div>

      <div>
        <label class="mb-1 block text-xs text-gray-500">Description</label>
        <textarea
          v-model="editableClass.description"
          rows="5"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        />
      </div>

      <!--
        ---------------------------------------------------------
        Tag Assignments
        ---------------------------------------------------------
      -->
      <PlayableTagAssignmentSelector
        v-model="selectedTagIds"
        :available-tags="availableTags"
        :disabled="store.isSubmitting"
      />

      <!--
        ---------------------------------------------------------
        Passive Assignments
        ---------------------------------------------------------
      -->
      <div class="space-y-2">
        <label class="block text-xs text-gray-500">Passives</label>

        <PlayablePassiveAssignmentSelector
          :available-passives="availablePassives"
          v-model:selectedPassiveIds="selectedPassiveIds"
        />
      </div>

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
          class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ store.isSubmitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>

    <div v-else class="text-sm text-gray-500">
      No class selected.
    </div>
  </AdminModal>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Playable Class Edit Modal
 * =========================================================
 *
 * Responsibilities:
 * - edit scalar fields for a playable class
 * - manage tag assignment for the class
 * - manage passive assignment for the class
 * - submit updates to backend services
 *
 * Notes:
 * - visibility is controlled by adminPlayableStore
 * - selected entity comes from store.selectedClass
 * - local editable copy is used to prevent direct mutation
 * - relational data is loaded independently from scalar fields
 *   and saved through dedicated replace-all endpoints
 */

import { onMounted, ref, watch } from 'vue'
import { useToastStore } from '@/stores/ui/useToastStore'


import PlayablePassiveAssignmentSelector from '@/features/admin/playable/components/passive/PassiveAssignmentSelector.vue'
import PlayableTagAssignmentSelector from '@/features/admin/playable/components/tag/TagAssignmentSelector.vue'
import {
  playableClassService,
  type PlayableClassTag,
  type PlayableClassPassive,
} from '@/features/admin/playable/services/playableClassService'
import {
  getPlayablePassives,
  type PlayablePassive,
} from '@/features/admin/playable/services/playablePassiveService'
import {
  getPlayableTags,
  type PlayableTag,
} from '@/features/admin/playable/services/playableTagService'
import { useAdminPlayableStore } from '@/features/admin/playable/stores/adminPlayableStore'
import type { PlayableClassEditItem } from '@/features/admin/playable/types/playableTypes'
import AdminModal from '@/features/admin/shared/components/AdminModal.vue'

const emit = defineEmits<{
  (e: 'back'): void
}>()

const store = useAdminPlayableStore()
const toastStore = useToastStore()

/**
 * ---------------------------------------------------------
 * Local Editable Scalar State
 * ---------------------------------------------------------
 *
 * Uses a shallow local copy so the modal can edit safely
 * without directly mutating store-selected records.
 */
const editableClass = ref<PlayableClassEditItem | null>(null)

/**
 * ---------------------------------------------------------
 * Tag Assignment State
 * ---------------------------------------------------------
 *
 * - `availableTags`
 *   full master list used by the selector UI
 * - `assignedTags`
 *   resolved currently assigned tags from backend
 * - `selectedTagIds`
 *   ID-only selection model bound to the selector
 */
const selectedTagIds = ref<string[]>([])
const assignedTags = ref<PlayableClassTag[]>([])
const availableTags = ref<PlayableTag[]>([])

/**
 * ---------------------------------------------------------
 * Passive Assignment State
 * ---------------------------------------------------------
 *
 * - `availablePassives`
 *   full master list used by the selector UI
 * - `assignedPassives`
 *   resolved currently assigned passives from backend
 * - `selectedPassiveIds`
 *   ID-only selection model bound to the selector
 */
const selectedPassiveIds = ref<string[]>([])
const assignedPassives = ref<PlayableClassPassive[]>([])
const availablePassives = ref<PlayablePassive[]>([])

/**
 * ---------------------------------------------------------
 * Watch: Selected Class
 * ---------------------------------------------------------
 *
 * Synchronizes local scalar state and relational assignment
 * state whenever the store-selected class changes.
 */
watch(
  () => store.selectedClass,
  async (value) => {
    editableClass.value = value ? { ...value } : null

    if (!value) {
      assignedTags.value = []
      selectedTagIds.value = []
      assignedPassives.value = []
      selectedPassiveIds.value = []
      availableTags.value = []
      availablePassives.value = []
      return
    }

    try {
      if (!availableTags.value.length) {
        await loadAvailableTags()
      }

      if (!availablePassives.value.length) {
        await loadAvailablePassives()
      }

      const tags = await playableClassService.getPlayableClassTags(value.id)
      assignedTags.value = tags
      selectedTagIds.value = tags.map((tag) => tag.id)

      const passives = await playableClassService.getPlayableClassPassives(
        value.id
      )
      assignedPassives.value = passives
      selectedPassiveIds.value = passives.map((passive) => passive.id)
    } catch (error) {
      console.error('Failed to load playable class relational data:', error)
      assignedTags.value = []
      selectedTagIds.value = []
      assignedPassives.value = []
      selectedPassiveIds.value = []
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
    console.error('Failed to load playable tags:', error)
    availableTags.value = []
  }
}

async function loadAvailablePassives() {
  try {
    availablePassives.value = await getPlayablePassives()
  } catch (error) {
    console.error('Failed to load playable passives:', error)
    availablePassives.value = []
  }
}

onMounted(async () => {
  await loadAvailableTags()
  await loadAvailablePassives()
})

function formatDate(dateStr: string | null) {
  return dateStr ? new Date(dateStr).toLocaleDateString() : '—'
}

/**
 * ---------------------------------------------------------
 * Modal Controls
 * ---------------------------------------------------------
 */
function closeModal() {
  store.closeEditClassModal()
  editableClass.value = null
}

function handleBack() {
  store.closeEditClassModal()
  editableClass.value = null
  emit('back')
}

/**
 * ---------------------------------------------------------
 * Save Handler
 * ---------------------------------------------------------
 *
 * Save order:
 * 1. scalar class fields
 * 2. tag assignments
 * 3. passive assignments
 *
 * This mirrors the existing tag-assignment architecture and
 * keeps relational updates parallel and predictable.
 */
async function handleSave() {
  if (!editableClass.value) return

  try {
    store.isSubmitting = true
    store.submitError = null

    const response = await playableClassService.updatePlayableClass(
      editableClass.value.id,
      {
        displayName: editableClass.value.displayName,
        description: editableClass.value.description ?? null,
        isActive: editableClass.value.isActive ?? false,
      }
    )

    await playableClassService.updatePlayableClassTags(
      editableClass.value.id,
      {
        tagIds: selectedTagIds.value,
      }
    )

    await playableClassService.updatePlayableClassPassives(
      editableClass.value.id,
      {
        passiveIds: selectedPassiveIds.value,
      }
    )

    if (response.data) {
      store.setSelectedClass(response.data)
    }

    store.refreshPlayableList()
    closeModal()
    toastStore.showToast('Playable class updated successfully.', 'success')
  } catch (error) {
    console.error(error)
    store.submitError = 'Failed to save playable class changes.'
  } finally {
    store.isSubmitting = false
  }
}
</script>