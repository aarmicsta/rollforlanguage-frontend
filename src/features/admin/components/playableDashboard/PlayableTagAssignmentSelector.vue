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
        v-if="availableTags && availableTags.length"
        class="space-y-4"
      >

      <!--
        Tags are grouped by canonical tagCategory so assignment UI remains
        organized and scalable as the tag set grows.
      -->
        <section
          v-for="group in groupedTags"
          :key="group.categoryLabel"
          class="space-y-2 border-b pb-3 last:border-b-0"
        >
          <h4 class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {{ formatCategoryLabel(group.categoryLabel) }}
          </h4>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in group.tags"
              :key="tag.id"
              type="button"
              :disabled="props.disabled"
              class="inline-flex items-center rounded-full px-3 py-1 text-sm transition"
              :class="
                modelValue.includes(tag.id)
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                  : 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-gray-300'
              "
              @click="toggleTag(tag.id)"
            >
              {{ tag.displayName }}
            </button>
          </div>
        </section>
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
import { computed } from 'vue'
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
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

/**
 * ---------------------------------------------------------
 * formatCategoryLabel
 * ---------------------------------------------------------
 *
 * Converts canonical tag category values into human-friendly
 * UI labels for section headings.
 *
 * Example:
 * - `combat_style` -> `Combat Style`
 *
 * Notes:
 * - fallback labels such as `Uncategorized` pass through cleanly
 * - this is presentation-only and does not alter canonical data
 */
function formatCategoryLabel(categoryLabel: string): string {
  return categoryLabel
    .split('_')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

/**
 * ---------------------------------------------------------
 * groupedTags
 * ---------------------------------------------------------
 *
 * Groups available tags by their canonical `tagCategory` so the
 * selector can present them in organized sections rather than
 * as one flat, unstructured list.
 *
 * Normalization rules:
 * - null/empty categories are grouped under `Uncategorized`
 *
 * Sorting rules:
 * - category groups are sorted alphabetically by label
 * - tags within each group are sorted alphabetically by displayName
 *
 * Architectural note:
 * - grouping is derived UI state only
 * - the parent still owns the source data and selected IDs
 * - Layout note:
 * - this component does not impose its own max-height or scrolling
 * - parent containers should control overflow behavior based on context
 *   (for example: create modal vs edit modal)
 */
const groupedTags = computed(() => {
  const groups = new Map<
    string,
    Array<{
      id: string
      displayName: string
      tagCategory: string | null
      isActive: boolean | null
    }>
  >()

  for (const tag of props.availableTags) {
    const rawCategory = tag.tagCategory?.trim()
    const categoryLabel = rawCategory ? rawCategory : 'Uncategorized'

    if (!groups.has(categoryLabel)) {
      groups.set(categoryLabel, [])
    }

    groups.get(categoryLabel)!.push(tag)
  }

  return Array.from(groups.entries())
    .map(([categoryLabel, tags]) => ({
      categoryLabel,
      tags: [...tags].sort((a, b) =>
        a.displayName.localeCompare(b.displayName)
      ),
    }))
    .sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel))
})

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