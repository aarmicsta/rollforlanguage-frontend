<template>
  <div class="space-y-3">
    <div
      v-for="group in groupedPassives"
      :key="group.effectType"
      class="space-y-2"
    >
      <div class="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {{ group.effectTypeLabel }}
      </div>

      <div class="flex flex-wrap gap-2 rounded-lg border border-white/10 p-3">
        <button
          v-for="passive in group.passives"
          :key="passive.id"
          type="button"
          class="rounded-full px-3 py-1 text-sm transition"
          :class="
            isSelected(passive.id)
              ? 'bg-blue-600 text-white'
              : 'bg-white/10 text-white hover:bg-white/20'
          "
          @click="togglePassive(passive.id)"
        >
          <span>{{ passive.displayName }}</span>
          <span
            v-if="passive.effectType"
            class="ml-1 text-xs opacity-80"
          >
            ({{ passive.effectType }})
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Playable Passive Assignment Selector
 * =========================================================
 *
 * Presentational multi-select control for assigning passives
 * inside Class / Species edit flows.
 *
 * Responsibilities:
 * - render grouped passive options
 * - show selected state
 * - emit updated passive ID arrays when toggled
 *
 * Notes:
 * - this component does NOT fetch data
 * - this component does NOT save data
 * - grouping is based on `effectType`
 * - persistence remains the responsibility of the parent modal
 */

import { computed } from 'vue'

export interface PassiveOption {
  id: string
  displayName: string
  effectType?: string | null
}

const props = defineProps<{
  availablePassives: PassiveOption[]
  selectedPassiveIds: string[]
}>()

const emit = defineEmits<{
  (e: 'update:selectedPassiveIds', value: string[]): void
}>()

function isSelected(passiveId: string) {
  return props.selectedPassiveIds.includes(passiveId)
}

function togglePassive(passiveId: string) {
  const next = isSelected(passiveId)
    ? props.selectedPassiveIds.filter((id) => id !== passiveId)
    : [...props.selectedPassiveIds, passiveId]

  emit('update:selectedPassiveIds', next)
}

function toEffectTypeLabel(value?: string | null) {
  if (!value) return 'Uncategorized'

  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const groupedPassives = computed(() => {
  const groups = new Map<string, PassiveOption[]>()

  for (const passive of props.availablePassives) {
    const key = passive.effectType?.trim() || 'uncategorized'

    if (!groups.has(key)) {
      groups.set(key, [])
    }

    groups.get(key)!.push(passive)
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([effectType, passives]) => ({
      effectType,
      effectTypeLabel: toEffectTypeLabel(effectType),
      passives: [...passives].sort((a, b) =>
        a.displayName.localeCompare(b.displayName)
      ),
    }))
})
</script>