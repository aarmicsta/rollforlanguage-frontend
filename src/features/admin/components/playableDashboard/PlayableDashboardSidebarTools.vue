<template>
  <div class="flex flex-col gap-4">
    <div v-for="tool in tools" :key="tool.name">
      <!-- Top-level tool button -->
      <button
        :class="[
          'flex w-full items-center justify-between gap-2 rounded px-4 py-2 text-left transition group',
          'bg-white text-black dark:bg-black dark:text-white',
          'border border-transparent hover:ring-4 hover:ring-offset-2 focus:outline-none'
        ]"
        :style="{ '--tw-ring-color': accentValue }"
        @click="toggleSubmenu(tool)"
      >
        <div class="flex items-center gap-2">
          <AppIcon :name="tool.icon" :library="tool.library" />
          <span>{{ tool.name }}</span>
        </div>
        <span v-if="tool.children">▸</span>
      </button>

      <!-- Submenu if tool has children -->
      <div
        v-if="tool.children && openSubmenu === tool.name"
        class="ml-6 mt-2 flex flex-col gap-2"
      >
        <button
          v-for="child in tool.children"
          :key="child.name"
          class="flex items-center gap-2 rounded bg-gray-100 px-3 py-1 text-sm text-black hover:bg-gray-200 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
          @click="handleAction(child.action)"
        >
          <AppIcon :name="child.icon" :library="child.library" />
          <span>{{ child.name }}</span>
        </button>
      </div>
    </div>

    <!-- Functional modals -->
    <PlayableClassModal />
    <PlayableSpeciesEditModal @back="isBrowseSpeciesModalOpen = true" />
    <ManageStatsModal :visible="isManageStatsModalOpen" @close="isManageStatsModalOpen = false" />

    <!-- Placeholder modals -->
    <AdminModal
      title="Browse Classes"
      :visible="isBrowseClassesModalOpen"
      @close="isBrowseClassesModalOpen = false"
      size="5xl"
    >
      <p class="text-gray-700 dark:text-gray-200">Coming soon: fully featured class table.</p>
    </AdminModal>

    <AdminModal
      title="Browse Species"
      :visible="isBrowseSpeciesModalOpen"
      @close="isBrowseSpeciesModalOpen = false"
      size="5xl"
    >
      <PlayableSpeciesTable @close="isBrowseSpeciesModalOpen = false" />
    </AdminModal>

    <AdminModal
      title="Manage Passives"
      :visible="isManagePassivesModalOpen"
      @close="isManagePassivesModalOpen = false"
    >
      <p class="text-gray-700 dark:text-gray-200">Placeholder for passive ability glossary.</p>
    </AdminModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import ManageStatsModal from '@/features/admin/components/playableDashboard/ManageStatsModal.vue'
import PlayableClassModal from '@/features/admin/components/playableDashboard/PlayableClassModal.vue'
import PlayableSpeciesEditModal from '@/features/admin/components/playableDashboard/PlayableSpeciesEditModal.vue'
import PlayableSpeciesTable from '@/features/admin/components/playableDashboard/PlayableSpeciesTable.vue'
import AdminModal from '@/features/admin/components/shared/AdminModal.vue'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'
import type { AdminDashboardTool } from '@/features/admin/utils/adminDashboardTools'
import { adminPlayableDashboardTools } from '@/features/admin/utils/adminPlayableDashboardTools'
import type { DashboardTheme } from '@/features/admin/utils/dashboardThemes'
import { useAuth } from '@/features/auth/hooks/useAuth'

const emit = defineEmits<{
  (e: 'openTagsModal'): void
}>()

// 🎨 Theme injection
const dashboardThemeRef = inject<import('vue').ComputedRef<DashboardTheme | undefined>>('dashboardTheme')
const accentValue = dashboardThemeRef?.value?.accentValue ?? '#3b82f6'

// 🧠 Auth logic
const store = useAdminPlayableStore()
const { user } = useAuth()
const userRole = user.value?.roles?.[0] === 'superadmin' ? 'superadmin' : 'admin'

// 📜 Filtered sidebar tools
const tools = computed(() =>
  adminPlayableDashboardTools.filter(tool =>
    !tool.roles || tool.roles.includes(userRole)
  )
)

const openSubmenu = ref<string | null>(null)
function toggleSubmenu(tool: AdminDashboardTool) {
  if (!tool.children) {
    handleAction(tool.action)
    return
  }
  openSubmenu.value = openSubmenu.value === tool.name ? null : tool.name
}

// 📦 Modal states
const isBrowseClassesModalOpen = ref(false)
const isBrowseSpeciesModalOpen = ref(false)
const isManageStatsModalOpen = ref(false)
const isManagePassivesModalOpen = ref(false)

// 🚦 Action dispatcher
function handleAction(action?: string) {
  if (!action) return
  switch (action) {
    case 'createClass':
      store.showCreateModal = true
      break
    case 'browseClasses':
      isBrowseClassesModalOpen.value = true
      break
    case 'refreshClasses':
      store.refreshPlayableList()
      break
    case 'browseSpecies':
      isBrowseSpeciesModalOpen.value = true
      break
    case 'manageStats':
      isManageStatsModalOpen.value = true
      break
    case 'managePassives':
      isManagePassivesModalOpen.value = true
      break
    case 'manageTags': // ✅ Unified tag management
      emit('openTagsModal')
      break
    default:
      console.log(`Unhandled action: ${action}`)
  }
}
</script>