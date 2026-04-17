<template>
  <div class="w-full bg-black bg-opacity-60 text-white rounded-lg p-4 shadow text-center">
    <h2
      class="text-2xl font-bold"
      :class="roleColorClass"
    >
      Welcome back, {{ username }}!
    </h2>
    <p class="text-sm">
      You are logged in as
      <span
        class="font-semibold capitalize"
        :class="roleColorClass"
      >
        {{ role }}
      </span>.
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  username: string
  role: string
}>()

// Dynamically assign Tailwind color class
const roleColorClass = props.role === 'superadmin'
  ? 'text-rose-400'
  : 'text-indigo-300' // periwinkle vibe
</script>

<style scoped>
/* You can add transition or hover effects later here */
</style>
