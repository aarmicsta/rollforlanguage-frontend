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

    <div
      v-if="store.selectedPlayable"
      class="space-y-4 text-sm text-gray-800 dark:text-gray-100"
    >
      <div>
        <h2 class="text-lg font-semibold">
          {{ store.selectedPlayable.displayName }}
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ store.selectedPlayable.slug }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-500">Internal Name</p>
          <p>{{ store.selectedPlayable.name }}</p>
        </div>

        <div>
          <p class="text-xs text-gray-500">Active</p>
          <p>
            {{ store.selectedPlayable.isActive ? 'Yes' : 'No' }}
          </p>
        </div>

        <div>
          <p class="text-xs text-gray-500">Sort Order</p>
          <p>{{ store.selectedPlayable.sortOrder ?? '—' }}</p>
        </div>

        <div>
          <p class="text-xs text-gray-500">Last Updated</p>
          <p>{{ formatDate(store.selectedPlayable.updatedAt) }}</p>
        </div>
      </div>

      <div>
        <p class="text-xs text-gray-500">Description</p>
        <p class="whitespace-pre-line">
          {{ store.selectedPlayable.description || '—' }}
        </p>
      </div>
    </div>

    <div v-else class="text-sm text-gray-500">
      No species selected.
    </div>
  </AdminModal>
</template>

<script setup lang="ts">
import AdminModal from '@/features/admin/components/shared/AdminModal.vue'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'

const emit = defineEmits<{
  (e: 'back'): void
}>()

const store = useAdminPlayableStore()

function formatDate(dateStr: string | null) {
  return dateStr ? new Date(dateStr).toLocaleDateString() : '—'
}

function closeModal() {
  store.showEditModal = false
  store.selectedPlayable = null
  store.submitError = null
}

function handleBack() {
  store.showEditModal = false
  emit('back')
}
</script>