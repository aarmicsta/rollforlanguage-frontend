<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from 'vue'

/**
 * ---------------------------------------------------------
 * Toast Props
 * ---------------------------------------------------------
 *
 * `message`
 * - user-facing toast text
 *
 * `type`
 * - semantic variant used to control styling
 *
 * `duration`
 * - auto-dismiss timing in milliseconds
 */
const props = defineProps<{
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}>()

/**
 * ---------------------------------------------------------
 * Toast Events
 * ---------------------------------------------------------
 *
 * `dismiss`
 * - emitted when the toast should be removed from view
 * - may be triggered automatically or via manual close
 */
const emit = defineEmits<{
  (e: 'dismiss'): void
}>()

/**
 * ---------------------------------------------------------
 * Auto-dismiss Lifecycle
 * ---------------------------------------------------------
 *
 * The Toast component owns its display duration behavior,
 * but does not own the underlying visibility state.
 *
 * That state is controlled externally by the layout/store
 * layer, which responds to this dismiss event.
 */
let dismissTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  dismissTimer = setTimeout(() => {
    emit('dismiss')
  }, props.duration || 3000)
})

onBeforeUnmount(() => {
  if (dismissTimer) {
    clearTimeout(dismissTimer)
  }
})

/**
 * ---------------------------------------------------------
 * Variant Styling
 * ---------------------------------------------------------
 *
 * Maps semantic toast types to presentation classes.
 */
const typeClasses: Record<'success' | 'error' | 'info', string> = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
}
</script>

<template>
  <div
    :class="[
      'fixed top-5 right-5 z-50 rounded-lg px-4 py-2 shadow-lg transition-opacity duration-300',
      typeClasses[type || 'info'],
    ]"
  >
    <div class="flex items-center">
      <span class="mr-2">{{ message }}</span>

      <button
        class="ml-2 text-xl leading-none focus:outline-none"
        @click="$emit('dismiss')"
      >
        &times;
      </button>
    </div>
  </div>
</template>