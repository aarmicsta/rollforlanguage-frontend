<script setup lang="ts">
/*
  =========================================================
  WhyChooseUsCard
  =========================================================
  Responsibilities:
  - Render a card-style feature highlight for "Why Choose Us" sections.
  - Display an icon, title, and descriptive text in a structured layout.
  - Provide a visually distinct, reusable marketing component.

  Notes:
  - Purely presentational (no internal state or logic).
  - Uses Tailwind utility classes for styling and layout.
*/

defineProps<{
  // Icon name passed to AppIcon component.
  icon: string

  // Card title text.
  title: string

  // Supporting description text.
  description: string
}>()
</script>

<template>
  <!--
    Root card container.
    - Provides padding, border, and background styling.
    - Uses flex layout for vertical alignment of content.
  -->
  <div
    class="flex flex-col items-start p-4 rounded-xl border
           bg-white dark:bg-gray-800
           border-gray-200 dark:border-gray-700
           shadow-sm"
  >

    <!--
      Icon container.
      - Fixed size for consistency across cards.
      - Uses accent color to draw visual attention.
    -->
    <div class="mb-3">
      <AppIcon :name="icon as any" class="h-6 w-6 text-indigo-500" />
    </div>

    <!--
      Text content container.
      - Title: primary emphasis
      - Description: supporting detail
    -->
    <div>
      <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
        {{ title }}
      </h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {{ description }}
      </p>
    </div>

  </div>
</template>