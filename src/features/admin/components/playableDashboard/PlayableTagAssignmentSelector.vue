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
    <p class="text-xs text-red-500">
        availableTags: {{ availableTags.length }} | selectedTagIds: {{ modelValue.length }}
    </p>

    <div
      class="rounded border px-3 py-3 dark:border-neutral-700"
    >
      <div
        v-if="availableTags && availableTags.length"
        class="flex flex-wrap gap-2"
      >
        <button
          v-for="tag in availableTags"
          :key="tag.id"
          type="button"
          class="inline-flex items-center rounded-full px-3 py-1 text-sm transition"
          :class="
            modelValue.includes(tag.id)
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
              : 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-gray-300'
          "
          @click="toggleTag(tag.id)"
        >
          {{ tag.displayName }}
          <span
            v-if="tag.tagCategory"
            class="ml-2 text-xs opacity-70"
          >
            ({{ tag.tagCategory }})
          </span>
        </button>
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
/**
 * ---------------------------------------------------------
 * Emits
 * ---------------------------------------------------------
 *
 * Emits the updated list of selected tag IDs back to the parent.
 */
const props = defineProps<{
  modelValue: string[]
  availableTags: Array<{
    id: string
    displayName: string
    tagCategory: string | null
    isActive: boolean | null
  }>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

/**
 * ---------------------------------------------------------
 * toggleTag
 * ---------------------------------------------------------
 *
 * Adds or removes a tag ID from the current selection, then
 * emits the updated full selected ID list back to the parent.
 *
 * This component remains UI-only:
 * - no fetching
 * - no saving
 * - no awareness of species vs class
 */
function toggleTag(tagId: string) {
  const next = props.modelValue.includes(tagId)
    ? props.modelValue.filter((id) => id !== tagId)
    : [...props.modelValue, tagId]

  emit('update:modelValue', next)
}
</script>