import { jwtDecode } from 'jwt-decode'
import { defineStore } from 'pinia'
import { authService } from '@/features/auth/services/authService'
import type { User } from '../types/types'

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  authError: string | null
  isLoading: boolean
}

interface DecodedToken {
  id: string
  email: string
  username: string
  role: string
  genderIdentity?: string | null
  pronouns?: string | null
  iat: number
  exp: number
}

const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_REFRESH_TOKEN_KEY = 'auth_refresh_token'
const AUTH_USER_KEY = 'auth_user'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    refreshToken: null,
    authError: null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token && !!state.user,
  },

  actions: {
    async login(payload: { email: string; password: string }) {
      return authService.login(this, payload.email, payload.password)
    },

    async register(payload: {
      username: string
      email: string
      password: string
      genderIdentity?: string | null
      pronouns?: string | null
    }) {
      return authService.register(this, payload)
    },

    async logout() {
      return authService.logout(this)
    },

    async refreshTokenAction() {
      return authService.refreshToken(this)
    },

    async forgotPassword(email: string) {
      return authService.forgotPassword(this, email)
    },

    setAuth(token: string, refreshToken: string) {
      this.token = token
      this.refreshToken = refreshToken
      this.authError = null

      localStorage.setItem(AUTH_TOKEN_KEY, token)
      localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken)

      try {
        const decoded = jwtDecode<DecodedToken>(token)
        this.user = {
          id: decoded.id,
          email: decoded.email,
          username: decoded.username,
          roles: [decoded.role],
          genderIdentity: decoded.genderIdentity || null,
          pronouns: decoded.pronouns || null,
        } as User
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(this.user))
      } catch (error) {
        console.error('Failed to decode token:', error)
        this.user = null
      }
    },

    clearAuth() {
      this.token = null
      this.refreshToken = null
      this.user = null
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
    },

    setError(message: string) {
      this.authError = message
    },

    clearError() {
      this.authError = null
    },

    setLoading(status: boolean) {
      this.isLoading = status
    },

    initFromStorage() {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY)
      const storedRefreshToken = localStorage.getItem(AUTH_REFRESH_TOKEN_KEY)

      if (!storedToken) {
        this.clearAuth()
        return
      }

      try {
        const decoded = jwtDecode<DecodedToken>(storedToken)
        const now = Math.floor(Date.now() / 1000)

        if (decoded.exp <= now) {
          this.clearAuth()
          return
        }

        this.token = storedToken
        this.refreshToken = storedRefreshToken
        this.user = {
          id: decoded.id,
          email: decoded.email,
          username: decoded.username,
          roles: [decoded.role],
          genderIdentity: decoded.genderIdentity || null,
          pronouns: decoded.pronouns || null,
        } as User

        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(this.user))
        this.authError = null
      } catch (error) {
        console.error('Failed to restore token from storage:', error)
        this.clearAuth()
      }
    }
  },
})

export type AuthStore = ReturnType<typeof useAuthStore>
