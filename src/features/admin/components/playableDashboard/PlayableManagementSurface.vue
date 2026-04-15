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

    It simply reflects store state.
  -->

  <div v-if="activeSurface" class="mt-6">
    <!--
      -------------------------------------------------------
      Surface Header
      -------------------------------------------------------

      Provides context for which entity type is currently
      being managed.
    -->
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
        {{ surfaceTitle }}
      </h2>

      <!-- Optional: Close / Clear Surface -->
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

      Tables:
      - own their own data fetching
      - react to refresh signals
      - open edit modals via store
    -->

    <PlayableClassTable v-if="activeSurface === 'classes'" />

    <PlayableSpeciesTable v-else-if="activeSurface === 'species'" />

    <PlayableStatTable v-else-if="activeSurface === 'stats'" />

    <PlayableStatModifierTable
      v-else-if="activeSurface === 'statModifiers'"
    />

    <PlayablePassiveTable v-else-if="activeSurface === 'passives'" />
  </div>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Imports
 * =========================================================
 */

import { computed } from 'vue'
import PlayableClassTable from '@/features/admin/components/playableDashboard/PlayableClassTable.vue'
import PlayablePassiveTable from '@/features/admin/components/playableDashboard/PlayablePassiveTable.vue'
import PlayableSpeciesTable from '@/features/admin/components/playableDashboard/PlayableSpeciesTable.vue'
import PlayableStatModifierTable from '@/features/admin/components/playableDashboard/PlayableStatModifierTable.vue'
import PlayableStatTable from '@/features/admin/components/playableDashboard/PlayableStatTable.vue'
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