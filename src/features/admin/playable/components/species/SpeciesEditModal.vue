<template>
  <!--
    =========================================================
    Playable Species Edit Modal
    =========================================================

    This modal is the primary admin editing surface for a
    single playable species record.

    Responsibilities:
    - edit core scalar species fields
    - manage tag assignment for the species
    - manage passive assignment for the species
    - display read-only metadata
  -->
  <AdminModal
    :visible="store.showEditSpeciesModal"
    title="Edit Playable Species"
    size="5xl"
    @close="closeModal"
  >
    <div class="mb-4">
      <button
        @click="handleBack"
        class="text-sm text-blue-600 hover:underline"
      >
        ← Back to Species Table
      </button>
    </div>

    <form
      v-if="editableSpecies"
      class="space-y-4 text-sm text-gray-800 dark:text-gray-100"
      @submit.prevent="handleSave"
    >
      <div>
        <label class="mb-1 block text-xs text-gray-500">Display Name</label>
        <input
          v-model="editableSpecies.displayName"
          type="text"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ editableSpecies.slug }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-500">Internal Name</p>
          <p>{{ editableSpecies.name }}</p>
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Active</label>
          <label class="flex items-center gap-2">
            <input
              v-model="editableSpecies.isActive"
              type="checkbox"
              :disabled="store.isSubmitting"
              class="h-4 w-4"
              :true-value="true"
              :false-value="false"
            />
            <span>{{ editableSpecies.isActive ? 'Yes' : 'No' }}</span>
          </label>
        </div>

        <div>
          <p class="text-xs text-gray-500">Last Updated</p>
          <p>{{ formatDate(editableSpecies.updatedAt) }}</p>
        </div>
      </div>

      <div>
        <label class="mb-1 block text-xs text-gray-500">Description</label>
        <textarea
          v-model="editableSpecies.description"
          rows="5"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        />
      </div>

      <!--
        ---------------------------------------------------------
        Tag Assignment
        ---------------------------------------------------------
      -->
      <PlayableTagAssignmentSelector
        v-model="selectedTagIds"
        :available-tags="availableTags"
        :disabled="store.isSubmitting"
      />

      <!--
        ---------------------------------------------------------
        Passive Assignment
        ---------------------------------------------------------
      -->
      <div class="space-y-2">
        <label class="text-xs text-gray-500">Passives</label>

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
          class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ store.isSubmitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>

    <div v-else class="text-sm text-gray-500">
      No species selected.
    </div>
  </AdminModal>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useToastStore } from '@/stores/ui/useToastStore'
import PlayablePassiveAssignmentSelector from '@/features/admin/playable/components/passive/PassiveAssignmentSelector.vue'
import PlayableTagAssignmentSelector from '@/features/admin/playable/components/tag/TagAssignmentSelector.vue'
import {
  getPlayablePassives,
  type PlayablePassive,
} from '@/features/admin/playable/services/playablePassiveService'
import {
  playableSpeciesService,
  type PlayableSpeciesTag,
  type PlayableSpeciesPassive,
} from '@/features/admin/playable/services/playableSpeciesService'

import {
  getPlayableTags,
  type PlayableTag,
} from '@/features/admin/playable/services/playableTagService'
import { useAdminPlayableStore } from '@/features/admin/playable/stores/adminPlayableStore'
import type { PlayableSpeciesEditItem } from '@/features/admin/playable/types/playableTypes'
import AdminModal from '@/features/admin/shared/components/AdminModal.vue'

const emit = defineEmits<{ (e: 'back'): void }>()

const store = useAdminPlayableStore()
const toastStore = useToastStore()

/**
 * ---------------------------------------------------------
 * Local Editable Scalar State
 * ---------------------------------------------------------
 */
const editableSpecies = ref<PlayableSpeciesEditItem | null>(null)

/**
 * ---------------------------------------------------------
 * Tag Assignment State
 * ---------------------------------------------------------
 */
const selectedTagIds = ref<string[]>([])
const assignedTags = ref<PlayableSpeciesTag[]>([])
const availableTags = ref<PlayableTag[]>([])

/**
 * ---------------------------------------------------------
 * Passive Assignment State
 * ---------------------------------------------------------
 */
const selectedPassiveIds = ref<string[]>([])
const assignedPassives = ref<PlayableSpeciesPassive[]>([])
const availablePassives = ref<PlayablePassive[]>([])

/**
 * ---------------------------------------------------------
 * Sync selected species + load relational data
 * ---------------------------------------------------------
 */
watch(
  () => store.selectedSpecies,
  async (value) => {
    editableSpecies.value = value ? { ...value } : null

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

      const tags = await playableSpeciesService.getPlayableSpeciesTags(value.id)
      assignedTags.value = tags
      selectedTagIds.value = tags.map((tag) => tag.id)

      const passives =
        await playableSpeciesService.getPlayableSpeciesPassives(value.id)
      assignedPassives.value = passives
      selectedPassiveIds.value = passives.map((p) => p.id)
    } catch (error) {
      console.error('Failed to load species relational data:', error)
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
  store.closeEditSpeciesModal()
  editableSpecies.value = null
}

function handleBack() {
  store.closeEditSpeciesModal()
  editableSpecies.value = null
  emit('back')
}

/**
 * ---------------------------------------------------------
 * Save Handler
 * ---------------------------------------------------------
 */
async function handleSave() {
  if (!editableSpecies.value) return

  try {
    store.isSubmitting = true
    store.submitError = null

    const response = await playableSpeciesService.updatePlayableSpecies(
      editableSpecies.value.id,
      {
        displayName: editableSpecies.value.displayName,
        description: editableSpecies.value.description ?? null,
        isActive: editableSpecies.value.isActive ?? false,
      }
    )

    await playableSpeciesService.updatePlayableSpeciesTags(
      editableSpecies.value.id,
      {
        tagIds: selectedTagIds.value,
      }
    )

    await playableSpeciesService.updatePlayableSpeciesPassives(
      editableSpecies.value.id,
      {
        passiveIds: selectedPassiveIds.value,
      }
    )

    if (response.data) {
      store.selectedSpecies = response.data
    }

    store.refreshPlayableList()
    closeModal()
    toastStore.showToast('Playable species updated successfully.', 'success')
  } catch (error) {
    console.error(error)
    store.submitError = 'Failed to save playable species changes.'
  } finally {
    store.isSubmitting = false
  }
}
</script>