<!-- /src/features/admin/components/playableDashboard/PlayableStatTable.vue -->
<template>
  <div class="space-y-4 text-gray-800 dark:text-gray-100">
    <div class="overflow-x-auto rounded border dark:border-neutral-700">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 dark:bg-neutral-800">
          <tr>
            <th class="px-4 py-2 text-left">Display Name</th>
            <th class="px-4 py-2 text-left">Name</th>
            <th class="px-4 py-2 text-left">Slug</th>
            <th class="px-4 py-2 text-left">Active</th>
            <th class="px-4 py-2 text-left">Last Updated</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in stats"
            :key="item.id"
            class="cursor-pointer border-t hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            @click="handleRowClick(item)"
          >
            <td class="px-4 py-2 font-medium">{{ item.displayName }}</td>
            <td class="px-4 py-2">{{ item.name }}</td>
            <td class="px-4 py-2">{{ item.slug }}</td>
            <td class="px-4 py-2">
              {{ item.isActive ? 'Yes' : 'No' }}
            </td>
            <td class="px-4 py-2">
              {{ formatDate(item.updatedAt) }}
            </td>
          </tr>

          <tr v-if="!stats.length">
            <td colspan="5" class="px-4 py-6 text-center text-gray-500">
              No playable stats found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Playable Stat Table
 * =========================================================
 *
 * Admin browse table for playable stats.
 *
 * Responsibilities:
 * - fetch and display canonical playable stat records
 * - refresh when the shared playable refresh key changes
 * - prepare the row-selection flow for stat editing
 *
 * Notes:
 * - This component is intentionally browse-focused.
 * - It does not render modals directly.
 * - Stat edit modal wiring will be layered in after the
 *   dedicated stat edit workflow is created.
 */

import { onMounted, ref, watch } from 'vue'
import { getPlayableStats, type PlayableStat } from '@/features/admin/services/playableStatService'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'

/**
 * ---------------------------------------------------------
 * Emits
 * ---------------------------------------------------------
 *
 * `close` allows the parent browse modal/container to close
 * itself before a future edit flow opens.
 */
const emit = defineEmits<{
  (e: 'close'): void
}>()

/**
 * ---------------------------------------------------------
 * Store / Local State
 * ---------------------------------------------------------
 *
 * `store`
 * - shared admin playable UI state
 *
 * `stats`
 * - local table data for the current playable stat browse view
 */
const store = useAdminPlayableStore()
const stats = ref<PlayableStat[]>([])

/**
 * ---------------------------------------------------------
 * Data Loading
 * ---------------------------------------------------------
 *
 * Fetches the current playable stat browse list from the
 * admin service.
 */
async function fetchStats() {
  const res = await getPlayableStats()
  stats.value = res
}

/**
 * ---------------------------------------------------------
 * Row Interaction
 * ---------------------------------------------------------
 *
 * Current behavior:
 * - closes the surrounding browse view only
 *
 * Future behavior:
 * - will also open the dedicated stat edit modal through
 *   the shared admin playable store
 */
function handleRowClick(_item: PlayableStat) {
  emit('close')
}

/**
 * ---------------------------------------------------------
 * Formatting
 * ---------------------------------------------------------
 *
 * Lightweight formatter for nullable backend date strings.
 */
function formatDate(dateStr: string | null) {
  return dateStr ? new Date(dateStr).toLocaleDateString() : '—'
}

/**
 * ---------------------------------------------------------
 * Lifecycle / Refresh Sync
 * ---------------------------------------------------------
 *
 * - fetch once when mounted
 * - refetch whenever the shared playable refresh key changes
 */
onMounted(fetchStats)
watch(() => store.lastPlayableRefresh, fetchStats)
</script>