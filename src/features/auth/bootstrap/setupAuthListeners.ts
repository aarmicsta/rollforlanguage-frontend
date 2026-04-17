// src/features/auth/utils/setupAuthListeners.ts
import { useAuthStore } from '../stores/authStore'

export function setupAuthListeners() {
  const authStore = useAuthStore()

  window.addEventListener('storage', (event) => {
    if (event.key === 'auth_token' && event.newValue === null) {
      authStore.clearAuth()
    }
  })
}
