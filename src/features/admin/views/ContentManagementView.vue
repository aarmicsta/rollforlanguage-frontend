<template>
  <div class="space-y-6">
    <!-- Context Bar -->
    <ContentDashboardContextBar activeDomain="creatures" />

    <!-- Widgets Row -->
    <section class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div class="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm">
        <h2 class="text-lg font-semibold text-white">Content Widget 1</h2>
        <p class="mt-2 text-sm text-gray-300">
          Placeholder widget area for future content metrics.
        </p>
      </div>

      <div class="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm">
        <h2 class="text-lg font-semibold text-white">Content Widget 2</h2>
        <p class="mt-2 text-sm text-gray-300">
          Placeholder widget area for future content metrics.
        </p>
      </div>

      <div class="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm">
        <h2 class="text-lg font-semibold text-white">Content Widget 3</h2>
        <p class="mt-2 text-sm text-gray-300">
          Placeholder widget area for future content metrics.
        </p>
      </div>
    </section>

    <!-- Main Dashboard Row -->
    <section class="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <!-- Sidebar Placeholder -->
      <aside class="xl:col-span-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm">
        <h2 class="text-lg font-semibold text-white">Content Sidebar Tools</h2>
        <p class="mt-2 text-sm text-gray-300">
          Placeholder area for domain-aware sidebar actions.
        </p>
      </aside>

      <!-- Management Surface Placeholder -->
      <div class="xl:col-span-9 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm min-h-[24rem]">
        <h2 class="text-lg font-semibold text-white">Content Management Surface</h2>
        <p class="mt-2 text-sm text-gray-300">
          Placeholder area for the active content management table and workflows.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Content Management View
 * =========================================================
 *
 * Responsibilities
 * - Compose the Content dashboard layout
 * - Render the context bar above widgets
 * - Provide placeholder regions for widgets, sidebar tools,
 *   and management surface during first-pass implementation
 *
 * Notes
 * - This file should remain a thin composition layer
 * - Real widget, sidebar, and surface components will be
 *   introduced in later steps
 * =========================================================
 */

import ContentDashboardContextBar from '@/features/admin/components/contentDashboard/ContentDashboardContextBar.vue'
</script>