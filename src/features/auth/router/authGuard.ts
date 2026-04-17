import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { AppRouteNames } from '@/router/routes'
import { useAuthStore } from '@/features/auth/stores/authStore'

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: AppRouteNames.Login })
  } else {
    next()
  }
}
