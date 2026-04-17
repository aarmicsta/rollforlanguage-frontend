<template>
  <!--
    =========================================================
    Admin Playable View
    =========================================================

    Route-level composition shell for the Playables admin
    dashboard.

    This view remains intentionally thin. It is responsible only
    for composing the major dashboard layers:

    - summary widget layer
    - management surface layer
    - centralized modal rendering layer

    Business logic, workflow state, and data loading continue to
    live elsewhere.
  -->

  <div class="space-y-6">
    <!--
      ---------------------------------------------------------
      Summary Widget Layer
      ---------------------------------------------------------

      DashboardWidgetGrid contains the high-level summary and
      overview widgets for the Playables dashboard.
    -->
    <DashboardWidgetGrid>
      <PlayableTableWidget />
      <PlayableMetricsWidget />

      <!-- Future widget return points -->
      <!-- <FeaturedTagsWidget ref="featuredTagsRef" /> -->
    </DashboardWidgetGrid>

    <!--
      ---------------------------------------------------------
      Management Surface Layer
      ---------------------------------------------------------

      Renders the currently active first-class management table
      (classes, species, stats, stat modifiers, or passives).

      This surface is store-driven and replaces the older
      sidebar-owned browse modal pattern.
    -->
    <PlayableManagementSurface />

    <!--
      ---------------------------------------------------------
      Centralized Playables Modal Rendering
      ---------------------------------------------------------

      All major create/edit workflows remain mounted centrally
      through the Playables modal container.
    -->
    <PlayableDashboardModalContainer />
  </div>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Admin Playable View
 * =========================================================
 *
 * Route-level composition view for the Playables admin dashboard.
 *
 * Responsibilities:
 * - compose the primary Playables dashboard widgets
 * - compose the dashboard-level management surface
 * - mount the centralized Playables modal container
 *
 * Notes:
 * - This view is intentionally thin.
 * - Business logic and modal state orchestration live elsewhere:
 *   - sidebar tools dispatch actions
 *   - adminPlayableStore owns state
 *   - PlayableManagementSurface reflects active table state
 *   - PlayableDashboardModalContainer renders workflow modals
 */

import DashboardWidgetGrid from '@/features/admin/dashboard/components/DashboardWidgetGrid.vue'
import PlayableMetricsWidget from '@/features/admin/playable/components/PlayableMetricsWidget.vue'
import PlayableTableWidget from '@/features/admin/playable/components/PlayableTableWidget.vue'
import PlayableManagementSurface from '@/features/admin/playable/components/system/PlayableManagementSurface.vue'
import PlayableDashboardModalContainer from '@/features/admin/playable/components/system/PlayableModalContainer.vue'
</script>