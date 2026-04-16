<template>
  <section
    class="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
  >
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-200 dark:border-neutral-700">
      <h1 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Content / {{ activeDomainLabel }}
      </h1>
    </div>

    <!-- Domain Pills -->
    <div class="px-4 py-3 flex flex-wrap items-center gap-3">
      <button
        type="button"
        :class="getPillClasses('creatures')"
        disabled
      >
        Creatures
      </button>

      <button
        type="button"
        :class="getPillClasses('items')"
        disabled
      >
        Items
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Content Dashboard Context Bar
 * =========================================================
 *
 * Responsibilities
 * - Display the current Content dashboard context
 * - Show the active content domain in the header
 * - Render domain pills for Creatures and Items
 *
 * Notes
 * - First-pass implementation is presentational only
 * - Domain switching behavior will be added later
 * - Active state is currently driven by the incoming prop
 * =========================================================
 */

import { computed } from 'vue'

type ContentDomain = 'creatures' | 'items'

const props = defineProps<{
  activeDomain: ContentDomain
}>()

const activeDomainLabel = computed(() => {
  return props.activeDomain === 'creatures' ? 'Creatures' : 'Items'
})

function getPillClasses(domain: ContentDomain): string[] {
  const isActive = props.activeDomain === domain

  return [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive
      ? 'ring-2 ring-white text-white bg-white/10'
      : 'border border-white/10 bg-white/5 text-gray-300',
  ]
}
</script>