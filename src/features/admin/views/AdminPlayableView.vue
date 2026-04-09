<template>
  <DashboardWidgetGrid>
    <!--
      ---------------------------------------------------------
      Primary Playables Widgets
      ---------------------------------------------------------
    -->
    <PlayableTableWidget />
    <PlayableMetricsWidget />

    <!--
      ---------------------------------------------------------
      Centralized Playables Modal Rendering
      ---------------------------------------------------------
    -->
    <PlayableDashboardModalContainer />

    <!-- Future widget return points -->
    <!-- <FeaturedTagsWidget ref="featuredTagsRef" /> -->
  </DashboardWidgetGrid>
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
 * - mount the centralized Playables modal container
 *
 * Notes:
 * - This view is intentionally thin.
 * - Business logic and modal state orchestration live elsewhere:
 *   - sidebar tools dispatch actions
 *   - adminPlayableStore owns state
 *   - PlayableDashboardModalContainer renders modal content
 */

import DashboardWidgetGrid from '@/features/admin/components/dashboard/DashboardWidgetGrid.vue'
import PlayableDashboardModalContainer from '@/features/admin/components/playableDashboard/PlayableDashboardModalContainer.vue'
import PlayableMetricsWidget from '@/features/admin/components/playableDashboard/PlayableMetricsWidget.vue'
import PlayableTableWidget from '@/features/admin/components/playableDashboard/PlayableTableWidget.vue'
</script>