<template>
  <AdminModal
    :visible="store.showEditModal"
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
          <p class="text-xs text-gray-500">Active</p>
          <p>
            {{ editableSpecies.isActive ? 'Yes' : 'No' }}
          </p>
        </div>

        <div>
          <p class="text-xs text-gray-500">Sort Order</p>
          <p>{{ editableSpecies.sortOrder ?? '—' }}</p>
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
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        />
      </div>

      <div class="flex justify-end gap-2 pt-4">
        <button
          type="button"
          @click="closeModal"
          class="rounded bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400 dark:bg-neutral-700 dark:text-gray-100 dark:hover:bg-neutral-600"
        >
          Cancel
        </button>

        <button
          type="submit"
          class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </form>

    <div v-else class="text-sm text-gray-500">
      No species selected.
    </div>
  </AdminModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AdminModal from '@/features/admin/components/shared/AdminModal.vue'
import { playableSpeciesService } from '@/features/admin/services/playableSpeciesService'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'
import type { PlayableSpeciesBrowseItem } from '@/features/admin/types/playableTypes'


const emit = defineEmits<{
  (e: 'back'): void
}>()

const store = useAdminPlayableStore()
const editableSpecies = ref<PlayableSpeciesBrowseItem | null>(null)

watch(
  () => store.selectedPlayable,
  (value) => {
    editableSpecies.value = value ? { ...value } : null
  },
  { immediate: true }
)

function formatDate(dateStr: string | null) {
  return dateStr ? new Date(dateStr).toLocaleDateString() : '—'
}

function closeModal() {
  store.showEditModal = false
  store.selectedPlayable = null
  editableSpecies.value = null
  store.submitError = null
}

function handleBack() {
  store.showEditModal = false
  editableSpecies.value = null
  emit('back')
}

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
      }
    )

    if (response.data) {
      store.selectedPlayable = response.data
    }

    store.refreshPlayableList()
    closeModal()
  } catch (error) {
    console.error(error)
    store.submitError = 'Failed to save playable species changes.'
  } finally {
    store.isSubmitting = false
  }
}
</script>