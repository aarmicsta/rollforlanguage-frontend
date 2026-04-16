<template>
    <div class="flex space-x-8 items-center">
      <RouterLink
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
        :class="{ 'text-blue-600 font-semibold': isActive(link.path) }"
      >
        {{ link.name }}
      </RouterLink>
    </div>
  </template>
  
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Define navigation links
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Campaigns', path: '/campaigns' },
  { name: 'Inventory', path: '/inventory' },
]

// Function to determine if the link is active
const isActive = (path) => {
  return computed(() => route.path.startsWith(path))
}
</script>

<style scoped>
/* Future scoped styles if needed */
</style>
