<script lang="ts" setup>
/*
  =========================================================
  LoadingSpinner
  =========================================================
  Responsibilities:
  - Render a simple reusable SVG loading spinner.
  - Allow the caller to override the spinner size via Tailwind classes.

  Notes:
  - The component defaults to `h-5 w-5` when no size is provided.
  - Color and animation are controlled directly on the root SVG element.
*/

const props = defineProps<{
  // Optional Tailwind size classes applied to the root SVG.
  // Example: 'h-5 w-5'
  size?: string
}>()
</script>

<template>
  <!--
    Root spinner SVG.
    - Uses a rotating animation for loading feedback.
    - Falls back to a default size when no size prop is passed.
  -->
  <svg
    :class="['animate-spin text-indigo-500', size || 'h-5 w-5']"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <!-- Faint circular track behind the animated segment. -->
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    />

    <!-- Solid leading segment that creates the visible spinning effect. -->
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
</template>