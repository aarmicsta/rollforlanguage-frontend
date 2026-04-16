<template>
  <section
    class="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
  >
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-200 dark:border-neutral-700">
      <h1 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Content / {{ activeDomainLabel }}
      </h1>
    </div>

    <!-- Domain Pills -->
    <div class="px-4 py-3 flex flex-wrap items-center gap-3">
      <button
        type="button"
        :class="getPillClasses('creatures')"
        :style="props.activeDomain === 'creatures'
          ? { backgroundColor: accentValue, borderColor: accentValue }
          : {}"
        disabled
      >
        Creatures
      </button>

      <button
        type="button"
        :class="getPillClasses('creatures')"
        :style="props.activeDomain === 'creatures'
          ? { backgroundColor: accentValue, borderColor: accentValue }
          : {}"
        disabled
      >
        Items
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Content Dashboard Context Bar
 * =========================================================
 *
 * Responsibilities
 * - Display the current Content dashboard context
 * - Show the active content domain in the header
 * - Render domain pills for Creatures and Items
 *
 * Notes
 * - First-pass implementation is presentational only
 * - Domain switching behavior will be added later
 * - Active state is currently driven by the incoming prop
 * =========================================================
 */

import { computed, inject } from 'vue'
import type { ComputedRef } from 'vue'
import type { DashboardTheme } from '@/features/admin/utils/dashboardThemes'

type ContentDomain = 'creatures' | 'items'

const props = defineProps<{
  activeDomain: ContentDomain
}>()

const activeDomainLabel = computed(() => {
  return props.activeDomain === 'creatures' ? 'Creatures' : 'Items'
})

const dashboardThemeRef =
  inject<ComputedRef<DashboardTheme | undefined>>('dashboardTheme')

const accentValue = dashboardThemeRef?.value?.accentValue ?? '#3b82f6'

function getPillClasses(domain: ContentDomain): string[] {
  const isActive = props.activeDomain === domain

  return [
    'rounded-full px-4 py-2 text-sm font-medium transition border',
    'flex items-center justify-center',
    isActive
      ? 'text-white'
      : 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-neutral-600 bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-800',
  ]
}
</script>