import type { AxiosError } from 'axios'
import router from '@/router'
import { axiosInstance } from '@/services/apiClient'
import type { AuthStore } from '../stores/authStore'
import type { User } from '../types/authTypes'

interface AuthResponse {
  accessToken: string
  refreshToken: string
}

export const authService = {
  async login(authStore: AuthStore, email: string, password: string): Promise<User | undefined> {
    authStore.setLoading(true)
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', { email, password })
      const { accessToken, refreshToken } = response.data
      authStore.setAuth(accessToken, refreshToken)

      const user = authStore.user
      if (user?.roles?.includes('superadmin') || user?.roles?.includes('admin')) {
        router.push('/admin')
      } else if (user?.roles?.includes('teacher')) {
        router.push('/teacher-dashboard')
      } else if (user?.roles?.includes('student')) {
        router.push('/dashboard')
      } else {
        router.push('/') // fallback route
      }

      return user || undefined
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      authStore.setError(axiosError.response?.data?.message || 'Login failed')
      throw error
    } finally {
      authStore.setLoading(false)
    }
  },

  async register(
    authStore: AuthStore,
    payload: {
      username: string
      email: string
      password: string
      genderIdentity?: string | null
      pronouns?: string | null
    }
  ): Promise<User | undefined> {
    authStore.setLoading(true)
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/register', payload)
      const { accessToken, refreshToken } = response.data
      authStore.setAuth(accessToken, refreshToken)

      const user = authStore.user
      if (user?.roles?.includes('superadmin') || user?.roles?.includes('admin')) {
        router.push('/admin-dashboard')
      } else if (user?.roles?.includes('teacher')) {
        router.push('/teacher-dashboard')
      } else if (user?.roles?.includes('student')) {
        router.push('/dashboard')
      } else {
        router.push('/')
      }

      return user || undefined
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      authStore.setError(axiosError.response?.data?.message || 'Registration failed')
      throw error
    } finally {
      authStore.setLoading(false)
    }
  },

  async logout(authStore: AuthStore): Promise<void> {
    authStore.setLoading(true)

    try {
      await axiosInstance.post('/auth/logout')
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      authStore.setError(
        axiosError.response?.data?.message || 'Logout request failed, but local session was cleared.'
      )
    } finally {
      authStore.clearAuth()
      authStore.setLoading(false)
      router.push('/login')
    }
  },

  async refreshToken(authStore: AuthStore): Promise<string> {
    authStore.setLoading(true)
    try {
      const refreshToken = authStore.refreshToken
      if (!refreshToken) throw new Error('Missing refresh token')

      const response = await axiosInstance.post<{ accessToken: string }>('/auth/refresh', { refreshToken })

      const { accessToken } = response.data
      authStore.token = accessToken
      localStorage.setItem('auth_token', accessToken)
      return accessToken
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      authStore.setError(axiosError.response?.data?.message || 'Token refresh failed')
      throw error
    } finally {
      authStore.setLoading(false)
    }
  },

  async forgotPassword(authStore: AuthStore, email: string): Promise<void> {
    authStore.setLoading(true)
    try {
      await axiosInstance.post('/auth/forgot-password', { email })
      authStore.clearError() // clear any old errors on success
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      authStore.setError(axiosError.response?.data?.message || 'Password reset failed')
      throw error
    } finally {
      authStore.setLoading(false)
    }
  },
}
