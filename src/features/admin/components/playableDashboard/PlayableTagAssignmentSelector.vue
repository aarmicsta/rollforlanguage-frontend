<!--
  =========================================================
  Playable Tag Assignment Selector
  =========================================================

  This component is a reusable assignment-level selector for
  applying existing playable tags to a specific entity.

  Intended usage:
  - playable species edit modal
  - playable class edit modal

  Responsibilities:
  - display available tag options
  - reflect currently selected tag IDs
  - emit updated selected tag IDs to the parent

  Non-responsibilities:
  - does NOT fetch tag data itself
  - does NOT save assignments itself
  - does NOT know whether it is editing a species or class

  Architectural principle:
  - parent owns data loading and persistence
  - this component remains a dumb/reusable UI control

  =========================================================
-->
<template>
  <div>
    <label class="mb-1 block text-xs text-gray-500">Tags</label>

    <div
      class="rounded border px-3 py-3 dark:border-neutral-700"
    >
      <div
        v-if="availableTags.length"
        class="flex flex-wrap gap-2"
      >
        <span
          v-for="tag in availableTags"
          :key="tag.id"
          class="inline-flex items-center rounded-full px-3 py-1 text-sm"
          :class="
            modelValue.includes(tag.id)
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
              : 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-gray-300'
          "
        >
          {{ tag.displayName }}
          <span
            v-if="tag.tagCategory"
            class="ml-2 text-xs opacity-70"
          >
            ({{ tag.tagCategory }})
          </span>
        </span>
      </div>

      <p
        v-else
        class="text-sm text-gray-500 dark:text-gray-400"
      >
        No playable tags available.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ---------------------------------------------------------
 * Props
 * ---------------------------------------------------------
 *
 * `modelValue`:
 * - the currently selected tag IDs
 *
 * `availableTags`:
 * - the full available canonical tag options the user may assign
 */
defineProps<{
  modelValue: string[]
  availableTags: Array<{
    id: string
    displayName: string
    tagCategory: string | null
    isActive: boolean | null
  }>
}>()

/**
 * ---------------------------------------------------------
 * Emits
 * ---------------------------------------------------------
 *
 * Emits the updated list of selected tag IDs back to the parent.
 */
defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()
</script>