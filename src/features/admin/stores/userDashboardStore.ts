/**
 * =========================================================
 * User Dashboard Store
 * =========================================================
 *
 * Central orchestration store for the admin Users dashboard.
 *
 * Responsibilities:
 * - own cross-component UI orchestration state
 * - control create/edit modal visibility
 * - store selected user for edit workflows
 * - manage active management surface visibility
 * - provide shared refresh signaling
 * - fetch and store dashboard metrics
 *
 * Architectural note:
 * - this store does NOT own table datasets
 * - this store does NOT perform browse-data caching
 * - this store does NOT become a service layer
 */

import type { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { userService } from '@/features/admin/services/userService'
import type {
  CreateUserPayload,
  UserBrowseItem,
  UserMetrics,
} from '@/features/admin/types/UserTypes'

export const useUserDashboardStore = defineStore('userDashboard', {
  state: () => ({
    /**
     * -----------------------------------------------------
     * Refresh Signaling
     * -----------------------------------------------------
     *
     * Shared reactive trigger used by user tables/widgets to
     * refetch data after a successful mutation.
     */
    lastUserListRefresh: Date.now(),

    /**
     * -----------------------------------------------------
     * Modal Visibility State
     * -----------------------------------------------------
     *
     * Centralized dashboard workflow modal visibility flags.
     */
    showCreateUserModal: false,
    showEditUserModal: false,

    /**
     * -----------------------------------------------------
     * Management Surface State
     * -----------------------------------------------------
     *
     * Controls which first-class management surface is currently
     * visible on the dashboard.
     *
     * MVP note:
     * - Users currently exposes a single primary management
     *   surface: the user table.
     */
    activeManagementSurface: null as 'users' | null,

    /**
     * -----------------------------------------------------
     * Selected Entity State
     * -----------------------------------------------------
     *
     * Source-of-truth selected user for edit workflows.
     */
    selectedUser: null as UserBrowseItem | null,

    /**
     * -----------------------------------------------------
     * Shared Async / Error State
     * -----------------------------------------------------
     *
     * Used by modal workflows and dashboard metrics fetches.
     */
    isSubmitting: false,
    submitError: null as string | null,
    userMetricsError: null as string | null,

    /**
     * -----------------------------------------------------
     * Dashboard Metrics State
     * -----------------------------------------------------
     *
     * Read-model metrics displayed by user summary widgets.
     */
    userMetrics: null as UserMetrics | null,
  }),

  actions: {
    /**
     * -----------------------------------------------------
     * Create Modal Controls
     * -----------------------------------------------------
     */
    openCreateUserModal() {
      this.submitError = null
      this.showCreateUserModal = true
    },

    closeCreateUserModal() {
      this.showCreateUserModal = false
      this.submitError = null
    },

    /**
     * -----------------------------------------------------
     * Edit Modal Controls
     * -----------------------------------------------------
     */
    openEditUserModal(user: UserBrowseItem) {
      this.selectedUser = user
      this.submitError = null
      this.showEditUserModal = true
    },

    closeEditUserModal() {
      this.showEditUserModal = false
      this.selectedUser = null
      this.submitError = null
    },

    /**
     * -----------------------------------------------------
     * Management Surface Controls
     * -----------------------------------------------------
     *
     * Supports the canonical first-class management surface
     * pattern used by the new-generation admin dashboards.
     */
    toggleManagementSurface(surface: 'users') {
      this.activeManagementSurface =
        this.activeManagementSurface === surface ? null : surface
    },

    clearActiveManagementSurface() {
      this.activeManagementSurface = null
    },

    /**
     * -----------------------------------------------------
     * Refresh Signaling
     * -----------------------------------------------------
     */
    refreshUserList() {
      this.lastUserListRefresh = Date.now()
    },

    /**
     * -----------------------------------------------------
     * User Creation
     * -----------------------------------------------------
     *
     * Creates a user through the service layer and triggers
     * dashboard-wide refresh on success.
     *
     * Note:
     * - create modals may call this helper directly, or call
     *   the service themselves and then trigger refresh
     * - this helper is kept because it is useful and real
     */
    async createUser(payload: CreateUserPayload): Promise<void> {
      this.submitError = null

      try {
        await userService.createUser(payload)
        this.refreshUserList()
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ error: string }>
        this.submitError =
          axiosError.response?.data?.error || 'Failed to create user.'
        throw error
      }
    },

    /**
     * -----------------------------------------------------
     * Dashboard Metrics Fetch
     * -----------------------------------------------------
     */
    async fetchUserMetrics(): Promise<void> {
      this.userMetricsError = null

      try {
        const metrics = await userService.getUserMetrics()
        this.userMetrics = metrics
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ error: string }>
        this.userMetricsError =
          axiosError.response?.data?.error || 'Failed to fetch user metrics.'
        this.userMetrics = null
      }
    },
  },
})