<template>
  <!--
    =========================================================
    Playable Stat Modifier Table
    =========================================================

    Unified admin table for:
    - stat baselines
    - species stat modifiers
    - class stat modifiers

    Responsibilities:
    - display normalized modifier rows across all contexts
    - provide context-based filtering
    - open edit modal on row selection
  -->
  <div class="space-y-4 text-gray-800 dark:text-gray-100">
    <!--
      ---------------------------------------------------------
      Context Filter
      ---------------------------------------------------------
    -->
    <div class="flex gap-2">
      <button
        v-for="option in filterOptions"
        :key="option.value"
        @click="selectedFilter = option.value"
        :class="[
          'rounded px-3 py-1 text-sm border transition',
          selectedFilter === option.value
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-black hover:bg-gray-200 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600'
        ]"
      >
        {{ option.label }}
      </button>
    </div>

    <!--
      ---------------------------------------------------------
      Table
      ---------------------------------------------------------
    -->
    <div class="overflow-x-auto rounded border dark:border-neutral-700">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-100 dark:bg-neutral-800">
          <tr>
            <th class="px-4 py-2 text-left">Context</th>
            <th class="px-4 py-2 text-left">Target</th>
            <th class="px-4 py-2 text-left">Stat</th>
            <th class="px-4 py-2 text-left">Value</th>
            <th class="px-4 py-2 text-left">Last Updated</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in filteredRows"
            :key="rowKey(item)"
            class="cursor-pointer border-t hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            @click="handleRowClick(item)"
          >
            <td class="px-4 py-2 capitalize">{{ item.context }}</td>
            <td class="px-4 py-2">
              {{ item.targetDisplayName }}
            </td>
            <td class="px-4 py-2">
              {{ item.statDisplayName }}
            </td>
            <td class="px-4 py-2">
              {{ item.value }}
            </td>
            <td class="px-4 py-2">
              {{ formatDate(item.updatedAt) }}
            </td>
          </tr>

          <tr v-if="!filteredRows.length">
            <td colspan="5" class="px-4 py-6 text-center text-gray-500">
              No stat modifier records found.
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
 * Playable Stat Modifier Table
 * =========================================================
 *
 * Notes:
 * - Uses a unified row shape across all modifier contexts
 * - Includes a context filter for usability
 * - Current implementation uses mock data for UI validation
 */

import { ref, computed } from 'vue'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'
import type { PlayableStatModifierRow } from '@/features/admin/types/playableTypes'

const emit = defineEmits<{
  (e: 'close'): void
}>()

/**
 * ---------------------------------------------------------
 * Store
 * ---------------------------------------------------------
 */
const store = useAdminPlayableStore()

type StatModifierFilter = 'all' | 'baseline' | 'species' | 'class'

/**
 * ---------------------------------------------------------
 * Filter State
 * ---------------------------------------------------------
 */
const selectedFilter = ref<StatModifierFilter>('all')

const filterOptions: Array<{
  label: string
  value: StatModifierFilter
}> = [
  { label: 'All', value: 'all' },
  { label: 'Baseline', value: 'baseline' },
  { label: 'Species', value: 'species' },
  { label: 'Class', value: 'class' },
]

/**
 * ---------------------------------------------------------
 * Mock Data (Temporary)
 * ---------------------------------------------------------
 */
const rows = ref<PlayableStatModifierRow[]>([
  {
    context: 'baseline',
    targetId: null,
    targetDisplayName: 'Global',
    statId: 'ref_stat_hp',
    statDisplayName: 'HP',
    value: 10,
    updatedAt: null,
  },
  {
    context: 'species',
    targetId: 'species_dragonborn',
    targetDisplayName: 'Dragonborn',
    statId: 'ref_stat_attack',
    statDisplayName: 'Attack',
    value: 1,
    updatedAt: null,
  },
  {
    context: 'class',
    targetId: 'class_barbarian',
    targetDisplayName: 'Barbarian',
    statId: 'ref_stat_defense',
    statDisplayName: 'Defense',
    value: 2,
    updatedAt: null,
  },
])

/**
 * ---------------------------------------------------------
 * Filtering
 * ---------------------------------------------------------
 */
const filteredRows = computed(() => {
  const filter = selectedFilter.value

  if (filter === 'all') {
    return rows.value
  }

  return rows.value.filter(row => row.context === filter)
})

/**
 * ---------------------------------------------------------
 * Row Interaction
 * ---------------------------------------------------------
 */
function handleRowClick(item: PlayableStatModifierRow) {
  emit('close')
  store.openEditStatModifierModal(item)
}

/**
 * ---------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------
 */
function formatDate(dateStr: string | null) {
  return dateStr ? new Date(dateStr).toLocaleDateString() : '—'
}

function rowKey(item: PlayableStatModifierRow) {
  return `${item.context}-${item.targetId ?? 'global'}-${item.statId}`
}
</script>