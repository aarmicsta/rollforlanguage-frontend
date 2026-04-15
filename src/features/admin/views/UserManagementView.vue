<template>
  <!--
    =========================================================
    User Management View
    =========================================================

    Thin composition layer for the admin Users dashboard.

    Responsibilities:
    - compose dashboard summary widgets
    - render the Users sidebar command surface
    - mount the first-class user management surface
    - mount the centralized user modal container

    Notes:
    - this view does not own workflow logic
    - this view does not own modal state
    - this view does not fetch table data directly
  -->
  <section class="space-y-6 p-6">
    <!--
      ---------------------------------------------------------
      Dashboard Summary Widgets
      ---------------------------------------------------------

      Widgets remain informational only. They do not own create,
      edit, or table-management workflows.
    -->
    <DashboardWidgetGrid>
      <UserTableWidget />
      <UserMetricsWidget />
      <FlaggedUsersWidget />
    </DashboardWidgetGrid>

    <!--
      ---------------------------------------------------------
      First-Class Management Surface
      ---------------------------------------------------------
    -->
    <UserManagementSurface />

    <!--
      ---------------------------------------------------------
      Centralized Modal Mounting
      ---------------------------------------------------------
    -->
    <UserDashboardModalContainer />
  </section>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * User Management View
 * =========================================================
 *
 * Route-level composition for the admin Users dashboard.
 *
 * Architectural role:
 * - mirrors the canonical new-generation dashboard structure
 * - remains intentionally thin
 * - delegates workflows to the store, surface, tables, and modals
 */

import DashboardWidgetGrid from '@/features/admin/components/dashboard/DashboardWidgetGrid.vue'
import FlaggedUsersWidget from '@/features/admin/components/userDashboard/FlaggedUsersWidget.vue'
import UserDashboardModalContainer from '@/features/admin/components/userDashboard/UserDashboardModalContainer.vue'
import UserDashboardSidebarTools from '@/features/admin/components/userDashboard/UserDashboardSidebarTools.vue'
import UserManagementSurface from '@/features/admin/components/userDashboard/UserManagementSurface.vue'
import UserMetricsWidget from '@/features/admin/components/userDashboard/UserMetricsWidget.vue'
import UserTableWidget from '@/features/admin/components/userDashboard/UserTableWidget.vue'
</script>