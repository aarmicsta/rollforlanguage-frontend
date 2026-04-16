<script setup lang="ts">
import { ref } from 'vue'
import InputField from '@/components/atoms/InputField.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'
import ErrorBanner from '@/components/molecules/ErrorBanner.vue'
import Toast from '@/components/molecules/Toast.vue'
import { useAuthStore } from '@/features/auth/stores/authStore'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const showToast = ref(false)

const submit = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.login({ email: email.value, password: password.value })
    showToast.value = true
    // Optional: you could add a short delay before redirecting here
  } catch (error) {
    errorMessage.value = 'Invalid email or password.'
    console.error(error)
  } finally {
    loading.value = false
  }
}

const dismissError = () => {
  errorMessage.value = ''
}

const dismissToast = () => {
  showToast.value = false
}
</script>

<template>
  <form @submit.prevent="submit" class="space-y-4">
    <Toast
      v-if="showToast"
      message="✅ Welcome back, Adventurer!"
      type="success"
      @dismiss="dismissToast"
    />

    <ErrorBanner v-if="errorMessage" :message="errorMessage" @dismiss="dismissError" />

    <InputField
      v-model="email"
      type="email"
      label="Email"
      placeholder="Enter your email"
    />
    <InputField
      v-model="password"
      type="password"
      label="Password"
      placeholder="Enter your password"
    />

    <button
      type="submit"
      class="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 transform active:scale-95 transition"
      :disabled="loading"
    >
      <LoadingSpinner v-if="loading" class="mr-2" />
      <span>{{ loading ? 'Logging in...' : 'Login' }}</span>
    </button>

    <div class="text-center text-sm mt-4">
      <RouterLink to="/forgot-password" class="text-indigo-600 hover:underline">
        Forgot Password?
      </RouterLink>
      <span class="mx-2 text-gray-400 dark:text-gray-500">|</span>
      <RouterLink to="/register" class="text-indigo-600 hover:underline">
        Register
      </RouterLink>
    </div>
  </form>
</template>
