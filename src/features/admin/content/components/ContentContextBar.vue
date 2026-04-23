<template>
  <!--
    =========================================================
    Content Dashboard Context Bar
    =========================================================

    Displays the current Content dashboard context and allows
    the user to switch between first-class Content domains.

    Responsibilities:
    - reflect the active Content domain in the header
    - render domain pills for available Content domains
    - dispatch domain-switch actions to the shared Content store

    Notes:
    - active state is store-driven
    - domain switching is live behavior, not placeholder behavior
    - visual accent styling is inherited from the current
      dashboard theme context
  -->
  <section
    class="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
  >
    <!-- Header -->
    <div class="border-b border-gray-200 px-4 py-3 dark:border-neutral-700">
      <h1 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Content / {{ activeDomainLabel }}
      </h1>
    </div>

    <!-- Domain Pills -->
    <div class="flex flex-wrap items-center gap-3 px-4 py-3">
      <button
        type="button"
        :class="getPillClasses('creatures')"
        :style="
          store.activeContentDomain === 'creatures'
            ? { '--tw-ring-color': accentValue }
            : {}
        "
        @click="store.setActiveContentDomain('creatures')"
      >
        Creatures
      </button>

      <button
        type="button"
        :class="getPillClasses('items')"
        :style="
          store.activeContentDomain === 'items'
            ? { '--tw-ring-color': accentValue }
            : {}
        "
        @click="store.setActiveContentDomain('items')"
      >
        Items
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Imports
 * =========================================================
 */
import { computed, inject } from 'vue'
import type { ComputedRef } from 'vue'

import { useContentStore } from '@/features/admin/content/stores/contentStore'
import type { DashboardTheme } from '@/features/admin/dashboard/config/dashboardThemes'

/**
 * =========================================================
 * Types
 * =========================================================
 */
type ContentDomain = 'creatures' | 'items'

/**
 * =========================================================
 * Store
 * =========================================================
 *
 * The context bar reflects and updates shared Content-domain
 * state through the centralized Content store.
 */
const store = useContentStore()

/**
 * =========================================================
 * Theme Context
 * =========================================================
 *
 * Uses the injected dashboard theme so active pill styling
 * remains aligned with the broader admin visual system.
 */
const dashboardThemeRef =
  inject<ComputedRef<DashboardTheme | undefined>>('dashboardTheme')

const accentValue = dashboardThemeRef?.value?.accentValue ?? '#3b82f6'

/**
 * =========================================================
 * Derived Labels
 * =========================================================
 *
 * Converts the active Content-domain key into a user-facing
 * header label.
 */
const activeDomainLabel = computed(() => {
  return store.activeContentDomain === 'creatures' ? 'Creatures' : 'Items'
})

/**
 * =========================================================
 * UI Helpers
 * =========================================================
 *
 * Returns the visual class stack for Content-domain pills.
 */
function getPillClasses(domain: ContentDomain): string[] {
  const isActive = store.activeContentDomain === domain

  return [
    'rounded-full px-4 py-2 text-sm font-medium transition border',
    'bg-gray-200 text-gray-800 dark:bg-neutral-700 dark:text-gray-200',
    isActive
      ? 'ring-2 border-transparent'
      : 'border-gray-300 dark:border-neutral-600',
  ]
}
</script>