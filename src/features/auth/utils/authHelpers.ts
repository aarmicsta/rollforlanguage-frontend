// src/features/auth/utils/authHelpers.ts
export function decodeJWT(token: string) {
    try {
      const payload = token.split('.')[1]
      const decoded = atob(payload)
      return JSON.parse(decoded)
    } catch (error) {
      console.error('Failed to decode JWT:', error)
      return null
    }
  }
  
  export function isTokenExpired(token: string) {
    const decoded = decodeJWT(token)
    if (!decoded || !decoded.exp) return true
  
    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
  }
  