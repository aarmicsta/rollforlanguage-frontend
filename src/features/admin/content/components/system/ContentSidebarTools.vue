<template>
  <div class="flex flex-col gap-4">
    <button
      v-for="tool in tools"
      :key="tool.action"
      class="flex w-full items-center gap-2 rounded px-4 py-2 text-left transition group
             bg-white text-black dark:bg-black dark:text-white
             border border-transparent hover:ring-4 hover:ring-offset-2 focus:outline-none"
      :style="{ '--tw-ring-color': accentValue }"
      type="button"
      @click="handleAction(tool.action)"
    >
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
 *
 * Notes
 * - config-driven (contentTools)
 * - actions are stubbed for now
 * =========================================================
 */

import { computed, inject } from 'vue'
import type { ComputedRef } from 'vue'
import { contentTools } from '@/features/admin/content/config/contentTools'
import { useContentStore } from '@/features/admin/content/stores/contentStore'
import type { DashboardTheme } from '@/features/admin/dashboard/config/dashboardThemes'

// Store
const store = useContentStore()

// Theme (for accent ring)
const dashboardThemeRef =
  inject<ComputedRef<DashboardTheme | undefined>>('dashboardTheme')

const accentValue = dashboardThemeRef?.value?.accentValue ?? '#3b82f6'

// Tools derived from active domain
const tools = computed(() => {
  return contentTools[store.activeContentDomain]
})

// Stub action handler (next step will wire real behavior)
function handleAction(action: string) {
  console.log(`[ContentSidebarTools] action: ${action}`)
}
</script>