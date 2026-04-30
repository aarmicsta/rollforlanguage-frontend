<template>
  <!--
    =========================================================
    Admin Table Shell
    =========================================================

    Shared inner shell for admin dashboard tables.

    Responsibilities:
    - provide consistent table padding and internal layout
    - render optional table controls
    - standardize loading, error, and empty states
    - provide a consistent scroll region for table content
    - render optional footer content such as pagination

    Non-responsibilities:
    - data fetching
    - row rendering
    - column definitions
    - filtering/search logic
    - pagination logic
    - modal/edit behavior
  -->
  <div class="p-4">
    <!-- Optional Controls -->
    <div v-if="$slots.controls" class="mb-4">
      <slot name="controls" />
    </div>

    <!-- Loading State -->
    <AdminTableState
      v-if="loading"
      variant="loading"
      :message="loadingMessage"
    />

    <!-- Error State -->
    <AdminTableState
      v-else-if="error"
      variant="error"
      :message="error"
    />

    <!-- Empty State -->
    <AdminTableState
      v-else-if="isEmpty"
      variant="empty"
      :message="emptyMessage"
    />

    <!-- Table Content -->
    <div v-else class="overflow-x-auto">
      <div class="max-h-[50vh] overflow-y-auto">
        <slot />
      </div>
    </div>

    <!-- Optional Footer -->
    <div v-if="$slots.footer && !loading && !error && !isEmpty" class="mt-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Admin Table Shell
 * =========================================================
 *
 * Inner framework component for admin table presentation.
 *
 * This component intentionally abstracts the shared table frame
 * without owning domain-specific table behavior.
 *
 * Domain tables remain responsible for:
 * - loading their own records
 * - rendering their own rows
 * - handling row clicks/edit actions
 * - deciding whether to use search, filters, or pagination
 */

import AdminTableState from '@/features/admin/shared/components/table/AdminTableState.vue'

/**
 * ---------------------------------------------------------
 * Props
 * ---------------------------------------------------------
 *
 * loading:
 *   true while the parent table is fetching data
 *
 * error:
 *   parent-owned error message; empty string/null means no error
 *
 * isEmpty:
 *   true when the parent table has no displayable records
 *
 * loadingMessage / emptyMessage:
 *   domain-specific display text while preserving shared layout
 */
defineProps<{
  loading?: boolean
  error?: string | null
  isEmpty?: boolean
  loadingMessage?: string
  emptyMessage?: string
}>()
</script>