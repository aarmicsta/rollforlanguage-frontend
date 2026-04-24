<template>
  <!--
    =========================================================
    Content Management Surface
    =========================================================

    This component renders the currently active management
    surface for the Content dashboard.

    Behavior:
    - if no surface is active, nothing is rendered
    - if a surface is active, the corresponding table
      component is shown
    - only one surface is shown at a time

    Architectural Role:
    - this is a render layer only
    - it does not fetch data directly
    - it does not manage workflows
    - it does not control modals

    It simply reflects store state and hosts the active
    Content surface in a consistent dashboard shell.
  -->
  <section
    v-if="activeSurface"
    class="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
  >
    <!-- Surface Header -->
    <div
      class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-neutral-700"
    >
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
        {{ surfaceTitle }}
      </h2>

      <button
        type="button"
        class="rounded bg-gray-300 px-3 py-2 text-sm text-gray-800 hover:bg-gray-400 dark:bg-neutral-700 dark:text-gray-100 dark:hover:bg-neutral-600"
        @click="store.clearActiveManagementSurface()"
      >
        Close
      </button>
    </div>

    <!-- Surface Body -->
    <div class="max-h-[50vh] overflow-y-auto">
      <CreatureTable v-if="activeSurface === 'creatures'" />

      <CreatureBaseStatsTable v-else-if="activeSurface === 'creatureStats'" />

      <div v-else-if="activeSurface === 'items'" class="p-4">
        <p class="text-sm text-gray-700 dark:text-gray-300">
          Placeholder surface for future item management tables.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Content Management Surface
 * =========================================================
 *
 * Responsibilities
 * - render the currently active Content dashboard surface
 * - reflect shared store state only
 *
 * Notes
 * - Presentational/store-reflective only
 * - Mirrors canonical Playables surface shell
 * - Real domain tables are introduced incrementally
 * =========================================================
 */

import { computed } from 'vue'
import CreatureBaseStatsTable from '@/features/admin/content/components/creature/CreatureBaseStatsTable.vue'
import CreatureTable from '@/features/admin/content/components/creature/CreatureTable.vue'
import { useContentStore } from '@/features/admin/content/stores/contentStore'

/**
 * ---------------------------------------------------------
 * Store
 * ---------------------------------------------------------
 *
 * The management surface is entirely driven by shared
 * Content dashboard store state.
 */
const store = useContentStore()

/**
 * ---------------------------------------------------------
 * Active Surface
 * ---------------------------------------------------------
 *
 * Convenience computed wrapper for readability.
 */
const activeSurface = computed(() => store.activeManagementSurface)

/**
 * ---------------------------------------------------------
 * Surface Title Mapping
 * ---------------------------------------------------------
 *
 * Maps internal surface keys to user-facing labels.
 */
const surfaceTitle = computed(() => {
  switch (activeSurface.value) {
    case 'creatures':
      return 'Creature Table'
    case 'creatureStats':
      return 'Creature Stats Table'
    case 'items':
      return 'Item Table'
    default:
      return ''
  }
})
</script>