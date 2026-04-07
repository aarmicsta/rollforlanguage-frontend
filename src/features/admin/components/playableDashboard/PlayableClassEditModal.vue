<!-- /src/features/admin/components/playableDashboard/PlayableClassEditModal.vue -->
<template>
  <AdminModal
    :visible="store.showEditModal"
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

      <PlayableTagAssignmentSelector
        v-model="selectedTagIds"
        :available-tags="availableTags"
        :disabled="store.isSubmitting"
      />

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
      No class selected.
    </div>
  </AdminModal>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useToastStore } from '@/stores/ui/useToastStore'
import PlayableTagAssignmentSelector from '@/features/admin/components/playableDashboard/PlayableTagAssignmentSelector.vue'
import AdminModal from '@/features/admin/components/shared/AdminModal.vue'
import {
  playableClassService,
  type PlayableClassTag,
} from '@/features/admin/services/playableClassService'
import {
  getPlayableTags,
  type PlayableTag,
} from '@/features/admin/services/playableTagService'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'
import type { PlayableClassBrowseItem } from '@/features/admin/types/playableTypes'

const emit = defineEmits<{
  (e: 'back'): void
}>()

const store = useAdminPlayableStore()
const editableClass = ref<PlayableClassBrowseItem | null>(null)
const selectedTagIds = ref<string[]>([])
const assignedTags = ref<PlayableClassTag[]>([])
const availableTags = ref<PlayableTag[]>([])

const toastStore = useToastStore()

watch(
  () => store.selectedPlayable,
  async (value) => {
    editableClass.value = value ? { ...value } : null

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

      const tags = await playableClassService.getPlayableClassTags(value.id)
      assignedTags.value = tags
      selectedTagIds.value = tags.map((tag) => tag.id)
    } catch (error) {
      console.error('Failed to load playable class tags:', error)
      assignedTags.value = []
      selectedTagIds.value = []
    }
  },
  { immediate: true }
)

async function loadAvailableTags() {
  try {
    availableTags.value = await getPlayableTags(false)
  } catch (error) {
    console.error('Failed to load playable tags:', error)
    availableTags.value = []
  }
}

onMounted(async () => {
  await loadAvailableTags()
})

function formatDate(dateStr: string | null) {
  return dateStr ? new Date(dateStr).toLocaleDateString() : '—'
}

function closeModal() {
  store.showEditModal = false
  store.selectedPlayable = null
  editableClass.value = null
  store.submitError = null
}

function handleBack() {
  store.showEditModal = false
  editableClass.value = null
  emit('back')
}

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

    if (response.data) {
      store.selectedPlayable = response.data
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