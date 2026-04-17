<script setup lang="ts">
import MainLayout from '@/components/layouts/MainLayout.vue'
import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm.vue'
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-cover bg-center"
    style="background-image: url('/backgrounds/bg-forgot.webp');"
  >
    <MainLayout>
      <div class="flex flex-col md:flex-row w-full h-full mt-12">
        <!-- Left hero panel -->
        <div class="hidden md:flex w-1/2 items-center justify-center relative ml-12">
          <div class="absolute inset-0 bg-black opacity-50"></div>
          <div class="relative text-center px-8">
            <h1 class="text-4xl font-bold text-white mb-4">Reset Your Spellbook</h1>
            <p class="text-lg text-indigo-100">
              Forgotten your password? Enter your email to receive a magic reset scroll.
            </p>
          </div>
        </div>

        <!-- Right form panel -->
        <div class="flex w-full md:w-1/2 items-center justify-center p-6 animate-fadeIn">
          <div class="w-full max-w-md space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl mt-12">
            <div class="text-center">
              <img src="/logo.webp" alt="Roll for Language Logo" class="mx-auto h-12 mb-4" />
              <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Forgot Password</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                We’ll send you an email with a link to reset your password.
              </p>
            </div>
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </MainLayout>
  </div>
</template>
