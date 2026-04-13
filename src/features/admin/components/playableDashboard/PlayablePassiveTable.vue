<template>
  <div class="space-y-4">
    <!--
      =========================================================
      Header
      =========================================================

      This table is a browse/edit surface for canonical passive
      definitions. Creation is handled elsewhere in the dashboard,
      so no create action is exposed here.
    -->
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Playable Passives
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Browse and select canonical passive definitions for editing.
      </p>
    </div>

    <!--
      =========================================================
      Filter Controls
      =========================================================

      These filters are usage-based, not canonical category-based.

      Meanings:
      - All
        show all canonical passive definitions
      - Class
        show passives assigned to at least one class
      - Species
        show passives assigned to at least one species
    -->
    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="rounded px-3 py-1 text-sm transition"
        :class="
          filterMode === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-700'
        "
        @click="filterMode = 'all'"
      >
        All
      </button>

      <button
        type="button"
        class="rounded px-3 py-1 text-sm transition"
        :class="
          filterMode === 'class'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-700'
        "
        @click="filterMode = 'class'"
      >
        Class
      </button>

      <button
        type="button"
        class="rounded px-3 py-1 text-sm transition"
        :class="
          filterMode === 'species'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-700'
        "
        @click="filterMode = 'species'"
      >
        Species
      </button>
    </div>

    <!--
      =========================================================
      Loading / Error
      =========================================================
    -->
    <div
      v-if="isLoading"
      class="rounded border border-dashed border-gray-300 p-6 text-sm text-gray-500 dark:border-neutral-700 dark:text-gray-400"
    >
      Loading passive records...
    </div>

    <div
      v-else-if="loadError"
      class="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
    >
      {{ loadError }}
    </div>

    <!--
      =========================================================
      Table
      =========================================================
    -->
    <div v-else class="overflow-x-auto rounded border dark:border-neutral-800">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
        <thead class="bg-gray-50 dark:bg-neutral-900">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Display Name
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Effect Type
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Active
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Sort
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 bg-white dark:divide-neutral-800 dark:bg-black">
          <tr
            v-for="passive in filteredPassives"
            :key="passive.id"
            class="cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900"
            @click="handleRowClick(passive)"
          >
            <td class="px-4 py-3">
              <div class="font-medium text-gray-900 dark:text-gray-100">
                {{ passive.displayName }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ passive.slug }}
              </div>
            </td>

            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              {{ passive.effectType || '—' }}
            </td>

            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              {{ passive.isActive ? 'Yes' : 'No' }}
            </td>

            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              {{ passive.sortOrder }}
            </td>
          </tr>

          <tr v-if="filteredPassives.length === 0">
            <td
              colspan="4"
              class="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              No passive records found for this filter.
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
 * Playable Passive Table
 * =========================================================
 *
 * Canonical browse table for playable passive definitions.
 *
 * Responsibilities:
 * - fetch and display canonical passive records
 * - allow row selection for edit flow
 * - support usage-based visual filtering
 *
 * Notes:
 * - this table manages canonical passive definitions only
 * - creation is handled elsewhere in the dashboard flow
 * - the filter toggle is usage-based, not category-based
 * - "Class" means assigned to at least one class
 * - "Species" means assigned to at least one species
 */

import { computed, onMounted, ref, watch } from 'vue'
import {
  getPlayableClasses,
  getPlayableClassPassives,
} from '@/features/admin/services/playableClassService'
import { getPlayablePassives } from '@/features/admin/services/playablePassiveService'
import {
  getPlayableSpecies,
  getPlayableSpeciesPassives,
} from '@/features/admin/services/playableSpeciesService'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'
import type { PlayablePassiveEditItem } from '@/features/admin/types/playableTypes'

const store = useAdminPlayableStore()

/**
 * ---------------------------------------------------------
 * Local Table State
 * ---------------------------------------------------------
 */
const passives = ref<PlayablePassiveEditItem[]>([])
const isLoading = ref(false)
const loadError = ref<string | null>(null)

/**
 * ---------------------------------------------------------
 * Usage Filter State
 * ---------------------------------------------------------
 *
 * Controls which passive subset is shown in the table.
 *
 * Modes:
 * - all
 * - class
 * - species
 */
const filterMode = ref<'all' | 'class' | 'species'>('all')

/**
 * ---------------------------------------------------------
 * Assignment Usage Tracking
 * ---------------------------------------------------------
 *
 * These sets record whether a passive is currently assigned to:
 * - at least one class
 * - at least one species
 *
 * This supports usage-based filtering in the browse table.
 */
const classAssignedPassiveIds = ref<Set<string>>(new Set())
const speciesAssignedPassiveIds = ref<Set<string>>(new Set())

/**
 * ---------------------------------------------------------
 * Filtered Rows
 * ---------------------------------------------------------
 */
const filteredPassives = computed(() => {
  if (filterMode.value === 'class') {
    return passives.value.filter((passive) =>
      classAssignedPassiveIds.value.has(passive.id)
    )
  }

  if (filterMode.value === 'species') {
    return passives.value.filter((passive) =>
      speciesAssignedPassiveIds.value.has(passive.id)
    )
  }

  return passives.value
})

/**
 * ---------------------------------------------------------
 * Data Load
 * ---------------------------------------------------------
 *
 * Loads:
 * - all canonical passives
 * - all class passive assignments
 * - all species passive assignments
 *
 * Current implementation derives usage-based filtering from
 * existing per-entity assignment endpoints.
 *
 * This is correct for the current architecture, though it may
 * later be optimized by a dedicated aggregate backend endpoint.
 */
async function loadPassives() {
  isLoading.value = true
  loadError.value = null

  try {
    const [allPassives, allClasses, allSpecies] = await Promise.all([
      getPlayablePassives(),
      getPlayableClasses(),
      getPlayableSpecies(),
    ])

    passives.value = allPassives

    const classPassiveResults = await Promise.all(
      allClasses.map((classItem) =>
        getPlayableClassPassives(classItem.id)
      )
    )

    const speciesPassiveResults = await Promise.all(
      allSpecies.map((speciesItem) =>
        getPlayableSpeciesPassives(speciesItem.id)
      )
    )

    const nextClassAssignedIds = new Set<string>()
    const nextSpeciesAssignedIds = new Set<string>()

    for (const passiveList of classPassiveResults) {
      for (const passive of passiveList) {
        nextClassAssignedIds.add(passive.id)
      }
    }

    for (const passiveList of speciesPassiveResults) {
      for (const passive of passiveList) {
        nextSpeciesAssignedIds.add(passive.id)
      }
    }

    classAssignedPassiveIds.value = nextClassAssignedIds
    speciesAssignedPassiveIds.value = nextSpeciesAssignedIds
  } catch (error) {
    console.error('Failed to load playable passives:', error)
    loadError.value = 'Failed to load playable passives.'
    classAssignedPassiveIds.value = new Set()
    speciesAssignedPassiveIds.value = new Set()
  } finally {
    isLoading.value = false
  }
}

/**
 * ---------------------------------------------------------
 * Row Click
 * ---------------------------------------------------------
 */
function handleRowClick(passive: PlayablePassiveEditItem) {
  store.openEditPassiveModal(passive)
}

onMounted(loadPassives)

watch(
  () => store.lastPlayableRefresh,
  () => {
    loadPassives()
  }
)
</script>