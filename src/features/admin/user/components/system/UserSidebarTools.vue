<template>
  <!--
    =========================================================
    User Dashboard Sidebar Tools
    =========================================================

    Command surface for the admin Users dashboard.

    Responsibilities:
    - render real dashboard actions only
    - dispatch user intent into store-controlled workflows
    - avoid owning modal rendering or workflow execution

    Notes:
    - this component does not render modals
    - this component does not fetch entity data
    - this component does not contain placeholder tools
  -->
  <div class="flex flex-col gap-4">
    <!--
      ---------------------------------------------------------
      Create User
      ---------------------------------------------------------

      Create is a one-off workflow trigger, so it does not
      present a persistent active state.
    -->
    <button
      type="button"
      :class="toolButtonClass"
      :style="{ '--tw-ring-color': accentValue }"
      @click="store.openCreateUserModal()"
    >
      <AppIcon name="UserPlus" library="lucide" />
      <span>Create User</span>
    </button>

    <!--
      ---------------------------------------------------------
      User Table
      ---------------------------------------------------------

      Opens or closes the first-class user management surface.

      Active-state note:
      - this button receives persistent active styling when the
        Users management surface is currently open
      -->
    <button
      type="button"
      :class="[
        ...toolButtonClass,
        isUserTableActive ? 'bg-gray-200 font-medium dark:bg-neutral-800' : '',
      ]"
      :style="
        isUserTableActive
          ? {
              '--tw-ring-color': accentValue,
              borderLeft: `4px solid ${accentValue}`,
            }
          : {
              '--tw-ring-color': accentValue,
              borderLeft: '4px solid transparent',
            }
      "
      @click="store.toggleManagementSurface('users')"
    >
      <AppIcon name="Table" library="lucide" />
      <span>User Table</span>
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * User Dashboard Sidebar Tools
 * =========================================================
 *
 * Command-only sidebar tools for the admin Users dashboard.
 *
 * Architectural role:
 * - mirrors the canonical new-generation sidebar model
 * - translates user intent into store actions
 * - does not own modal rendering or workflow state
 */

import { computed, inject } from 'vue'
import type { ComputedRef } from 'vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import type { DashboardTheme } from '@/features/admin/dashboard/config/dashboardThemes'
import { useUserDashboardStore } from '@/features/admin/user/stores/userStore'

const store = useUserDashboardStore()

/**
 * ---------------------------------------------------------
 * Theme Accent
 * ---------------------------------------------------------
 *
 * Uses the injected dashboard theme accent color for hover/focus
 * ring consistency with the surrounding admin dashboard.
 */
const dashboardThemeRef =
  inject<ComputedRef<DashboardTheme | undefined>>('dashboardTheme')

const accentValue = dashboardThemeRef?.value?.accentValue ?? '#3b82f6'

/**
 * ---------------------------------------------------------
 * Active-State Helpers
 * ---------------------------------------------------------
 *
 * Only persistent management-surface tools receive active-state
 * styling. One-off workflow triggers such as Create User remain
 * visually neutral after activation.
 */
const isUserTableActive = computed(() => {
  return store.activeManagementSurface === 'users'
})

/**
 * ---------------------------------------------------------
 * Shared Button Classes
 * ---------------------------------------------------------
 *
 * Keeps MVP command buttons visually aligned while avoiding
 * unnecessary abstraction into a separate utility at this stage.
 */
const toolButtonClass = [
  'flex items-center gap-2 rounded px-4 py-2 text-left transition group',
  'bg-white text-black dark:bg-black dark:text-white',
  'border border-transparent hover:ring-4 hover:ring-offset-2 focus:outline-none',
]
</script>