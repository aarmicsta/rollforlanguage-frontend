<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
  message: string
}>()

const emits = defineEmits<{
  (e: 'dismiss'): void
}>()

const visible = ref(true)

const dismiss = () => {
  visible.value = false
  emits('dismiss')
}
</script>

<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="relative w-full rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700 dark:bg-red-900 dark:text-red-200"
    >
      {{ message }}
      <button
        @click="dismiss"
        class="absolute right-2 top-2 text-red-700 hover:text-red-900 dark:text-red-200 dark:hover:text-white"
        aria-label="Dismiss error"
      >
        &times;
      </button>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
