import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LandingPage from '@/views/LandingPage.vue'
import ContentManagementView from '@/features/admin/content/views/ContentView.vue'
import AdminDashboardView from '@/features/admin/dashboard/views/AdminDashboardView.vue'
import AdminLayout from '@/features/admin/layout/AdminLayout.vue'
import AdminPlayableView from '@/features/admin/playable/views/PlayableView.vue'
import UserManagementView from '@/features/admin/user/views/UserView.vue'

import { useAuthStore } from '@/features/auth/stores/authStore'
import ForgotPasswordView from '@/features/auth/views/ForgotPasswordView.vue'
import LoginView from '@/features/auth/views/LoginView.vue'
import RegisterView from '@/features/auth/views/RegisterView.vue'


import { adminGuard } from '../features/admin/router/adminGuard'
import { AppRouteNames, AppRoutePaths } from './routes'

const routes: Array<RouteRecordRaw> = [
  // Public routes
  {
    path: AppRoutePaths.Landing,
    name: AppRouteNames.Landing,
    component: LandingPage,
    meta: { requiresAuth: false },
  },
  {
    path: AppRoutePaths.Login,
    name: AppRouteNames.Login,
    component: LoginView,
    meta: { requiresAuth: false },
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      if (authStore.isAuthenticated) {
        next(AppRoutePaths.AdminDashboard)
      } else {
        next()
      }
    },
  },
  {
    path: AppRoutePaths.Register,
    name: AppRouteNames.Register,
    component: RegisterView,
    meta: { requiresAuth: false },
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      if (authStore.isAuthenticated) {
        next(AppRoutePaths.AdminDashboard)
      } else {
        next()
      }
    },
  },
  {
    path: AppRoutePaths.ForgotPassword,
    name: AppRouteNames.ForgotPassword,
    component: ForgotPasswordView,
    meta: { requiresAuth: false },
  },

  // Admin routes (wrapped in AdminLayout)
  {
    path: AppRoutePaths.Admin,
    component: AdminLayout,
    meta: { requiresAuth: true },
    beforeEnter: adminGuard,
    children: [
      { path: '', redirect: { name: AppRouteNames.AdminDashboard } },
      { path: 'dashboard', name: AppRouteNames.AdminDashboard, component: AdminDashboardView },
      { path: 'users', name: AppRouteNames.AdminUsers, component: UserManagementView },
      { path: 'content', name: AppRouteNames.AdminContent, component: ContentManagementView },
      { path: 'playables', name: AppRouteNames.AdminPlayables, component: AdminPlayableView }, // ✅ NEW
    ],
  },

  // Future protected routes (main user dashboard, etc.)
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
