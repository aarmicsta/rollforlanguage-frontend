<script lang="ts" setup>
/*
  =========================================================
  AppIcon
  =========================================================
  Responsibilities:
  - Provide a unified icon interface across the application.
  - Dynamically resolve and render icons by name.
  - Support consistent sizing and styling via props.

  Notes:
  - Icons are resolved via a local lookup map (no dynamic imports).
  - Falls back gracefully if an icon name is not found.
  - Designed to centralize icon usage and prevent scattered imports.
*/

import {
  Home,
  User,
  Settings,
  Shield,
  BookOpen,
  Swords,
  Sparkles,
  Plus,
  Pencil,
  Trash,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'

/*
  =========================================================
  Icon Registry
  =========================================================
  Maps string names to actual icon components.
  This allows consumers to reference icons declaratively.
*/
const icons = {
  home: Home,
  user: User,
  settings: Settings,
  shield: Shield,
  book: BookOpen,
  playables: Swords,
  sparkles: Sparkles,
  plus: Plus,
  edit: Pencil,
  delete: Trash,
  close: X,
  check: Check,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
} as const

const props = defineProps<{
  // Name of the icon to render (must exist in registry).
  name: keyof typeof icons

  // Optional Tailwind size classes (e.g. 'h-5 w-5').
  size?: string

  // Optional additional CSS classes.
  class?: string
}>()

/*
  =========================================================
  Computed
  =========================================================
*/

/**
 * Resolves the icon component from the registry.
 * If the key is somehow invalid, returns null to avoid runtime errors.
 */
const iconComponent = icons[props.name] || null
</script>

<template>
  <!--
    Dynamic icon renderer.
    - Applies size and custom classes.
    - Only renders if a valid icon component is resolved.
  -->
  <component
    v-if="iconComponent"
    :is="iconComponent"
    :class="[size || 'h-5 w-5', props.class]"
  />
</template>