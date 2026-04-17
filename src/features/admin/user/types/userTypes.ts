/**
 * =========================================================
 * User Types
 * =========================================================
 *
 * Shared frontend types for the admin user management system.
 *
 * Scope:
 * - browse table items
 * - create user payloads
 * - update user payloads
 * - dashboard metrics
 *
 * Notes:
 * - these types should reflect the current backend contract
 * - MVP scope is intentionally tight
 * - add fields only when they are truly needed by implemented workflows
 */

/**
 * ---------------------------------------------------------
 * UserRole
 * ---------------------------------------------------------
 *
 * Canonical role values currently supported by the admin user
 * management system.
 */
export type UserRole = 'superadmin' | 'admin' | 'teacher' | 'student'

/**
 * ---------------------------------------------------------
 * UserBrowseItem
 * ---------------------------------------------------------
 *
 * Minimal user shape needed for browse, selection, and edit-entry
 * flows in the admin dashboard.
 */
export interface UserBrowseItem {
  id: string
  username: string
  email: string
  role: UserRole
  createdAt: string
}

/**
 * ---------------------------------------------------------
 * CreateUserPayload
 * ---------------------------------------------------------
 *
 * Payload used by the Create User workflow.
 */
export interface CreateUserPayload {
  email: string
  username: string
  password: string
  role: UserRole
}

/**
 * ---------------------------------------------------------
 * UpdateUserPayload
 * ---------------------------------------------------------
 *
 * MVP editable fields for the Edit User workflow.
 *
 * Note:
 * - only include fields the backend actually supports
 * - expand later if/when edit capabilities grow
 */
export interface UpdateUserPayload {
  username?: string
  email?: string
  role?: UserRole
}

/**
 * ---------------------------------------------------------
 * UserMetrics
 * ---------------------------------------------------------
 *
 * Dashboard summary metrics for the Users system.
 */
export interface UserMetrics {
  totalUsers: number
  activeUsers: number
  suspendedUsers: number
  roles: {
    student?: number
    teacher?: number
    admin?: number
    superadmin?: number
  }
  newUsersPast7Days: number
}

/**
 * ---------------------------------------------------------
 * UserQueryParams
 * ---------------------------------------------------------
 *
 * Query parameters supported by the user browse endpoint.
 *
 * Notes:
 * - keep this aligned with the backend query contract
 * - most fields are optional because table controls may expose
 *   them progressively over time
 */
export interface UserQueryParams {
  search?: string
  role?: string
  roles?: string[]
  page?: number
  limit?: number
  sortBy?: 'username' | 'email' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  createdBefore?: string
  createdAfter?: string
  includeSuspended?: boolean
  includeCountOnly?: boolean
}

/**
 * ---------------------------------------------------------
 * UserPagination
 * ---------------------------------------------------------
 *
 * Standard pagination metadata returned alongside browse results.
 */
export interface UserPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * ---------------------------------------------------------
 * PaginatedUserResponse
 * ---------------------------------------------------------
 *
 * Standard paginated browse response for the user table.
 */
export interface PaginatedUserResponse {
  data: UserBrowseItem[]
  pagination: UserPagination
}