<template>
  <div
    class="min-h-screen flex flex-col bg-cover bg-center"
    style="background-image: url('/backgrounds/bg-register.webp');"
  >
    <div class="flex flex-grow items-center justify-center">
      <div class="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 shadow-xl rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
        <!-- Left Side: Hero Text / Art -->
        <div class="hidden md:flex items-center justify-center p-8">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-indigo-600 dark:text-indigo-300 mb-4">
              Join the Adventure!
            </h1>
            <p class="text-gray-700 dark:text-gray-300">
              Create your hero account and unlock a world of quests, treasures, and language mastery.
            </p>
          </div>
        </div>

        <!-- Right Side: Register Form -->
        <div class="p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RegisterForm from '@/features/auth/components/RegisterForm.vue'
</script>
