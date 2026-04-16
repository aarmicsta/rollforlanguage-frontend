<template>
  <nav class="w-full bg-white shadow-md fixed top-0 left-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        
        <!-- Left Section -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <RouterLink to="/" class="flex items-center space-x-2">
              <!-- Show Logo + Name if not logged in -->
              <template v-if="!isLoggedIn">
                <img src="/logo.webp" alt="Logo" class="h-8 w-8" />
                <span class="text-xl font-bold text-gray-800">Roll for Language</span>
              </template>

              <!-- Show Profile Dropdown if logged in -->
              <template v-else>
                <ProfileDropdown />
              </template>
            </RouterLink>
          </div>
        </div>

        <!-- Center Section (Desktop Links) -->
        <div class="hidden md:flex space-x-8">
          <NavbarDesktop />
        </div>

        <!-- Right Section -->
        <div class="flex items-center space-x-4">
          <!-- Language Switcher -->
          <LocaleSwitcher />

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMenu"
            class="inline-flex items-center justify-center md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <svg
              v-if="!isMenuOpen"
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu (only shows when open) -->
    <NavbarMobile v-if="isMenuOpen" @close="toggleMenu" />
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import NavbarDesktop from './NavbarDesktop.vue'
import NavbarMobile from './NavbarMobile.vue'
import ProfileDropdown from './ProfileDropdown.vue'
// import LocaleSwitcher from '@/components/atoms/LocaleSwitcher.vue'

// Reactive states
const isMenuOpen = ref(false)
const isLoggedIn = ref(false) // This will later come from actual auth store

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<style scoped>
/* Future scoped styling if needed */
</style>
