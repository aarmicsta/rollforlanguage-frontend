<script lang="ts" setup>
/*
  =========================================================
  InputField
  =========================================================
  Responsibilities:
  - Provide a reusable text input field with optional label and error display.
  - Support v-model binding via `modelValue` and `update:modelValue`.
  - Handle basic input types (text by default, overridable via prop).

  Notes:
  - This is a controlled input component (value is always driven by parent state).
  - Error state is purely presentational (no internal validation logic).
*/

const props = defineProps<{
  // Bound value for v-model usage.
  modelValue: string

  // Optional label displayed above the input.
  label?: string

  // Input type (defaults to 'text').
  type?: string

  // Optional placeholder text.
  placeholder?: string

  // Optional error message; triggers error styling when present.
  error?: string
}>()

const emits = defineEmits<{
  // Emits updated value to support v-model.
  (e: 'update:modelValue', value: string): void
}>()

/*
  =========================================================
  Event Handlers
  =========================================================
*/

/**
 * Handles native input events and emits the updated value.
 * Casts the event target to HTMLInputElement for type safety.
 */
const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emits('update:modelValue', target.value)
}
</script>

<template>
  <!--
    Wrapper container.
    Ensures full-width layout consistency across forms.
  -->
  <div class="w-full">

    <!-- Optional label (rendered only if provided). -->
    <label
      v-if="label"
      class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
    </label>

    <!--
      Core input element.
      - Uses controlled value binding.
      - Applies conditional error styling when `error` is present.
    -->
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

    <!--
      Error message display.
      Only renders when an error string is provided.
    -->
    <p
      v-if="error"
      class="mt-1 text-xs text-red-500 dark:text-red-400"
    >
      {{ error }}
    </p>
  </div>
</template>