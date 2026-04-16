<template>
  <div class="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" @click.self="emit('close')">
    <div class="fixed top-0 right-0 w-3/4 max-w-sm h-full bg-white shadow-lg flex flex-col p-6 space-y-6 overflow-y-auto">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">Menu</h2>
        <button
          @click="emit('close')"
          class="text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="flex flex-col space-y-4">
        <RouterLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="text-gray-700 text-lg font-medium hover:text-blue-600 transition-colors duration-200"
          :class="{ 'text-blue-600 font-semibold': isActive(link.path) }"
          @click="emit('close')"
        >
          {{ link.name }}
        </RouterLink>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const emit = defineEmits(['close'])

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
  return route.path.startsWith(path)
}
</script>

<style scoped>
/* Future scoped styling if needed */
</style>
