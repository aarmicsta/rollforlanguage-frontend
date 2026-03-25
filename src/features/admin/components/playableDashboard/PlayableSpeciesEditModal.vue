<template>
  <AdminModal
    :visible="store.showEditModal"
    title="Edit Playable Species"
    size="5xl"
    @close="closeModal"
  >
    <div class="text-sm text-gray-600 dark:text-gray-300">
      Playable Species edit modal coming next.
    </div>
  </AdminModal>
</template>

<script setup lang="ts">
import AdminModal from '@/features/admin/components/shared/AdminModal.vue'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'

const store = useAdminPlayableStore()

function closeModal() {
  store.showEditModal = false
  store.selectedPlayable = null
  store.submitError = null
}
</script>