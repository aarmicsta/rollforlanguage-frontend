<template>
  <form @submit.prevent="handleRegister" class="space-y-6">
    <!-- Username Field -->
    <InputField
      v-model="username"
      label="Username"
      type="text"
      required
      @input="clearError"
    />

    <!-- Email Field -->
    <InputField
      v-model="email"
      label="Email"
      type="email"
      required
      @input="clearError"
    />

    <!-- Password Field -->
    <InputField
      v-model="password"
      label="Password"
      type="password"
      required
      @input="clearError"
    />

    <!-- Confirm Password Field -->
    <InputField
      v-model="confirmPassword"
      label="Confirm Password"
      type="password"
      required
      @input="clearError"
    />

    <!-- Gender Identity (Optional) -->
    <InputField
      v-model="genderIdentity"
      label="Gender Identity (optional)"
      type="text"
      placeholder="Enter your gender identity"
      @input="clearError"
    />

    <!-- Pronouns (Optional) -->
    <InputField
      v-model="pronouns"
      label="Pronouns (optional)"
      type="text"
      placeholder="Enter your pronouns"
      @input="clearError"
    />

    <!-- Error Banner -->
    <ErrorBanner
      v-if="authStore.authError"
      :message="authStore.authError"
      @dismiss="authStore.clearError"
    />

    <!-- Submit Button -->
    <button
      type="submit"
      class="w-full flex items-center justify-center py-2 px-4 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      :disabled="authStore.isLoading"
    >
      <span v-if="authStore.isLoading" class="flex items-center">
        <LoadingSpinner class="mr-2" />
        Registering...
      </span>
      <span v-else>
        Create Account
      </span>
    </button>

    <!-- Login Link -->
    <p class="text-center text-sm text-gray-600 dark:text-gray-400">
      Already have an account?
      <RouterLink :to="AppRoutePaths.Login" class="text-indigo-500 hover:underline">
        Log in here
      </RouterLink>
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AppRoutePaths } from '@/router/routes'

import InputField from '@/components/atoms/InputField.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'
import ErrorBanner from '@/components/molecules/ErrorBanner.vue'
import { useAuthStore } from '@/features/auth/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const genderIdentity = ref('')
const pronouns = ref('')

function clearError() {
  if (authStore.authError) {
    authStore.clearError()
  }
}

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    authStore.setError('Passwords do not match')
    return
  }

  try {
    await authStore.register({
      username: username.value,
      email: email.value,
      password: password.value,
      genderIdentity: genderIdentity.value || null,
      pronouns: pronouns.value || null,
    })
    router.push(AppRoutePaths.Dashboard)
  } catch (error) {
    console.error('Registration failed:', error)
    // Error already handled and stored in authStore.authError
  }
}
</script>
