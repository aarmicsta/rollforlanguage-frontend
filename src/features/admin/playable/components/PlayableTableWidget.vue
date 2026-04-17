<!-- /src/features/admin/components/playableDashboard/PlayableTableWidget.vue -->
<template>
  <WidgetWrapper title="Playable Overview" icon="Table">
    <div class="space-y-4">
      <!--
        ---------------------------------------------------------
        Entity Type Toggle
        ---------------------------------------------------------
      -->
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

      <!--
        ---------------------------------------------------------
        Species Summary
        ---------------------------------------------------------
      -->
      <div
        v-if="activeType === 'species'"
        class="space-y-2 text-sm text-gray-700 dark:text-gray-300"
      >
        <p v-if="loadingSpecies">Loading species summary...</p>

        <p v-else-if="speciesError" class="text-red-600 dark:text-red-400">
          {{ speciesError }}
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

      <!--
        ---------------------------------------------------------
        Class Summary
        ---------------------------------------------------------
      -->
      <div
        v-else
        class="space-y-2 text-sm text-gray-700 dark:text-gray-300"
      >
        <p v-if="loadingClasses">Loading class summary...</p>

        <p v-else-if="classesError" class="text-red-600 dark:text-red-400">
          {{ classesError }}
        </p>

        <ul v-else class="space-y-1">
          <li><strong>{{ classes.length }}</strong> total classes</li>
          <li><strong>{{ activeClassesCount }}</strong> active</li>
          <li><strong>{{ inactiveClassesCount }}</strong> inactive</li>
          <li>
            <strong>{{ lastUpdatedClassLabel }}</strong> most recently updated
          </li>
        </ul>
      </div>
    </div>
  </WidgetWrapper>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Playable Table Widget
 * =========================================================
 *
 * Summary widget for Playables admin overview data.
 *
 * Responsibilities:
 * - show high-level summary stats for playable species
 * - show high-level summary stats for playable classes
 * - react to the shared Playables refresh trigger
 *
 * Notes:
 * - This widget is display-only.
 * - It does not manage browse/edit/create workflows.
 * - Data is fetched from the admin services and reduced into
 *   simple summary metrics for quick dashboard visibility.
 */

import { computed, onMounted, ref, watch } from 'vue'
import WidgetWrapper from '@/components/molecules/WidgetWrapper.vue'
import { playableClassService } from '@/features/admin/services/playableClassService'
import { playableSpeciesService } from '@/features/admin/services/playableSpeciesService'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'
import type {
  PlayableClassEditItem,
  PlayableSpeciesEditItem,
} from '@/features/admin/types/playableTypes'

/**
 * ---------------------------------------------------------
 * Store
 * ---------------------------------------------------------
 *
 * Used here only for the shared refresh trigger.
 */
const store = useAdminPlayableStore()

/**
 * ---------------------------------------------------------
 * Local UI State
 * ---------------------------------------------------------
 */
const activeType = ref<'species' | 'classes'>('species')

/**
 * ---------------------------------------------------------
 * Species State
 * ---------------------------------------------------------
 */
const species = ref<PlayableSpeciesEditItem[]>([])
const loadingSpecies = ref(false)
const speciesError = ref<string | null>(null)

/**
 * ---------------------------------------------------------
 * Class State
 * ---------------------------------------------------------
 */
const classes = ref<PlayableClassEditItem[]>([])
const loadingClasses = ref(false)
const classesError = ref<string | null>(null)

/**
 * ---------------------------------------------------------
 * Data Loading
 * ---------------------------------------------------------
 */
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

async function fetchClasses() {
  loadingClasses.value = true
  classesError.value = null

  try {
    const res = await playableClassService.getPlayableClasses()
    classes.value = res as PlayableClassEditItem[]
  } catch (error) {
    console.error(error)
    classesError.value = 'Failed to load class summary.'
  } finally {
    loadingClasses.value = false
  }
}

async function fetchAllPlayableSummaries() {
  await Promise.all([fetchSpecies(), fetchClasses()])
}

/**
 * ---------------------------------------------------------
 * Species Metrics
 * ---------------------------------------------------------
 */
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
  return mostRecentlyUpdatedSpecies.value?.displayName ?? '—'
})

/**
 * ---------------------------------------------------------
 * Class Metrics
 * ---------------------------------------------------------
 */
const activeClassesCount = computed(() =>
  classes.value.filter((item) => item.isActive).length
)

const inactiveClassesCount = computed(() =>
  classes.value.filter((item) => !item.isActive).length
)

const mostRecentlyUpdatedClass = computed(() => {
  if (!classes.value.length) return null

  return [...classes.value]
    .filter((item) => item.updatedAt)
    .sort((a, b) => {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
      return bTime - aTime
    })[0] ?? null
})

const lastUpdatedClassLabel = computed(() => {
  return mostRecentlyUpdatedClass.value?.displayName ?? '—'
})

/**
 * ---------------------------------------------------------
 * Lifecycle / Refresh Sync
 * ---------------------------------------------------------
 *
 * Load both summaries on mount and whenever the shared
 * Playables refresh key changes.
 */
onMounted(fetchAllPlayableSummaries)
watch(() => store.lastPlayableRefresh, fetchAllPlayableSummaries)
</script>