<template>
  <div class="flex flex-col gap-4">
    <div v-for="tool in tools" :key="tool.name">
      <!--
        ---------------------------------------------------------
        Top-Level Tool Button
        ---------------------------------------------------------

        Behavior:
        - if the tool has children, clicking toggles the submenu
        - if the tool has no children, clicking dispatches its action
      -->
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

      <!--
        ---------------------------------------------------------
        Submenu
        ---------------------------------------------------------

        Child actions are intentionally thin:
        - they do not own workflow state
        - they dispatch into the Playables store

        Active-state note:
        - only management-surface actions receive persistent
          active styling
        - create actions remain one-off workflow triggers and do
          not present an active state
      -->
      <div
        v-if="tool.children && openSubmenu === tool.name"
        class="ml-6 mt-2 flex flex-col gap-2"
      >
        <button
          v-for="child in tool.children"
          :key="child.name"
          :class="[
            'flex items-center gap-2 rounded px-3 py-1 text-sm transition',
            isManagementSurfaceAction(child.action) && isActionActive(child.action)
              ? 'bg-gray-200 font-medium dark:bg-neutral-800'
              : 'bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600',
            isManagementSurfaceAction(child.action) && isActionActive(child.action)
              ? 'text-black dark:text-white'
              : 'text-black dark:text-white',
          ]"
          :style="
            isManagementSurfaceAction(child.action) && isActionActive(child.action)
              ? { borderLeft: `4px solid ${accentValue}` }
              : { borderLeft: '4px solid transparent' }
          "
          @click="handleAction(child.action)"
        >
          <AppIcon :name="child.icon" :library="child.library" />
          <span>{{ child.name }}</span>
        </button>
      </div>
    </div>
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
 * - dispatch user actions into the Playables store
 *
 * Canonical Architecture Notes:
 * - This component is a control surface only.
 * - It does not mount browse tables or workflow modals locally.
 * - Create actions open store-driven modals.
 * - Edit actions toggle the dashboard-level management surface.
 *
 * This means:
 * - create flows remain modal-based
 * - edit-table access becomes a first-class dashboard surface
 * - modal ownership no longer lives in the sidebar
 */

import { computed, inject, ref } from 'vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import { useAdminPlayableStore } from '@/features/admin/playable/stores/adminPlayableStore'
import type { AdminDashboardTool } from '@/features/admin/utils/adminDashboardTools'
import { adminPlayableDashboardTools } from '@/features/admin/utils/adminPlayableDashboardTools'
import type { DashboardTheme } from '@/features/admin/utils/dashboardThemes'
import { useAuth } from '@/features/auth/hooks/useAuth'

/**
 * ---------------------------------------------------------
 * Theme Injection
 * ---------------------------------------------------------
 *
 * The sidebar consumes the shared dashboard theme so hover/focus
 * accents remain visually consistent with the surrounding admin
 * dashboard shell.
 */
const dashboardThemeRef =
  inject<import('vue').ComputedRef<DashboardTheme | undefined>>(
    'dashboardTheme'
  )

const accentValue = dashboardThemeRef?.value?.accentValue ?? '#3b82f6'

/**
 * ---------------------------------------------------------
 * Store / Auth
 * ---------------------------------------------------------
 *
 * `store`
 * - shared Playables dashboard orchestration state
 *
 * `userRole`
 * - used to filter sidebar tools by role
 */
const store = useAdminPlayableStore()
const { user } = useAuth()
const userRole =
  user.value?.roles?.[0] === 'superadmin' ? 'superadmin' : 'admin'

/**
 * ---------------------------------------------------------
 * Tool Filtering
 * ---------------------------------------------------------
 *
 * Sidebar tools are config-driven and filtered by the current
 * user's role.
 *
 * This keeps the sidebar itself focused on rendering rather than
 * hardcoding role checks throughout the template.
 */
