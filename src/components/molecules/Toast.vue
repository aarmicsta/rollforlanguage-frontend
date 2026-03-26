<script lang="ts" setup>
import { onMounted } from 'vue'

const props = defineProps<{
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number // milliseconds
}>()

const emits = defineEmits<{
  (e: 'dismiss'): void
}>()

onMounted(() => {
  setTimeout(() => {
    emits('dismiss')
  }, props.duration || 3000)
})

const typeClasses = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
}
</script>

<template>
  <div
    :class="['fixed top-5 right-5 z-50 rounded-lg px-4 py-2 shadow-lg transition-opacity duration-300', typeClasses[type || 'info']]"
  >
    <div class="flex items-center">
      <span class="mr-2">{{ message }}</span>
      <button @click="$emit('dismiss')" class="ml-2 text-xl leading-none focus:outline-none">
        &times;
      </button>
    </div>
  </div>
</template>
