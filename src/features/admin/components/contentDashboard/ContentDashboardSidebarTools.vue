<template>
  <div class="flex flex-col gap-4">
    <button
      class="flex w-full items-center gap-2 rounded px-4 py-2 text-left transition group
             bg-white text-black dark:bg-black dark:text-white
             border border-transparent hover:ring-4 hover:ring-offset-2 focus:outline-none"
      :style="{ '--tw-ring-color': accentValue }"
      type="button"
    >
      <span>Content Tools (placeholder)</span>
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Content Dashboard Sidebar Tools
 * =========================================================
 *
 * Responsibilities
 * - Placeholder return point for Content-specific sidebar tools
 *
 * Notes
 * - Stub only
 * - No domain-aware tool switching yet
 * =========================================================
 */

import { inject } from 'vue'
import type { ComputedRef } from 'vue'
import type { DashboardTheme } from '@/features/admin/utils/dashboardThemes'

const dashboardThemeRef =
  inject<ComputedRef<DashboardTheme | undefined>>('dashboardTheme')

const accentValue = dashboardThemeRef?.value?.accentValue ?? '#3b82f6'
</script>