const tools = computed(() =>
  adminPlayableDashboardTools.filter((tool) => {
    return !tool.roles || tool.roles.includes(userRole)
  })
)

/**
 * ---------------------------------------------------------
 * Submenu State
 * ---------------------------------------------------------
 *
 * Tracks which top-level tool group is currently expanded.
 *
 * This is purely local UI state because it affects only the
 * sidebar's presentational behavior and has no cross-component
 * implications.
 */
const openSubmenu = ref<string | null>(null)

/**
 * Handles clicks on top-level tools.
 *
 * Rules:
 * - tools with children toggle their submenu
 * - tools without children dispatch immediately
 */
function toggleSubmenu(tool: AdminDashboardTool) {
  if (!tool.children) {
    handleAction(tool.action)
    return
  }

  openSubmenu.value = openSubmenu.value === tool.name ? null : tool.name
}

/**
 * ---------------------------------------------------------
 * Management Surface Active-State Helpers
 * ---------------------------------------------------------
 *
 * Only edit-table actions correspond to persistent dashboard
 * management surfaces and therefore receive active-state styling.
 */
function isManagementSurfaceAction(action?: string): boolean {
  return [
    'editClasses',
    'editSpecies',
    'editStats',
    'editStatModifiers',
    'editPassives',
  ].includes(action ?? '')
}

function isActionActive(action?: string): boolean {
  switch (action) {
    case 'editClasses':
      return store.activeManagementSurface === 'classes'
    case 'editSpecies':
      return store.activeManagementSurface === 'species'
    case 'editStats':
      return store.activeManagementSurface === 'stats'
    case 'editStatModifiers':
      return store.activeManagementSurface === 'statModifiers'
    case 'editPassives':
      return store.activeManagementSurface === 'passives'
    default:
      return false
  }
}

/**
 * ---------------------------------------------------------
 * Action Dispatcher
 * ---------------------------------------------------------
 *
 * Routes sidebar actions into the Playables store.
 *
 * Architectural split:
 * - Create actions:
 *   open centralized, store-driven modals
 *
 * - Edit actions:
 *   toggle the active dashboard-level management surface
 *
 * - Refresh actions:
 *   trigger the shared refresh signal so widgets/tables refetch
 *
 * Important:
 * - The sidebar no longer owns local modal state
 * - The sidebar no longer mounts browse tables inside AdminModal
 */
function handleAction(action?: string) {
  if (!action) return

  switch (action) {
    /**
     * -------------------------------------------------------
     * Create Actions
     * -------------------------------------------------------
     */
    case 'createClass':
      store.openCreateClassModal()
      break

    case 'createSpecies':
      store.openCreateSpeciesModal()
      break

    case 'createStats':
      store.openCreateStatsModal()
      break

    case 'createStatModifiers':
      store.openCreateStatModifierModal()
      break

    case 'createPassives':
      store.openCreatePassiveModal()
      break

    /**
     * -------------------------------------------------------
     * Edit Surface Actions
     * -------------------------------------------------------
     *
     * These no longer open local browse modals.
     *
     * Instead, they toggle which first-class management table is
     * shown inside the Playables dashboard.
     *
     * Toggle behavior:
     * - clicking a different edit tool switches tables
     * - clicking the currently active tool hides the table
     */
    case 'editClasses':
      store.toggleManagementSurface('classes')
      break

    case 'editSpecies':
      store.toggleManagementSurface('species')
      break

    case 'editStats':
      store.toggleManagementSurface('stats')
      break

    case 'editStatModifiers':
      store.toggleManagementSurface('statModifiers')
      break

    case 'editPassives':
      store.toggleManagementSurface('passives')
      break

    /**
     * -------------------------------------------------------
     * Utility Actions
     * -------------------------------------------------------
     */
    case 'refreshClasses':
      store.refreshPlayableList()
      break

    default:
      console.log(`Unhandled action: ${action}`)
  }
}
</script>