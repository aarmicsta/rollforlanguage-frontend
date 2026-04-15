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
    -->
    <button
      type="button"
      :class="toolButtonClass"
      :style="{ '--tw-ring-color': accentValue }"
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

import { inject } from 'vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import { useUserDashboardStore } from '@/features/admin/stores/userDashboardStore'
import type { DashboardTheme } from '@/features/admin/utils/dashboardThemes'

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
  inject<DashboardTheme | undefined>('dashboardTheme')

const accentValue = dashboardThemeRef?.accentValue ?? '#3b82f6'

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