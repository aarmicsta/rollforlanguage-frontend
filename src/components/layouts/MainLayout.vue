<template>
  <div class="min-h-screen flex flex-col">
    <header class="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
      <div class="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <RouterLink to="/" class="flex items-center space-x-2">
          <img src="/logo.webp" alt="Roll for Language logo" class="h-8 w-8" />
          <span class="text-xl font-bold text-gray-800">Roll for Language</span>
        </RouterLink>
      </div>
    </header>

    <main class="flex-1 layout-offset-top">
      <slot />
    </main>

    <FooterPlaceholder />
  </div>
</template>

<script setup lang="ts">
import FooterPlaceholder from '@/components/app-shell/footer/Footer.vue'
</script>