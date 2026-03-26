import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PlayableSpeciesBrowseItem } from '@/features/admin/types/playableTypes'

export const useAdminPlayableStore = defineStore('adminPlayableStore', () => {
  // 🔄 Widget refresh key
  const lastPlayableRefresh = ref(Date.now())

  // 📦 Selected playable Species (for edit mode)
  const selectedPlayable = ref<PlayableSpeciesBrowseItem | null>(null)

  // 🔘 Modal visibility
  const showCreateModal = ref(false)
  const showEditModal = ref(false)

  // 🚨 Error and loading states
  const isSubmitting = ref(false)
  const submitError = ref<string | null>(null)

  // 🔁 Trigger class list reload
  function refreshPlayableList() {
    lastPlayableRefresh.value = Date.now()
  }

  // 🆕 Open modal to create new class
  function openCreateModal() {
    selectedPlayable.value = null
    showCreateModal.value = true
  }

  // ✏️ Open modal to edit existing class
  function openEditModal(playable: PlayableSpeciesBrowseItem) {
    selectedPlayable.value = playable
    showEditModal.value = true
  }

  return {
    // State
    lastPlayableRefresh,
    selectedPlayable,
    showCreateModal,
    showEditModal,
    isSubmitting,
    submitError,

    // Actions
    refreshPlayableList,
    openCreateModal,
    openEditModal,
  }
})
