<template>
    <header class="w-full flex items-center justify-between px-6 py-4 bg-black bg-opacity-70">
      <!-- Left: Logo / Title -->
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-bold text-white">Admin Dashboard</h1>
      </div>
  
      <!-- Center: Navigation Links -->
      <nav class="flex space-x-6">
        <router-link
          v-for="link in adminNavLinks"
          :key="link.name"
          :to="{ name: link.routeName }"
          class="flex items-center space-x-1 text-white hover:underline"
        >
          <AppIcon :name="link.icon" :library="link.library" />
          <span>{{ link.name }}</span>
        </router-link>
      </nav>
  
      <!-- Right: Logout -->
      <button
        @click="handleLogout"
        class="text-white hover:underline focus:outline-none focus:ring focus:ring-indigo-500 rounded px-3 py-1"
      >
        Logout
      </button>
    </header>
  </template>
  
  <script setup lang="ts">
  import AppIcon from '@/components/atoms/AppIcon.vue'
  import { adminNavLinks } from '@/features/admin/utils/adminNavLinks'
  import { useAuth } from '@/features/auth/hooks/useAuth'
  
  const { logout } = useAuth()
  
  function handleLogout() {
    logout()
  }
  </script>
  