<template>
  <!--
    =========================================================
    Creature Edit Modal
    =========================================================

    First-pass edit modal for creatures.

    Responsibilities:
    - display selected creature data
    - provide structured foundation for future editing workflow

    Notes:
    - currently read-only (no form submission yet)
    - mirrors early-stage Playables modal structure
    - will expand to include editing, validation, and persistence
  -->

  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div
      class="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900"
    >
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Edit Creature
        </h2>

        <button
          class="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
          @click="handleClose"
        >
          ✕
        </button>
      </div>

      <!-- Body -->
      <div v-if="creature" class="mt-4 space-y-3">
        <div>
          <p class="text-xs text-gray-500">Name</p>
          <p class="text-sm text-gray-800 dark:text-gray-100">
            {{ creature.displayName }}
          </p>
        </div>

        <div>
          <p class="text-xs text-gray-500">Type</p>
          <p class="text-sm text-gray-800 dark:text-gray-100">
            {{ creature.creatureType }}
          </p>
        </div>

        <div>
          <p class="text-xs text-gray-500">Size</p>
          <p class="text-sm text-gray-800 dark:text-gray-100">
            {{ creature.sizeCategory }}
          </p>
        </div>

        <div>
          <p class="text-xs text-gray-500">Threat</p>
          <p class="text-sm text-gray-800 dark:text-gray-100">
            {{ creature.threatLevel ?? '—' }}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-6 flex justify-end">
        <button
          class="rounded bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600"
          @click="handleClose"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Imports
 * =========================================================
 */
import { computed } from 'vue'
import { useContentStore } from '@/features/admin/content/stores/contentStore'

/**
 * =========================================================
 * Store
 * =========================================================
 */
const store = useContentStore()

/**
 * =========================================================
 * Selected Creature
 * =========================================================
 */
const creature = computed(() => store.selectedCreature)

/**
 * =========================================================
 * Actions
 * =========================================================
 */
const handleClose = () => {
  store.clearSelectedCreature()
}
</script>