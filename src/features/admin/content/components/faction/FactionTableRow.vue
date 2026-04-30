<template>
  <!--
    =========================================================
    Faction Table Row
    =========================================================

    Responsible for rendering a single faction row.

    Responsibilities:
    - display faction data
    - emit selection intent

    Non-responsibilities:
    - data fetching
    - table structure
    - modal logic
  -->
  <tr
    :class="[
      'border-b cursor-pointer',
      'hover:bg-gray-50 dark:hover:bg-neutral-800',
      isSelected ? 'bg-blue-50 dark:bg-neutral-800' : ''
    ]"
    @click="$emit('select', faction.id)"
  >
    <!-- Name -->
    <td class="px-3 py-2">
      <div class="font-medium text-gray-800 dark:text-gray-100">
        {{ faction.displayName }}
      </div>
      <div class="text-xs text-gray-500">
        {{ faction.slug }}
      </div>
    </td>

    <!-- Alignment -->
    <td class="px-3 py-2 text-gray-500">
      {{ faction.alignment ?? '—' }}
    </td>

    <!-- Description -->
    <td class="px-3 py-2 text-gray-500">
      {{ faction.description ?? '—' }}
    </td>

    <!-- Active -->
    <td class="px-3 py-2">
      <span
        :class="[
          'rounded px-2 py-1 text-xs',
          faction.isActive
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-200 text-gray-600'
        ]"
      >
        {{ faction.isActive ? 'Active' : 'Inactive' }}
      </span>
    </td>

    <!-- Updated -->
    <td class="px-3 py-2 text-gray-500">
      {{ formatDisplayDate(faction.updatedAt) }}
    </td>
  </tr>
</template>

<script setup lang="ts">
import { formatDisplayDate } from '@/utils/dateFormat'
import type { FactionListItem } from '@/features/admin/content/types/contentTypes'

defineProps<{
  faction: FactionListItem
  isSelected: boolean
}>()

defineEmits<{
  (e: 'select', id: string): void
}>()

</script>