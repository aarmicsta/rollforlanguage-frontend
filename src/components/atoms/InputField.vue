<script lang="ts" setup>

const props = defineProps<{
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  error?: string
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emits('update:modelValue', target.value)
}
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>
    <input
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      @input="onInput"
      class="w-full rounded-lg border px-3 py-2 text-sm
             border-gray-300 dark:border-gray-600
             focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
             dark:bg-gray-800 dark:text-gray-100"
      :class="error ? 'border-red-500 dark:border-red-400' : ''"
    />
    <p v-if="error" class="mt-1 text-xs text-red-500 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>
