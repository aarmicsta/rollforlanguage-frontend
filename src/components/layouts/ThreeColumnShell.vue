<template>
  <div class="max-w-[1440px] mx-auto px-6 my-12">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column -->
      <div class="flex flex-col space-y-6">
        <slot name="left" />
      </div>

      <!-- Center Column -->
      <div class="flex flex-col space-y-6">
        <slot name="center" />
      </div>

      <!-- Right Column -->
      <div class="flex flex-col space-y-6">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script setup>
// No props needed for now; purely slot-based layout shell
</script>
  