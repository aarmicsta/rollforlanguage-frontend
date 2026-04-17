<template>
  <section class="p-6 space-y-6">
    <WelcomeBanner :username="userName" :role="userRole" />

    <DashboardWidgetGrid>
      <UserMetricsWidget />

      <SystemOverviewWidget />

      <ContentSummaryWidget />

      <!-- Future: Add superadmin-only widgets here -->
      <!-- Example:
      <SuperAdminWidget v-if="userRole === 'super-admin'" />
      -->
    </DashboardWidgetGrid>
  </section>
</template>


<script setup lang="ts">

import DashboardWidgetGrid from '@/features/admin/dashboard/components/DashboardWidgetGrid.vue'
import WelcomeBanner from '@/features/admin/dashboard/components/WelcomeBanner.vue'
import UserMetricsWidget from '@/features/admin/user/components/UserMetricsWidget.vue'
import { useAuth } from '@/features/auth/hooks/useAuth'

const { user } = useAuth()

const userName = user.value?.username || 'Admin'
const userRole = user.value?.roles?.[0] || 'admin'

</script>

<style scoped>
/* Optional: dashboard-specific styles */
</style>
