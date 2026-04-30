<template>
  <!--
    =========================================================
    Admin Table State
    =========================================================

    Standardized non-data state display for admin tables.

    Used by AdminTableShell so domain tables do not duplicate
    loading, error, and empty-state markup.
  -->
  <div :class="stateClasses">
    {{ resolvedMessage }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * ---------------------------------------------------------
 * Props
 * ---------------------------------------------------------
 */
const props = withDefaults(
  defineProps<{
    variant: 'loading' | 'error' | 'empty'
    message?: string | null
  }>(),
  {
    message: null,
  }
)

/**
 * ---------------------------------------------------------
 * Display Message
 * ---------------------------------------------------------
 *
 * Provides safe fallback text if a parent table does not pass
 * a custom message.
 */
const resolvedMessage = computed(() => {
  if (props.message) return props.message

  switch (props.variant) {
    case 'loading':
      return 'Loading records...'
    case 'error':
      return 'Unable to load records.'
    case 'empty':
      return 'No records found.'
    default:
      return ''
  }
})

/**
 * ---------------------------------------------------------
 * State Styling
 * ---------------------------------------------------------
 *
 * Keeps state presentation consistent while allowing the error
 * variant to remain visually distinct.
 */
const stateClasses = computed(() => {
  const baseClasses =
    'rounded-md border px-4 py-6 text-sm text-center'

  if (props.variant === 'error') {
    return [
      baseClasses,
      'border-red-200 bg-red-50 text-red-700',
      'dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300',
    ]
  }

  return [
    baseClasses,
    'border-gray-200 bg-gray-50 text-gray-600',
    'dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-300',
  ]
})
</script>