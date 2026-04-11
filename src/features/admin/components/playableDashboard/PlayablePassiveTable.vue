<template>
  <div class="space-y-4">
    <!--
      =========================================================
      Header
      =========================================================
    -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Playable Passives
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Browse and select canonical passive definitions for editing.
        </p>
      </div>

      <button
        type="button"
        class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        @click="store.openCreatePassiveModal()"
      >
        Create Passive
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
            v-for="passive in passives"
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

          <tr v-if="passives.length === 0">
            <td
              colspan="4"
              class="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              No passive records found.
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
 * - provide a quick entry point to passive creation
 *
 * Notes:
 * - this table manages canonical passive definitions only
 * - species/class passive assignments are a separate unified system
 */

import { onMounted, ref, watch } from 'vue'
import { getPlayablePassives } from '@/features/admin/services/playablePassiveService'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'
import type { PlayablePassiveEditItem } from '@/features/admin/types/playableTypes'

const store = useAdminPlayableStore()

const passives = ref<PlayablePassiveEditItem[]>([])
const isLoading = ref(false)
const loadError = ref<string | null>(null)

async function loadPassives() {
  isLoading.value = true
  loadError.value = null

  try {
    passives.value = await getPlayablePassives()
  } catch (error) {
    console.error('Failed to load playable passives:', error)
    loadError.value = 'Failed to load playable passives.'
  } finally {
    isLoading.value = false
  }
}

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