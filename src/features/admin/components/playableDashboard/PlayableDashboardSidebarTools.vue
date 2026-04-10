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

      <!-- Submenu -->
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

    <!--
      =========================================================
      Sidebar-Scoped Modals (Temporary / Non-Store-Driven)
      =========================================================

      These remain locally mounted for now until the next-stage
      Stats / Passives system and any broader table-flow refactor
      are implemented.
    -->

    <ManageStatsModal
      :visible="isEditStatsModalOpen"
      @close="isEditStatsModalOpen = false"
    />

    <AdminModal
      title="Edit Playable Classes"
      size="5xl"
      :visible="isEditClassesModalOpen"
      @close="isEditClassesModalOpen = false"
    >
      <PlayableClassTable @close="isEditClassesModalOpen = false" />
    </AdminModal>

    <AdminModal
      title="Edit Playable Species"
      size="5xl"
      :visible="isEditSpeciesModalOpen"
      @close="isEditSpeciesModalOpen = false"
    >
      <PlayableSpeciesTable @close="isEditSpeciesModalOpen = false" />
    </AdminModal>

    <AdminModal
      title="Edit Passives"
      :visible="isEditPassivesModalOpen"
      @close="isEditPassivesModalOpen = false"
    >
      <p class="text-gray-700 dark:text-gray-200">
        Placeholder for passive ability glossary.
      </p>
    </AdminModal>
  </div>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Playable Dashboard Sidebar Tools
 * =========================================================
 *
 * Responsibilities:
 * - render Playables-specific sidebar tools
 * - handle submenu expansion/collapse
 * - dispatch user actions to the store or local modal state
 *
 * Notes:
 * - This component is primarily a control surface.
 * - Species/Class create flows are store-driven.
 * - Some table/passive/stat modal flows remain locally mounted
 *   as transitional behavior until their dedicated systems are built.
 */

import { ref, computed, inject } from 'vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import PlayableClassTable from '@/features/admin/components/playableDashboard/PlayableClassTable.vue'
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

/**
 * ---------------------------------------------------------
 * Theme Injection
 * ---------------------------------------------------------
 */
const dashboardThemeRef = inject<import('vue').ComputedRef<DashboardTheme | undefined>>('dashboardTheme')
const accentValue = dashboardThemeRef?.value?.accentValue ?? '#3b82f6'

/**
 * ---------------------------------------------------------
 * Store / Auth
 * ---------------------------------------------------------
 */
const store = useAdminPlayableStore()
const { user } = useAuth()
const userRole = user.value?.roles?.[0] === 'superadmin' ? 'superadmin' : 'admin'

/**
 * ---------------------------------------------------------
 * Tool Filtering
 * ---------------------------------------------------------
 */
const tools = computed(() =>
  adminPlayableDashboardTools.filter(tool =>
    !tool.roles || tool.roles.includes(userRole)
  )
)

/**
 * ---------------------------------------------------------
 * Submenu State
 * ---------------------------------------------------------
 */
const openSubmenu = ref<string | null>(null)

function toggleSubmenu(tool: AdminDashboardTool) {
  if (!tool.children) {
    handleAction(tool.action)
    return
  }
  openSubmenu.value = openSubmenu.value === tool.name ? null : tool.name
}

/**
 * ---------------------------------------------------------
 * Local Modal State (Transitional)
 * ---------------------------------------------------------
 */
const isEditClassesModalOpen = ref(false)
const isEditSpeciesModalOpen = ref(false)
const isEditStatsModalOpen = ref(false)
const isEditPassivesModalOpen = ref(false)

/**
 * ---------------------------------------------------------
 * Action Dispatcher
 * ---------------------------------------------------------
 *
 * Routes sidebar actions to:
 * - store-driven modal flows (create)
 * - local modal state (current edit/stats/passives placeholders)
 */
function handleAction(action?: string) {
  if (!action) return

  switch (action) {
    case 'createClass':
      store.openCreateClassModal()
      break

    case 'createSpecies':
      store.openCreateSpeciesModal()
      break

    case 'createStats':
      store.openCreateStatsModal()
      break

    case 'createPassives':
      isEditPassivesModalOpen.value = true
      break

    case 'editClasses':
      isEditClassesModalOpen.value = true
      break

    case 'editSpecies':
      isEditSpeciesModalOpen.value = true
      break

    case 'editStats':
      isEditStatsModalOpen.value = true
      break

    case 'editPassives':
      isEditPassivesModalOpen.value = true
      break

    case 'refreshClasses':
      store.refreshPlayableList()
      break

    // case 'manageTags':
    //   emit('openTagsModal')
    //   break

    default:
      console.log(`Unhandled action: ${action}`)
  }
}
</script>