<template>
  <!--
    =========================================================
    Creature Tag Assignment Selector
    =========================================================

    Presentational selector for assigning creature tags.

    Notes:
    - mirrors PlayableTagAssignmentSelector exactly
    - remains UI-only (no fetching, no persistence)
  -->
  <div>
    <label class="mb-1 block text-xs text-gray-500">Tags</label>

    <div class="rounded border px-3 py-3 dark:border-neutral-700">
      <div
        v-if="availableTags && availableTags.length"
        class="space-y-4"
      >
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
              :disabled="disabled"
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

      <p v-else class="text-sm text-gray-500 dark:text-gray-400">
        No creature tags available.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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

function formatCategoryLabel(categoryLabel: string): string {
  return categoryLabel
    .split('_')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

const groupedTags = computed(() => {
  const groups = new Map<string, any[]>()

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

function toggleTag(tagId: string) {
  const next = props.modelValue.includes(tagId)
    ? props.modelValue.filter((id) => id !== tagId)
    : [...props.modelValue, tagId]

  emit('update:modelValue', next)
}
</script>