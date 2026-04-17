<!-- /src/components/molecules/WidgetWrapper.vue -->
<template>
  <div :class="wrapperClasses" :style="wrapperStyle">
    <!-- Header with icon and title -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <AppIcon v-if="icon" :name="icon" class="text-xl" />
        <h2 :class="['text-lg font-semibold', textColor]">{{ title }}</h2>
      </div>

      <!-- Hover tools slot (e.g. 🛠 Manage) -->
      <div class="opacity-0 group-hover:opacity-100 transition-opacity">
        <slot name="hover-tools" />
      </div>
    </div>

    <!-- Widget body -->
    <div class="text-sm">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ComputedRef } from 'vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import type { DashboardTheme } from '@/features/admin/dashboard/config/dashboardThemes'

const props = defineProps<{
  title: string
  icon?: string
}>()

const dashboardTheme = inject<ComputedRef<DashboardTheme | undefined>>('dashboardTheme')

// Background and layout
const wrapperClasses = computed(() => [
  'relative group rounded-xl shadow p-4 transition-shadow hover:shadow-md overflow-hidden',
  dashboardTheme?.value?.widgetColor || 'bg-white'
])

// Accent color bar (right edge)
const wrapperStyle = computed(() => {
  return {
    '--accent': dashboardTheme?.value?.accentValue || '#3b82f6',
    borderRight: '4px solid var(--accent)'
  }
})

// Text color
const textColor = computed(() =>
  dashboardTheme?.value?.widgetTextColor || 'text-black'
)
</script>

<style scoped>
/* Optional: fallback for accent edge in environments without Tailwind plugin support */
</style>
