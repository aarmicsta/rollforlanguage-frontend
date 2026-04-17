// src/features/auth/types/types.ts

export interface User {
  id: string
  email: string
  username: string

  // Optional fields (expand as needed)
  genderIdentity?: string | null
  pronouns?: string | null
  roles?: string[]
  avatarUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthResponse {
  token: string
}
