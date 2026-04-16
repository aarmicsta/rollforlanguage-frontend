<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/atoms/InputField.vue'
import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'
import ErrorBanner from '@/components/molecules/ErrorBanner.vue'
import Toast from '@/components/molecules/Toast.vue'
import { useAuthStore } from '@/features/auth/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const showToast = ref(false)
const localError = ref('')

watch(() => authStore.authError, (newError) => {
  if (newError) {
    localError.value = newError
  }
})

const submit = async () => {
  localError.value = ''
  showToast.value = false

  try {
    await authStore.forgotPassword(email.value)
    showToast.value = true
    email.value = ''

    // Redirect after short delay
    setTimeout(() => {
      router.push('/login')
    }, 3000) // 3 seconds
  } catch (error) {
    console.error('Forgot password error:', error)
    // Error already set in authStore.authError
  }
}

const dismissError = () => {
  localError.value = ''
  authStore.clearError()
}

const dismissToast = () => {
  showToast.value = false
}
</script>

<template>
  <form @submit.prevent="submit" class="space-y-4">
    <Toast
      v-if="showToast"
      message="✅ A magic reset scroll has been sent to your email! Redirecting to login..."
      type="success"
      @dismiss="dismissToast"
    />

    <ErrorBanner
      v-if="localError"
      :message="localError"
      @dismiss="dismissError"
    />

    <InputField
      v-model="email"
      type="email"
      label="Email"
      placeholder="Enter your registered email"
      required
    />

    <button
      type="submit"
      class="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 transform active:scale-95 transition"
      :disabled="authStore.isLoading"
    >
      <LoadingSpinner v-if="authStore.isLoading" class="mr-2" />
      <span>{{ authStore.isLoading ? 'Sending...' : 'Send Reset Link' }}</span>
    </button>

    <div class="text-center text-sm mt-4">
      <RouterLink to="/login" class="text-indigo-600 hover:underline">
        Back to Login
      </RouterLink>
    </div>
  </form>
</template>
