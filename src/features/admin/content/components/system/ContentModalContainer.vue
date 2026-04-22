<template>
  <!--
    =========================================================
    Content Modal Container
    =========================================================
  -->

  <!-- Temporary Debug Modal -->
  <div
    v-if="selectedCreature"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
  >
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-900">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Creature Selected
      </h2>

      <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
        {{ selectedCreature.displayName }}
      </p>

      <button
        class="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        @click="store.clearSelectedCreature()"
      >
        Close
      </button>
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
 *
 * The Content modal container is fully store-driven.
 */
const store = useContentStore()

/**
 * =========================================================
 * Selected Records
 * =========================================================
 *
 * Temporary computed bridge used to confirm that centralized
 * modal-layer access to selected creature state is working.
 */
const selectedCreature = computed(() => store.selectedCreature)
</script>