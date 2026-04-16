<template>
  <div class="bg-gradient-to-b from-gray-300/100 to-gray-900/100 p-4 rounded-lg shadow hover:shadow-md transition duration-300 space-y-2 w-full text-left">
    <div class="flex items-center space-x-3 mb-1">
      <div class="text-3xl text-gray-900">{{ icon }}</div>
      <h4 class="text-lg font-semibold text-gray-900">{{ title }}</h4>
    </div>
    <p class="text-sm text-gray-100">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});
</script>
