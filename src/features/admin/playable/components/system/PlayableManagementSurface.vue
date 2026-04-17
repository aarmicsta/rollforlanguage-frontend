<template>
  <!--
    =========================================================
    Playable Management Surface
    =========================================================

    This component renders the currently active management
    table for the Playables dashboard.

    Behavior:
    - if no surface is active, nothing is rendered
    - if a surface is active, the corresponding table is shown
    - only one table is shown at a time

    Architectural Role:
    - this is a render layer only
    - it does not fetch data
    - it does not manage workflows
    - it does not control modals

    Presentation Role:
    - provide a dedicated dashboard-level surface for management
    - provide a solid, non-transparent visual container
    - provide an internal scroll region for long tables

    It simply reflects store state and hosts the active table
    in a consistent dashboard surface.
  -->

  <section
    v-if="activeSurface"
    class="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
  >
    <!--
      -------------------------------------------------------
      Surface Header
      -------------------------------------------------------

      Provides context for which entity type is currently
      being managed and gives the user a simple way to close
      the current management surface.
    -->
    <div
      class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-neutral-700"
    >
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
        {{ surfaceTitle }}
      </h2>

      <button
        class="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
        @click="store.clearActiveManagementSurface()"
      >
        Close
      </button>
    </div>

    <!--
      -------------------------------------------------------
      Active Table Surface
      -------------------------------------------------------

      Only one table is mounted at a time.

      This wrapper intentionally owns:
      - padding
      - internal scroll containment
      - the visible management-region body

      The goal is to prevent long tables from forcing full-page
      scrolling while also ensuring all tables sit on a solid,
      readable dashboard surface.
    -->
    <div class="max-h-[50vh] overflow-y-auto p-4">
      <PlayableClassTable v-if="activeSurface === 'classes'" />

      <PlayableSpeciesTable v-else-if="activeSurface === 'species'" />

      <PlayableStatTable v-else-if="activeSurface === 'stats'" />

      <PlayableStatModifierTable
        v-else-if="activeSurface === 'statModifiers'"
      />

      <PlayablePassiveTable v-else-if="activeSurface === 'passives'" />
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Imports
 * =========================================================
 */

import { computed } from 'vue'
import PlayableClassTable from '@/features/admin/playable/components/class/ClassTable.vue'
import PlayablePassiveTable from '@/features/admin/playable/components/passive/PassiveTable.vue'
import PlayableSpeciesTable from '@/features/admin/playable/components/species/SpeciesTable.vue'
import PlayableStatTable from '@/features/admin/playable/components/stat/StatTable.vue'
import PlayableStatModifierTable from '@/features/admin/playable/components/statModifier/StatModifierTable.vue'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'

/**
 * =========================================================
 * Store
 * =========================================================
 *
 * The management surface is entirely driven by store state.
 */
const store = useAdminPlayableStore()

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
 *
 * This keeps naming consistent and centralized rather than
 * scattering label logic across the template.
 */
const surfaceTitle = computed(() => {
  switch (activeSurface.value) {
    case 'classes':
      return 'Playable Classes'
    case 'species':
      return 'Playable Species'
    case 'stats':
      return 'Playable Stats'
    case 'statModifiers':
      return 'Stat Modifiers'
    case 'passives':
      return 'Passives'
    default:
      return ''
  }
})
</script>