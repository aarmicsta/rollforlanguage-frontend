import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { AppRouteNames } from '@/router/routes'
import { useAuthStore } from '@/features/auth/stores/authStore'

export function adminGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const authStore = useAuthStore()

  // Check if the user is authenticated
  if (!authStore.isAuthenticated) {
    next({ name: AppRouteNames.Login })
    return
  }

  // Check if the user has 'admin' or 'super-admin' role
  const roles = authStore.user?.roles || []
  if (roles.includes('admin') || roles.includes('superadmin')) {
    next()
  } else {
    // Redirect non-admin users away (e.g., back to landing or dashboard)
    next({ name: AppRouteNames.Landing })
  }
}
