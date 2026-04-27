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
        v-for="domain in contentDomains"
        :key="domain.key"
        type="button"
        :disabled="!domain.isSelectable"
        :class="getPillClasses(domain)"
        :style="
          store.activeContentDomain === domain.key
            ? { '--tw-ring-color': accentValue }
            : {}
        "
        @click="handleDomainClick(domain)"
      >
        {{ domain.label }}
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
import type { ContentDomain } from '@/features/admin/content/types/contentTypes'
import type { DashboardTheme } from '@/features/admin/dashboard/config/dashboardThemes'

/**
 * =========================================================
 * Types
 * =========================================================
 */
interface ContentDomainPill {
  key: ContentDomain
  label: string
  isSelectable: boolean
}

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

const contentDomains: ContentDomainPill[] = [
  {
    key: 'creatures',
    label: 'Creatures',
    isSelectable: true,
  },
  {
    key: 'items',
    label: 'Items',
    isSelectable: true,
  },
  {
    key: 'factions',
    label: 'Factions',
    isSelectable: false,
  },
  {
    key: 'organizations',
    label: 'Organizations',
    isSelectable: false,
  },
  {
    key: 'locations',
    label: 'Locations',
    isSelectable: false,
  },
]

/**
 * =========================================================
 * Derived Labels
 * =========================================================
 *
 * Converts the active Content-domain key into a user-facing
 * header label.
 */
const activeDomainLabel = computed(() => {
  return (
    contentDomains.find((domain) => domain.key === store.activeContentDomain)
      ?.label ?? 'Unknown'
  )
})

/**
 * =========================================================
 * UI Helpers
 * =========================================================
 *
 * Returns the visual class stack for Content-domain pills.
 */
function getPillClasses(domain: ContentDomainPill): string[] {
  const isActive = store.activeContentDomain === domain.key

  return [
    'rounded-full px-4 py-2 text-sm font-medium transition border',
    isActive
      ? 'bg-gray-200 text-gray-800 ring-2 border-transparent dark:bg-neutral-700 dark:text-gray-200'
      : '',
    !isActive && domain.isSelectable
      ? 'bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300 dark:bg-neutral-700 dark:text-gray-200 dark:border-neutral-600 dark:hover:bg-neutral-600'
      : '',
    !domain.isSelectable
      ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 opacity-70 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-500'
      : '',
  ]
}

function handleDomainClick(domain: ContentDomainPill) {
  if (!domain.isSelectable) return

  store.setActiveContentDomain(domain.key)
}
</script>