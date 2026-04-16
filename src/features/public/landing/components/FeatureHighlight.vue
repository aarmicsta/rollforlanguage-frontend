<script setup lang="ts">
/*
  =========================================================
  FeatureHighlight
  =========================================================
  Responsibilities:
  - Display a concise feature block with icon, title, and description.
  - Provide a consistent visual pattern for highlighting key features.

  Notes:
  - Purely presentational component (no internal state or logic).
  - Layout and styling are controlled via Tailwind classes.
*/

defineProps<{
  // Icon name passed to AppIcon component.
  icon: string

  // Feature title text.
  title: string

  // Feature description text.
  description: string
}>()
</script>

<template>
  <!--
    Root container for the feature highlight block.
    Uses flex layout to align icon and text content.
  -->
  <div class="flex items-start gap-3">

    <!-- Icon container (fixed size for visual consistency). -->
    <div class="flex-shrink-0">
      <!-- Renders the provided icon. -->
      <AppIcon :name="icon as any" class="h-6 w-6 text-indigo-500" />
    </div>

    <!--
      Text content container.
      - Title: emphasized heading
      - Description: supporting text
    -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {{ title }}
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ description }}
      </p>
    </div>

  </div>
</template>