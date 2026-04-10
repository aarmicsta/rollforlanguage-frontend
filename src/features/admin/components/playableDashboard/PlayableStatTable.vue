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
 * Admin table for canonical playable stats.
 *
 * Responsibilities:
 * - fetch and display canonical playable stat records
 * - refresh when the shared playable refresh key changes
 * - open the stat edit workflow when a row is selected
 *
 * Notes:
 * - This component is intentionally table-focused.
 * - It does not render modals directly.
 * - Modal orchestration is handled through the shared
 *   admin playable store and the Playables modal container.
 */

import { onMounted, ref, watch } from 'vue'
import { getPlayableStats } from '@/features/admin/services/playableStatService'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'
import type { PlayableStatEditItem } from '@/features/admin/types/playableTypes'

/**
 * ---------------------------------------------------------
 * Emits
 * ---------------------------------------------------------
 *
 * `close` allows the parent table modal/container to close
 * itself before the edit flow opens.
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
 * - local table data for the current playable stat view
 */
const store = useAdminPlayableStore()
const stats = ref<PlayableStatEditItem[]>([])

/**
 * ---------------------------------------------------------
 * Data Loading
 * ---------------------------------------------------------
 *
 * Fetches the current playable stat list from the admin
 * service.
 */
async function fetchStats() {
  const res = await getPlayableStats()
  stats.value = res as PlayableStatEditItem[]
}

/**
 * ---------------------------------------------------------
 * Row Interaction
 * ---------------------------------------------------------
 *
 * Selecting a row closes the surrounding table view and
 * opens the dedicated stat edit modal through the store.
 */
function handleRowClick(item: PlayableStatEditItem) {
  emit('close')
  store.openEditStatModal(item)
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