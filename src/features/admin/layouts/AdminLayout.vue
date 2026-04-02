<!-- /src/features/admin/layouts/AdminLayout.vue -->
<template>
  <div class="min-h-screen bg-cover bg-center" :style="backgroundStyle">
    <!--
      ---------------------------------------------------------
      Global Toast Feedback
      ---------------------------------------------------------

      Mounted at the persistent admin layout level so toast
      feedback survives the unmounting of transient child
      components such as modals.
    -->
    <Toast
      v-if="toastStore.visible"
      :message="toastStore.message"
      :type="toastStore.type"
      @dismiss="toastStore.hideToast()"
    />

    <!-- Topbar -->
    <Topbar />

    <div class="flex flex-1">
      <!-- Sidebar with injected tools -->
      <Sidebar>
        <template #tools>
          <DashboardSidebarTools
            v-if="currentRouteName === 'AdminDashboard'"
            :user-role="userRole"
          />

          <UserDashboardSidebarTools
            v-else-if="currentRouteName === 'AdminUsers'"
          />

          <PlayableDashboardSidebarTools
            v-else-if="currentRouteName === 'AdminPlayables'"
            @openTagsModal="showTagsModal = true"
          />
        </template>
      </Sidebar>

      <!-- Main content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <router-view
          :show-tags-modal="showTagsModal"
          @update:show-tags-modal="showTagsModal = $event"
        />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { useRoute } from 'vue-router'

import { useToastStore } from '@/stores/ui/useToastStore'
import Toast from '@/components/molecules/Toast.vue'
import DashboardSidebarTools from '@/features/admin/components/dashboard/DashboardSidebarTools.vue'
import PlayableDashboardSidebarTools from '@/features/admin/components/playableDashboard/PlayableDashboardSidebarTools.vue'
import UserDashboardSidebarTools from '@/features/admin/components/userDashboard/UserDashboardSidebarTools.vue'
import { dashboardThemes } from '@/features/admin/utils/dashboardThemes'
import type { DashboardTheme } from '@/features/admin/utils/dashboardThemes'
import Sidebar from '../components/Sidebar.vue'
import Topbar from '../components/Topbar.vue'

/**
 * ---------------------------------------------------------
 * Local Layout State
 * ---------------------------------------------------------
 *
 * Controls admin-layout-specific UI concerns that are scoped
 * to this layout and shared with nested route views.
 */
const showTagsModal = ref(false)

/**
 * ---------------------------------------------------------
 * Global UI Feedback
 * ---------------------------------------------------------
 *
 * The admin layout owns rendering of shared toast feedback
 * so notifications persist independently of transient child
 * components (e.g., modals).
 */
const toastStore = useToastStore()

// Get current route name
const route = useRoute()
const currentRouteName = computed(() => route.name)

/**
 * ---------------------------------------------------------
 * Dashboard Theme Resolution
 * ---------------------------------------------------------
 *
 * Determines the active theme for the current admin route
 * and provides it downward for child components that need
 * route-aware styling or layout behavior.
 */
const currentTheme = computed<DashboardTheme | undefined>(() =>
  dashboardThemes.find(t => t.routeName === currentRouteName.value)
)

// Make theme available to child components via inject()
provide('dashboardTheme', currentTheme)

// Placeholder user role (in future, pull from auth store)
const userRole = 'superadmin'

// Admin background
const backgroundStyle = {
  backgroundImage: "url('/backgrounds/bg-admin.webp')",
}
</script>

<style scoped>
/* Optional: Add layout-specific styles here */
</style>