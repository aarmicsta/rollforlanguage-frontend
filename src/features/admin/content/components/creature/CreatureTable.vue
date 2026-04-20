<template>
  <!--
    =========================================================
    Creature Table
    =========================================================

    First real Content domain surface.

    Responsibilities:
    - fetch creature data from backend
    - render a simple, stable admin table
    - establish baseline pattern for future content domains
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
    <div
      v-else-if="!creatures.length"
      class="text-sm text-gray-500"
    >
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
            class="border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800"
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
                  'text-xs px-2 py-1 rounded',
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
import { onMounted, ref } from 'vue'
import {
  getCreatures,
  type CreatureListItem,
} from '@/features/admin/content/services/creatureService'
import { useContentStore } from '@/features/admin/content/stores/contentStore'

/**
 * =========================================================
 * State
 * =========================================================
 */
const creatures = ref<CreatureListItem[]>([])
const loading = ref(false)
const error = ref('')

/**
 * ---------------------------------------------------------
 * Store / Local State
 * ---------------------------------------------------------
 *
 * `store`
 * - shared admin playable UI state
 *
 * `creature`
 * - local table data for the creature browse view
 */
const store = useContentStore()

/**
 * =========================================================
 * Data Fetch
 * =========================================================
 */
const fetchCreatures = async () => {
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
 * Selecting a row closes the browse view and opens the
 * species edit modal via the store.
 */
const handleRowClick = (creature: CreatureListItem) => {
  console.log('Selected creature:', creature)
}

/**
 * =========================================================
 * Lifecycle
 * =========================================================
 */
onMounted(() => {
  fetchCreatures()
})
</script>