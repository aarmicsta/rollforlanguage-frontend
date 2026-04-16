<template>
  <div class="relative">
    <!-- Avatar/Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <!-- <img
        src="/avatar-placeholder.png"
        alt="User Avatar"
        class="h-10 w-10 rounded-full object-cover"
      /> -->
    </button>

    <!-- Dropdown Menu -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50"
      >
        <button
          @click="goToProfile"
          class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          Profile
        </button>
        <button
          @click="goToSettings"
          class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          Settings
        </button>
        <div class="border-t border-gray-100"></div>
        <button
          @click="logout"
          class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
        >
          Logout
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Reactive state for dropdown visibility
const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const goToProfile = () => {
  router.push('/profile')
  closeDropdown()
}

const goToSettings = () => {
  router.push('/settings')
  closeDropdown()
}

const logout = () => {
  // TODO: Add actual logout logic (e.g., auth store logout + redirect)
  router.push('/')
  closeDropdown()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
