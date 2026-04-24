<template>
  <!--
    =========================================================
    User Management Surface
    =========================================================

    First-class dashboard management surface for the Users system.

    Responsibilities:
    - render the active user management table
    - provide contextual title and close action
    - supply a consistent visual workspace panel
    - constrain table overflow within the dashboard surface

    Notes:
    - hidden entirely when no management surface is active
    - MVP currently supports a single surface: the User Table
  -->
  <section
    v-if="store.activeManagementSurface"
    class="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
  >
    <!--
      ---------------------------------------------------------
      Surface Header
      ---------------------------------------------------------
    -->
    <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-neutral-700">
      <div>
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {{ surfaceTitle }}
        </h2>
      </div>

      <button
        type="button"
        class="rounded bg-gray-300 px-3 py-2 text-sm text-gray-800 hover:bg-gray-400 dark:bg-neutral-700 dark:text-gray-100 dark:hover:bg-neutral-600"
        @click="store.clearActiveManagementSurface()"
      >
        Close
      </button>
    </div>

    <!--
      ---------------------------------------------------------
      Surface Body
      ---------------------------------------------------------

      The parent management surface owns scroll containment so
      the table component can focus on browse-and-select logic.
    -->
    <div class="max-h-[50vh] overflow-y-auto p-4">
      <UserTable v-if="store.activeManagementSurface === 'users'" />
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * User Management Surface
 * =========================================================
 *
 * First-class management surface for the admin Users dashboard.
 *
 * Architectural role:
 * - equivalent to the Playables management surface layer
 * - renders dashboard-level management tables outside of modals
 * - delegates browse/select behavior to the table component
 */

import { computed } from 'vue'
import UserTable from '@/features/admin/user/components/UserTable.vue'
import { useUserDashboardStore } from '@/features/admin/user/stores/userStore'


const store = useUserDashboardStore()

/**
 * ---------------------------------------------------------
 * Surface Display Metadata
 * ---------------------------------------------------------
 *
 * Derived UI text for the currently active management surface.
 */
const surfaceTitle = computed(() => {
  if (store.activeManagementSurface === 'users') {
    return 'User Table'
  }

  return ''
})
</script>