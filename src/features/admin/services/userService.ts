/**
 * =========================================================
 * User Service (Admin)
 * =========================================================
 *
 * This service provides frontend API interactions related to
 * admin user management.
 *
 * Responsibilities:
 * - fetch paginated user browse data
 * - create new users
 * - update existing users
 * - fetch user dashboard metrics
 *
 * Architectural note:
 * - shared user types belong in `UserTypes.ts`
 * - this file owns API communication only
 */

import { axiosInstance } from '@/services/axiosInstance'
import type {
  CreateUserPayload,
  PaginatedUserResponse,
  UpdateUserPayload,
  UserMetrics,
  UserQueryParams,
} from '@/features/admin/types/UserTypes'

/**
 * ---------------------------------------------------------
 * getUsers
 * ---------------------------------------------------------
 *
 * Fetches paginated users using the supported browse query
 * parameters.
 *
 * Behavior:
 * - removes empty/null/undefined query values before sending
 * - preserves backend-driven pagination structure
 */
export async function getUsers(
  params: UserQueryParams = {}
): Promise<PaginatedUserResponse> {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== '' && value !== undefined && value !== null
    )
  )

  const response = await axiosInstance.get<PaginatedUserResponse>(
    '/admin/users',
    {
      params: filteredParams,
    }
  )

  return response.data
}

/**
 * ---------------------------------------------------------
 * createUser
 * ---------------------------------------------------------
 *
 * Creates a new user through the admin user-management API.
 */
export async function createUser(
  payload: CreateUserPayload
): Promise<{ message: string }> {
  const response = await axiosInstance.post('/admin/users', payload)
  return response.data
}

/**
 * ---------------------------------------------------------
 * updateUser
 * ---------------------------------------------------------
 *
 * Updates an existing user through the admin user-management API.
 *
 * MVP scope:
 * - username
 * - email
 * - role
 *
 * Note:
 * - expand the payload only when edit capabilities genuinely grow
 */
export async function updateUser(
  id: string,
  payload: UpdateUserPayload
): Promise<{ message: string }> {
  const response = await axiosInstance.patch(`/admin/users/${id}`, payload)
  return response.data
}

/**
 * ---------------------------------------------------------
 * getUserMetrics
 * ---------------------------------------------------------
 *
 * Fetches dashboard-level metrics for the Users system.
 */
export async function getUserMetrics(): Promise<UserMetrics> {
  const response = await axiosInstance.get<UserMetrics>('/admin/users/metrics')
  return response.data
}

/**
 * ---------------------------------------------------------
 * userService
 * ---------------------------------------------------------
 *
 * Convenience grouped export for components/stores that prefer
 * object-style access.
 */
export const userService = {
  getUsers,
  createUser,
  updateUser,
  getUserMetrics,
}