import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios'
import axios from 'axios'
import { useAuthStore } from '../features/auth/stores/authStore'
import { isTokenExpiringSoon } from '../features/auth/utils/tokenHelpers'

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
})

// Attach token and refresh if needed
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()

    if (authStore.token) {
      // Check if token is close to expiring
      if (isTokenExpiringSoon(authStore.token)) {
        try {
          await authStore.refreshTokenAction()
          console.log('Access token refreshed before request.')
        } catch (error) {
          console.error('Failed to refresh token:', error)
          authStore.clearAuth()
          window.location.href = '/login'
          return Promise.reject(error)
        }
      }

      // Attach valid token
      if (config.headers) {
        config.headers.Authorization = `Bearer ${authStore.token}`
      }
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// Optional: Handle 401 responses globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore()
      authStore.clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
