<template>
  <!--
    =========================================================
    Creature Table
    =========================================================

    First real Content-domain management table.

    Responsibilities:
    - fetch and display creature browse records
    - refresh when the shared Content refresh signal changes
    - open the creature edit workflow when a row is selected

    Notes:
    - This component is browse-only.
    - It does not render modals directly.
    - Modal orchestration is handled via the Content store
      and the Content modal container.
  -->
  <div class="p-4">
    <!-- Loading State -->
    <div v-if="loading" class="text-sm text-gray-500">
      Loading creatures...
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-sm text-red-500">
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="!creatures.length" class="text-sm text-gray-500">
      No creatures found.
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full text-sm text-left">
        <thead class="border-b text-gray-600">
          <tr>
            <th class="px-3 py-2">Name</th>
            <th class="px-3 py-2">Type</th>
            <th class="px-3 py-2">Size</th>
            <th class="px-3 py-2">Intelligence</th>
            <th class="px-3 py-2">Threat</th>
            <th class="px-3 py-2">Active</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="creature in creatures"
            :key="creature.id"
            :class="[
              'border-b cursor-pointer',
              'hover:bg-gray-50 dark:hover:bg-neutral-800',
              selectedCreature?.id === creature.id
                ? 'bg-blue-50 dark:bg-neutral-800'
                : ''
            ]"
            @click="handleRowClick(creature)"
          >
            <td class="px-3 py-2">
              <div class="font-medium text-gray-800 dark:text-gray-100">
                {{ creature.displayName }}
              </div>
              <div class="text-xs text-gray-500">
                {{ creature.slug }}
              </div>
            </td>

            <td class="px-3 py-2">
              {{ creature.creatureType }}
            </td>

            <td class="px-3 py-2">
              {{ creature.sizeCategory }}
            </td>

            <td class="px-3 py-2">
              {{ creature.intelligenceCategory ?? '—' }}
            </td>

            <td class="px-3 py-2">
              {{ creature.threatLevel ?? '—' }}
            </td>

            <td class="px-3 py-2">
              <span
                :class="[
                  'rounded px-2 py-1 text-xs',
                  creature.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-600'
                ]"
              >
                {{ creature.isActive ? 'Active' : 'Inactive' }}
              </span>
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
  getCreatures,
  type CreatureListItem,
} from '@/features/admin/content/services/creatureService'
import { useContentStore } from '@/features/admin/content/stores/contentStore'

/**
 * ---------------------------------------------------------
 * Store / Local State
 * ---------------------------------------------------------
 *
 * `store`
 * - shared admin Content UI state
 *
 * `creatures`
 * - local table data for the creature browse view
 */
const store = useContentStore()
const creatures = ref<CreatureListItem[]>([])

/**
 * ---------------------------------------------------------
 * Derived State
 * ---------------------------------------------------------
 *
 * Used to visually reflect the currently selected creature
 * row while the edit workflow is active.
 */
const selectedCreature = computed(() => store.selectedCreature)

/**
 * ---------------------------------------------------------
 * Request State
 * ---------------------------------------------------------
 *
 * Local loading and error state for creature browse loading.
 */
const loading = ref(false)
const error = ref('')

/**
 * ---------------------------------------------------------
 * Data Loading
 * ---------------------------------------------------------
 *
 * Fetches creature browse records from the admin service.
 */
async function fetchCreatures() {
  loading.value = true
  error.value = ''

  try {
    creatures.value = await getCreatures()
  } catch (err: any) {
    error.value = err?.message || 'Failed to load creatures'
  } finally {
    loading.value = false
  }
}

/**
 * ---------------------------------------------------------
 * Row Interaction
 * ---------------------------------------------------------
 *
 * Selecting a row opens the creature edit workflow via
 * shared Content-store selection state.
 */
function handleRowClick(creature: CreatureListItem) {
  store.setSelectedCreature(creature)
}

/**
 * ---------------------------------------------------------
 * Lifecycle / Refresh Sync
 * ---------------------------------------------------------
 *
 * - fetch on mount
 * - refetch whenever the shared Content refresh signal changes
 */
onMounted(fetchCreatures)
watch(() => store.lastContentRefresh, fetchCreatures)
</script>