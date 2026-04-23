<template>
  <!--
    =========================================================
    Content Management View
    =========================================================

    Route-level composition shell for the Content admin
    dashboard.

    This view remains intentionally thin. It is responsible only
    for composing the major dashboard layers:

    - content context layer
    - summary widget layer
    - management surface layer
    - centralized modal rendering layer

    Business logic, workflow state, and data loading continue to
    live elsewhere.
  -->

  <div class="space-y-6">
    <!--
      ---------------------------------------------------------
      Content Context Layer
      ---------------------------------------------------------

      Displays the current Content dashboard context and the
      available domain pills.
    -->
    <ContentContextBar />

    <!--
      ---------------------------------------------------------
      Summary Widget Layer
      ---------------------------------------------------------

      DashboardWidgetGrid contains the high-level summary and
      overview widgets for the Content dashboard.
    -->
    <DashboardWidgetGrid>
      <ContentTableWidget />
      <ContentMetricsWidget />
    </DashboardWidgetGrid>

    <!--
      ---------------------------------------------------------
      Management Surface Layer
      ---------------------------------------------------------

      Renders the currently active first-class management table
      for the Content dashboard.
    -->
    <ContentManagementSurface />

    <!--
      ---------------------------------------------------------
      Centralized Content Modal Rendering
      ---------------------------------------------------------

      All major create/edit workflows remain mounted centrally
      through the Content modal container.
    -->
    <ContentModalContainer />
  </div>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Content Management View
 * =========================================================
 *
 * Route-level composition view for the Content admin dashboard.
 *
 * Responsibilities:
 * - compose the Content dashboard context bar
 * - compose the primary Content dashboard widgets
 * - compose the dashboard-level management surface
 * - mount the centralized Content modal container
 *
 * Notes:
 * - This view is intentionally thin.
 * - Business logic and modal state orchestration live elsewhere:
 *   - context bar reflects active Content domain
 *   - sidebar tools dispatch actions
 *   - contentStore owns shared Content dashboard state
 *   - ContentManagementSurface reflects active table state
 *   - ContentModalContainer renders centralized workflow modals
 */
import ContentContextBar from '@/features/admin/content/components/ContentContextBar.vue'
import ContentMetricsWidget from '@/features/admin/content/components/ContentMetricsWidget.vue'
import ContentTableWidget from '@/features/admin/content/components/ContentTableWidget.vue'
import ContentManagementSurface from '@/features/admin/content/components/system/ContentManagementSurface.vue'
import ContentModalContainer from '@/features/admin/content/components/system/ContentModalContainer.vue'
import DashboardWidgetGrid from '@/features/admin/dashboard/components/DashboardWidgetGrid.vue'
</script>