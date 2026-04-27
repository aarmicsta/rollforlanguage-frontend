<template>
  <div class="flex flex-col gap-4">
    <button
      v-for="tool in tools"
      :key="tool.action"
      :class="[
        'group flex w-full items-center gap-2 rounded px-4 py-2 text-left transition',
        'bg-white text-black dark:bg-black dark:text-white',
        'border border-transparent hover:ring-4 hover:ring-offset-2 focus:outline-none',
        isManagementSurfaceAction(tool.action) && isActionActive(tool.action)
          ? 'bg-gray-200 font-medium dark:bg-neutral-800'
          : '',
      ]"
      :style="
        isManagementSurfaceAction(tool.action) && isActionActive(tool.action)
          ? {
              '--tw-ring-color': accentValue,
              borderLeft: `4px solid ${accentValue}`,
            }
          : {
              '--tw-ring-color': accentValue,
              borderLeft: '4px solid transparent',
            }
      "
      type="button"
      @click="handleAction(tool.action)"
    >
      <AppIcon
        :name="getToolIcon(tool.action)"
        library="iconify"
        class="text-lg"
      />
      <span>{{ tool.name }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Content Sidebar Tools
 * =========================================================
 *
 * Responsibilities
 * - render Content-specific sidebar tools
 * - react to active content domain
 * - route sidebar actions into store-controlled workflows
 *
 * Notes
 * - config-driven via contentTools
 * - management-surface actions toggle persistent table views
 * - create actions open store-controlled modal workflows
 * =========================================================
 */

import { computed, inject } from 'vue'
import type { ComputedRef } from 'vue'

import AppIcon from '@/components/atoms/AppIcon.vue'
import { contentTools } from '@/features/admin/content/config/contentTools'
import { useContentStore } from '@/features/admin/content/stores/contentStore'
import type { DashboardTheme } from '@/features/admin/dashboard/config/dashboardThemes'

/**
 * ---------------------------------------------------------
 * Store
 * ---------------------------------------------------------
 */
const store = useContentStore()

/**
 * ---------------------------------------------------------
 * Theme
 * ---------------------------------------------------------
 *
 * Uses the active dashboard theme accent for hover rings and
 * active management-surface indicators.
 */
const dashboardThemeRef =
  inject<ComputedRef<DashboardTheme | undefined>>('dashboardTheme')

const accentValue = dashboardThemeRef?.value?.accentValue ?? '#3b82f6'

/**
 * ---------------------------------------------------------
 * Tool Configuration
 * ---------------------------------------------------------
 *
 * Derives the available sidebar tools from the currently active
 * Content domain.
 */
const tools = computed(() => {
  return contentTools[store.activeContentDomain]
})

/**
 * ---------------------------------------------------------
 * Tool Icons
 * ---------------------------------------------------------
 *
 * Maps Content sidebar actions to Iconify icon names.
 *
 * Notes:
 * - icons are intentionally resolved here rather than stored
 *   in contentTools so the config can remain action-focused
 * - fallback icon prevents blank UI for future tools
 */
function getToolIcon(action: string): string {
  switch (action) {
    case 'createCreature':
    case 'createItem':
      return 'mdi:plus'

    case 'editCreatures':
    case 'editItems':
      return 'mdi:table'

    case 'editCreatureStats':
      return 'mdi:chart-bar'

    default:
      return 'mdi:tools'
  }
}

/**
 * ---------------------------------------------------------
 * Active-State Helpers
 * ---------------------------------------------------------
 *
 * Persistent management-surface tools receive active-state
 * styling when their corresponding Content surface is open.
 *
 * Create actions remain one-off workflow triggers and do not
 * present an active state.
 */
function isManagementSurfaceAction(action: string): boolean {
  return ['editCreatures', 'editCreatureStats', 'editItems'].includes(action)
}

function isActionActive(action: string): boolean {
  switch (action) {
    case 'editCreatures':
      return store.activeManagementSurface === 'creatures'

    case 'editCreatureStats':
      return store.activeManagementSurface === 'creatureStats'

    case 'editItems':
      return store.activeManagementSurface === 'items'

    default:
      return false
  }
}

/**
 * ---------------------------------------------------------
 * Action Handler
 * ---------------------------------------------------------
 *
 * Routes sidebar actions to the Content store.
 *
 * Notes:
 * - table actions toggle management surfaces
 * - implemented create actions open modal workflows
 * - unimplemented Item actions remain logged placeholders
 */
function handleAction(action: string) {
  switch (action) {
    case 'editCreatures':
      store.toggleManagementSurface('creatures')
      break

    case 'editCreatureStats':
      store.toggleManagementSurface('creatureStats')
      break

    case 'editItems':
      store.toggleManagementSurface('items')
      break

    case 'createCreature':
      store.openCreateCreatureModal()
      break

    case 'createItem':
      console.log(`[ContentSidebarTools] create action: ${action}`)
      break

    default:
      console.log(`[ContentSidebarTools] unhandled action: ${action}`)
  }
}
</script>