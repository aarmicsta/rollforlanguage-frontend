<!-- /src/features/admin/components/playableDashboard/PlayableSpeciesTable.vue -->
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
            v-for="item in species"
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

          <tr v-if="!species.length">
            <td colspan="5" class="px-4 py-6 text-center text-gray-500">
              No playable species found.
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
 * Playable Species Table
 * =========================================================
 *
 * Admin browse table for playable species.
 *
 * Responsibilities:
 * - fetch and display playable species browse records
 * - refresh when the shared playable refresh key changes
 * - open the species edit workflow when a row is selected
 *
 * Notes:
 * - This component is browse-only.
 * - It does not render modals directly.
 * - Modal orchestration is handled via the admin playable store
 *   and the Playables modal container.
 */

import { onMounted, ref, watch } from 'vue'
import { playableSpeciesService } from '@/features/admin/services/playableSpeciesService'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'
import type { PlayableSpeciesBrowseItem } from '@/features/admin/types/playableTypes'

/**
 * ---------------------------------------------------------
 * Emits
 * ---------------------------------------------------------
 *
 * `close` allows the parent browse modal/container to close
 * before transitioning into the edit workflow.
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
 * `species`
 * - local table data for the species browse view
 */
const store = useAdminPlayableStore()
const species = ref<PlayableSpeciesBrowseItem[]>([])

/**
 * ---------------------------------------------------------
 * Data Loading
 * ---------------------------------------------------------
 *
 * Fetches playable species from the admin service.
 */
async function fetchSpecies() {
  const res = await playableSpeciesService.getPlayableSpecies()
  species.value = res
}

/**
 * ---------------------------------------------------------
 * Row Interaction
 * ---------------------------------------------------------
 *
 * Selecting a row closes the browse view and opens the
 * species edit modal via the store.
 */
function handleRowClick(item: PlayableSpeciesBrowseItem) {
  emit('close')
  store.openEditSpeciesModal(item)
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
 * - fetch on mount
 * - refetch whenever the shared playable refresh key changes
 */
onMounted(fetchSpecies)
watch(() => store.lastPlayableRefresh, fetchSpecies)
</script>