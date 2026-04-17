<template>
  <!--
    =========================================================
    User Table Widget
    =========================================================

    Informational overview widget for the Users dashboard.

    Responsibilities:
    - display a compact snapshot of user-system metrics
    - react to shared dashboard refresh signals
    - remain informational only

    Notes:
    - this widget does not open management surfaces
    - this widget does not render modals
    - actual user management occurs through the sidebar tools
      and first-class management surface
  -->
  <WidgetWrapper title="User Overview" icon="Users">
    <!--
      ---------------------------------------------------------
      Metrics Content
      ---------------------------------------------------------
    -->
    <p
      v-if="loading"
      class="text-sm text-gray-500 dark:text-gray-400"
    >
      Loading...
    </p>

    <ul
      v-else-if="metrics"
      class="space-y-1 text-sm text-gray-800 dark:text-gray-100"
    >
      <li><strong>{{ metrics.totalUsers }}</strong> total users</li>
      <li><strong>{{ metrics.roles.admin || 0 }}</strong> Admins</li>
      <li><strong>{{ metrics.roles.teacher || 0 }}</strong> Teachers</li>
      <li><strong>{{ metrics.roles.student || 0 }}</strong> Students</li>
    </ul>

    <p
      v-else
      class="text-sm text-red-600 dark:text-red-400"
    >
      Failed to load user metrics.
    </p>
  </WidgetWrapper>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * User Table Widget
 * =========================================================
 *
 * Informational summary widget for the admin Users dashboard.
 *
 * Architectural role:
 * - read-only dashboard widget
 * - consumes shared metrics from the user dashboard store
 * - refetches metrics when the dashboard refresh signal changes
 */

import { onMounted, ref, watch } from 'vue'
import WidgetWrapper from '@/components/molecules/WidgetWrapper.vue'
import { useUserDashboardStore } from '@/features/admin/user/stores/userStore'
import type { UserMetrics } from '@/features/admin/user/types/userTypes'

const userDashboardStore = useUserDashboardStore()

/**
 * ---------------------------------------------------------
 * Local Display State
 * ---------------------------------------------------------
 *
 * Local widget state mirrors store-backed metrics so the widget
 * can manage its own loading presentation cleanly.
 */
const loading = ref(true)
const metrics = ref<UserMetrics | null>(null)

/**
 * ---------------------------------------------------------
 * Metrics Fetch
 * ---------------------------------------------------------
 *
 * Loads the latest dashboard-level user metrics through the
 * shared dashboard store.
 */
async function loadMetrics() {
  loading.value = true

  try {
    await userDashboardStore.fetchUserMetrics()
    metrics.value = userDashboardStore.userMetrics
  } catch {
    metrics.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMetrics()
})

watch(
  () => userDashboardStore.lastUserListRefresh,
  () => {
    loadMetrics()
  }
)
</script>