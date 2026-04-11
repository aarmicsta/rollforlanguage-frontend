<!-- /src/features/admin/components/playableDashboard/PlayableClassTable.vue -->
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
            v-for="item in classes"
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

          <tr v-if="!classes.length">
            <td colspan="5" class="px-4 py-6 text-center text-gray-500">
              No playable classes found.
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
 * Playable Class Table
 * =========================================================
 *
 * Admin browse table for playable classes.
 *
 * Responsibilities:
 * - fetch and display playable class browse records
 * - refresh when the shared playable refresh key changes
 * - open the class edit workflow when a row is selected
 *
 * Notes:
 * - This component is intentionally browse-focused.
 * - It does not render modals directly.
 * - Modal orchestration is handled through the shared
 *   admin playable store and, after refactor, the
 *   Playables modal container.
 */

import { onMounted, ref, watch } from 'vue'
import { playableClassService } from '@/features/admin/services/playableClassService'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'
import type { PlayableClassEditItem } from '@/features/admin/types/playableTypes'

/**
 * ---------------------------------------------------------
 * Emits
 * ---------------------------------------------------------
 *
 * `close` allows the parent browse modal/container to close
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
 * `classes`
 * - local table data for the current playable class browse view
 */
const store = useAdminPlayableStore()
const classes = ref<PlayableClassEditItem[]>([])

/**
 * ---------------------------------------------------------
 * Data Loading
 * ---------------------------------------------------------
 *
 * Fetches the current playable class browse list from the
 * admin service.
 */
async function fetchClasses() {
  const res = await playableClassService.getPlayableClasses()
  classes.value = res as PlayableClassEditItem[]
}

/**
 * ---------------------------------------------------------
 * Row Interaction
 * ---------------------------------------------------------
 *
 * Selecting a row closes the surrounding browse view and
 * opens the dedicated class edit modal through the store.
 */
function handleRowClick(item: PlayableClassEditItem) {
  emit('close')
  store.openEditClassModal(item)
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
onMounted(fetchClasses)
watch(() => store.lastPlayableRefresh, fetchClasses)
</script>