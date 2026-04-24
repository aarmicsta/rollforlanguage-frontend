<template>
  <!--
    =========================================================
    Creature Base Stats Table
    =========================================================

    Management table for creature base stat assignment.

    Responsibilities:
    - fetch and display creature base stat summary rows
    - refresh when the shared Content refresh signal changes
    - open the creature base stats edit workflow when a row is selected

    Notes:
    - This table does not edit stat values directly.
    - Row selection opens a dedicated edit modal.
    - Base stats represent the foundational creature stat layer;
      future modifiers/scaling systems should layer on top.
  -->
  <div class="p-4">
    <!-- Loading State -->
    <div v-if="loading" class="text-sm text-gray-500">
      Loading creature base stats...
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-sm text-red-500">
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="!rows.length" class="text-sm text-gray-500">
      No creature base stat records found.
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b text-gray-600">
          <tr>
            <th class="px-3 py-2">Creature</th>
            <th class="px-3 py-2">Type</th>
            <th class="px-3 py-2">Size</th>
            <th class="px-3 py-2">Assigned Stats</th>
            <th class="px-3 py-2">Last Updated</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="row in rows"
            :key="row.creatureId"
            :class="[
              'cursor-pointer border-b',
              'hover:bg-gray-50 dark:hover:bg-neutral-800',
              selectedCreature?.id === row.creatureId
                ? 'bg-blue-50 dark:bg-neutral-800'
                : '',
            ]"
            @click="handleRowClick(row)"
          >
            <td class="px-3 py-2">
              <div class="font-medium text-gray-800 dark:text-gray-100">
                {{ row.creatureDisplayName }}
              </div>
            </td>

            <td class="px-3 py-2">
              {{ row.creatureType }}
            </td>

            <td class="px-3 py-2">
              {{ row.sizeCategory }}
            </td>

            <td class="px-3 py-2">
              {{ row.assignedStatCount }}
            </td>

            <td class="px-3 py-2">
              {{ formatDate(row.updatedAt) }}
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
 * Imports
 * =========================================================
 */
import { computed, onMounted, ref, watch } from 'vue'

import {
  getCreatureBaseStatsTable,
  type CreatureBaseStatsTableRow,
} from '@/features/admin/content/services/creatureService'
import { useContentStore } from '@/features/admin/content/stores/contentStore'

/**
 * ---------------------------------------------------------
 * Store / Local State
 * ---------------------------------------------------------
 */
const store = useContentStore()
const rows = ref<CreatureBaseStatsTableRow[]>([])

/**
 * ---------------------------------------------------------
 * Derived State
 * ---------------------------------------------------------
 *
 * Used to visually reflect the currently selected creature
 * row while the base stats edit workflow is active.
 */
const selectedCreature = computed(() => store.selectedCreature)

/**
 * ---------------------------------------------------------
 * Request State
 * ---------------------------------------------------------
 */
const loading = ref(false)
const error = ref('')

/**
 * ---------------------------------------------------------
 * Data Loading
 * ---------------------------------------------------------
 *
 * Fetches creature base stat summary rows from the admin
 * service.
 */
async function fetchRows() {
  loading.value = true
  error.value = ''

  try {
    rows.value = await getCreatureBaseStatsTable()
  } catch (err: any) {
    error.value = err?.message || 'Failed to load creature base stats'
  } finally {
    loading.value = false
  }
}

/**
 * ---------------------------------------------------------
 * Row Interaction
 * ---------------------------------------------------------
 *
 * Selecting a row establishes the selected creature context
 * and opens the dedicated creature base stats modal.
 */
function handleRowClick(row: CreatureBaseStatsTableRow) {
  store.setSelectedCreature({
    id: row.creatureId,
    name: '',
    slug: '',
    displayName: row.creatureDisplayName,
    description: null,
    creatureType: row.creatureType,
    sizeCategory: row.sizeCategory,
    intelligenceCategory: null,
    threatLevel: null,
    iconMediaAssetId: null,
    isActive: null,
    sortOrder: null,
    createdAt: null,
    updatedAt: row.updatedAt,
  })

  store.openCreatureBaseStatsModal()
}

/**
 * ---------------------------------------------------------
 * Formatting
 * ---------------------------------------------------------
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
 * - refetch whenever the shared Content refresh signal changes
 */
onMounted(fetchRows)
watch(() => store.lastContentRefresh, fetchRows)
</script>