<!-- /src/features/admin/components/playableDashboard/PlayableTableWidget.vue -->
<template>
  <WidgetWrapper title="Playable Overview" icon="Table">
    <div class="space-y-4">
      <!-- Toggle -->
      <div class="flex gap-2">
        <button
          @click="activeType = 'species'"
          :class="
            activeType === 'species'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 dark:bg-neutral-700 dark:text-gray-200'
          "
          class="rounded px-3 py-1 text-sm font-medium transition-colors"
        >
          Species
        </button>

        <button
          @click="activeType = 'classes'"
          :class="
            activeType === 'classes'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 dark:bg-neutral-700 dark:text-gray-200'
          "
          class="rounded px-3 py-1 text-sm font-medium transition-colors"
        >
          Classes
        </button>
      </div>

      <!-- Species Summary -->
      <div
        v-if="activeType === 'species'"
        class="space-y-2 text-sm text-gray-700 dark:text-gray-300"
      >
        <p v-if="loadingSpecies">Loading species summary...</p>

        <p v-else-if="speciesError" class="text-red-600 dark:text-red-400">
          Failed to load species summary.
        </p>

        <ul v-else class="space-y-1">
          <li><strong>{{ species.length }}</strong> total species</li>
          <li><strong>{{ activeSpeciesCount }}</strong> active</li>
          <li><strong>{{ inactiveSpeciesCount }}</strong> inactive</li>
          <li>
            <strong>{{ lastUpdatedSpeciesLabel }}</strong> most recently updated
          </li>
        </ul>
      </div>

      <!-- Classes Summary -->
      <div
        v-else
        class="text-sm text-gray-600 dark:text-gray-300"
      >
        Class summary is not yet implemented.
      </div>
    </div>
  </WidgetWrapper>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import WidgetWrapper from '@/components/molecules/WidgetWrapper.vue'
import { playableSpeciesService } from '@/features/admin/services/playableSpeciesService'
import type { PlayableSpeciesBrowseItem } from '@/features/admin/types/playableTypes'

const activeType = ref<'species' | 'classes'>('species')

const species = ref<PlayableSpeciesBrowseItem[]>([])
const loadingSpecies = ref(false)
const speciesError = ref<string | null>(null)

async function fetchSpecies() {
  loadingSpecies.value = true
  speciesError.value = null

  try {
    const res = await playableSpeciesService.getPlayableSpecies()
    species.value = res
  } catch (error) {
    console.error(error)
    speciesError.value = 'Failed to load species summary.'
  } finally {
    loadingSpecies.value = false
  }
}

const activeSpeciesCount = computed(() =>
  species.value.filter((item) => item.isActive).length
)

const inactiveSpeciesCount = computed(() =>
  species.value.filter((item) => !item.isActive).length
)

const mostRecentlyUpdatedSpecies = computed(() => {
  if (!species.value.length) return null

  return [...species.value]
    .filter((item) => item.updatedAt)
    .sort((a, b) => {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
      return bTime - aTime
    })[0] ?? null
})

const lastUpdatedSpeciesLabel = computed(() => {
  const item = mostRecentlyUpdatedSpecies.value
  return item?.displayName ?? '—'
})

onMounted(fetchSpecies)
</script>