/**
 * =========================================================
 * Playable Tag Service (Admin)
 * =========================================================
 *
 * This service provides all frontend API interactions related
 * to canonical playable tag definitions within the admin portal.
 *
 * Scope of this file:
 * - Fetching playable tags for assignment selectors and tag tools
 * - Creating canonical playable tag definitions
 * - Updating canonical playable tag definitions
 * - Toggling / restoring tag active state
 * - Managing tag-category links for older category-link workflows
 *
 * Architectural Notes:
 * ---------------------------------------------------------
 * 1. Separation of Concerns
 *    This file ONLY handles playable-tag API calls.
 *
 *    Class/species assignment endpoints are handled by:
 *    - playableClassService
 *    - playableSpeciesService
 *
 * 2. Canonical Tags vs Assignments
 *    Tags defined here are canonical reference records.
 *
 *    Assigning tags to classes/species happens through
 *    class/species-specific junction endpoints, not through
 *    this service.
 *
 * 3. Legacy Category Link Endpoints
 *    Some category-link operations still use the older
 *    /admin/playable-tags/:tagId/categories endpoint family.
 *
 *    Those functions are kept here because they are still
 *    tag-specific, but they are documented separately from the
 *    primary canonical tag CRUD functions.
 *
 * 4. Response Shape
 *    The current tag endpoints return direct response bodies
 *    rather than the newer { message, data } wrapper used by
 *    some newer admin services.
 *
 *    This service preserves that current backend contract.
 *
 * =========================================================
 */

import { axiosInstance } from '@/services/apiClient'

/**
 * ---------------------------------------------------------
 * PlayableTag
 * ---------------------------------------------------------
 *
 * Frontend shape for a canonical playable tag definition as
 * returned by the current admin tag endpoints.
 *
 * Notes:
 * - `id` is the stable canonical identifier used by the backend.
 * - `name` is the internal canonical name.
 * - `slug` is the URL-safe/public-facing identifier.
 * - `displayName` is the admin-facing label.
 * - `tagCategory` refers to the semantic grouping of the tag.
 * - `sortOrder` may exist for tag-management purposes even if
 *   not always surfaced in assignment-level UI.
 */
export interface PlayableTag {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null
  tagCategory: string | null
  isActive: boolean | null
  sortOrder: number | null
}

/**
 * ---------------------------------------------------------
 * PlayableTagCategoryFilter
 * ---------------------------------------------------------
 *
 * Optional filter accepted by the current tag browse endpoint.
 *
 * Notes:
 * - This is an endpoint filter, not the same thing as the
 *   returned `tagCategory` field.
 * - Current supported filter values distinguish class-facing
 *   and species-facing tag usage.
 */
export type PlayableTagCategoryFilter = 'class' | 'species'

/**
 * ---------------------------------------------------------
 * CreatePlayableTagPayload
 * ---------------------------------------------------------
 *
 * Payload used to create a canonical playable tag definition.
 *
 * Notes:
 * - The current backend expects `category`, not `tagCategory`,
 *   for create/update payloads.
 * - `colorHex` is retained because the current endpoint accepts
 *   it, even though the main PlayableTag shape does not expose it.
 */
export interface CreatePlayableTagPayload {
  name: string
  description?: string
  colorHex?: string
  category: PlayableTagCategoryFilter
}

/**
 * ---------------------------------------------------------
 * UpdatePlayableTagPayload
 * ---------------------------------------------------------
 *
 * Payload used to update an existing canonical playable tag
 * definition.
 *
 * Notes:
 * - All fields are optional because partial updates are allowed.
 * - The current backend expects `category`, not `tagCategory`,
 *   for category updates.
 */
export interface UpdatePlayableTagPayload {
  name?: string
  description?: string
  sortOrder?: number
  colorHex?: string
  category?: PlayableTagCategoryFilter
}

/**
 * ---------------------------------------------------------
 * TagCategoryLink
 * ---------------------------------------------------------
 *
 * Frontend shape for a category linked to a playable tag through
 * the legacy tag-category link endpoints.
 *
 * Notes:
 * - This is not the same as the simple `tagCategory` string on
 *   PlayableTag.
 * - These records represent explicit category-link metadata.
 */
export interface TagCategoryLink {
  id: string
  name: string
  displayName?: string
  colorHex: string
  isPrimary: boolean
}

/**
 * ---------------------------------------------------------
 * getPlayableTags
 * ---------------------------------------------------------
 *
 * Fetches playable tags from the admin tag endpoint.
 *
 * Endpoint:
 * GET /admin/playable/tags
 *
 * Query parameters:
 * - includeInactive: whether inactive tags should be included
 * - category: optional class/species filter
 *
 * Returns:
 * - an array of canonical playable tag definitions
 *
 * Typical usage:
 * - tag assignment selectors
 * - tag browse/admin tools
 * - create/edit modal reference loading
 */
export async function getPlayableTags(
  includeInactive = false,
  category?: PlayableTagCategoryFilter
): Promise<PlayableTag[]> {
  const params: Record<string, string | boolean> = {}

  if (includeInactive) params.includeInactive = true
  if (category) params.category = category

  const response = await axiosInstance.get<PlayableTag[]>(
    '/admin/playable/tags',
    { params }
  )

  return response.data
}

/**
 * ---------------------------------------------------------
 * createPlayableTag
 * ---------------------------------------------------------
 *
 * Creates a new canonical playable tag definition.
 *
 * Endpoint:
 * POST /admin/playable/tags
 *
 * Payload:
 * - name
 * - description
 * - colorHex
 * - category
 *
 * Returns:
 * - the created playable tag record
 *
 * Note:
 * This endpoint currently returns the created tag directly,
 * not a { message, data } wrapper.
 */
export async function createPlayableTag(
  payload: CreatePlayableTagPayload
): Promise<PlayableTag> {
  const response = await axiosInstance.post<PlayableTag>(
    '/admin/playable/tags',
    payload
  )

  return response.data
}

/**
 * ---------------------------------------------------------
 * updatePlayableTag
 * ---------------------------------------------------------
 *
 * Updates an existing canonical playable tag definition.
 *
 * Endpoint:
 * PATCH /admin/playable/tags/:id
 *
 * Payload:
 * - name
 * - description
 * - sortOrder
 * - colorHex
 * - category
 *
 * Returns:
 * - the updated playable tag record
 *
 * Note:
 * This endpoint currently returns the updated tag directly,
 * not a { message, data } wrapper.
 */
export async function updatePlayableTag(
  id: string,
  payload: UpdatePlayableTagPayload
): Promise<PlayableTag> {
  const response = await axiosInstance.patch<PlayableTag>(
    `/admin/playable/tags/${id}`,
    payload
  )

  return response.data
}

/**
 * ---------------------------------------------------------
 * deletePlayableTag
 * ---------------------------------------------------------
 *
 * Soft-deletes a playable tag.
 *
 * Endpoint:
 * DELETE /admin/playable/tags/:id
 *
 * Behavior:
 * - the backend handles whether the tag can be safely disabled
 * - currently intended for unused tags only
 *
 * Returns:
 * - no response body is consumed by the frontend
 */
export async function deletePlayableTag(id: string): Promise<void> {
  await axiosInstance.delete(`/admin/playable/tags/${id}`)
}

/**
 * ---------------------------------------------------------
 * restorePlayableTag
 * ---------------------------------------------------------
 *
 * Restores a previously inactive playable tag.
 *
 * Endpoint:
 * PATCH /admin/playable/tags/:id/active
 *
 * Payload:
 * {
 *   isActive: true
 * }
 *
 * Returns:
 * - no response body is consumed by the frontend
 */
export async function restorePlayableTag(id: string): Promise<void> {
  await axiosInstance.patch(`/admin/playable/tags/${id}/active`, {
    isActive: true,
  })
}

/**
 * ---------------------------------------------------------
 * togglePlayableTagActive
 * ---------------------------------------------------------
 *
 * Toggles whether a playable tag is active.
 *
 * Endpoint:
 * PATCH /admin/playable/tags/:id/active
 *
 * Payload:
 * {
 *   isActive: boolean
 * }
 *
 * Returns:
 * - the updated playable tag record
 */
export async function togglePlayableTagActive(
  id: string,
  isActive: boolean
): Promise<PlayableTag> {
  const response = await axiosInstance.patch<PlayableTag>(
    `/admin/playable/tags/${id}/active`,
    { isActive }
  )

  return response.data
}

/**
 * ---------------------------------------------------------
 * getTagCategories
 * ---------------------------------------------------------
 *
 * Fetches all explicit category links for a playable tag.
 *
 * Endpoint:
 * GET /admin/playable-tags/:tagId/categories
 *
 * Returns:
 * - category-link records associated with the tag
 *
 * Note:
 * This endpoint belongs to the older tag-category link workflow.
 * It is kept here because the operation is still tag-specific.
 */
export async function getTagCategories(
  tagId: string
): Promise<TagCategoryLink[]> {
  const response = await axiosInstance.get<TagCategoryLink[]>(
    `/admin/playable-tags/${tagId}/categories`
  )

  return response.data
}

/**
 * ---------------------------------------------------------
 * setPrimaryCategory
 * ---------------------------------------------------------
 *
 * Marks one linked category as the primary category for a tag.
 *
 * Endpoint:
 * PATCH /admin/playable-tags/:tagId/categories/:categoryId
 *
 * Payload:
 * {
 *   isPrimary: true
 * }
 *
 * Returns:
 * - no response body is consumed by the frontend
 */
export async function setPrimaryCategory(
  tagId: string,
  categoryId: string
): Promise<void> {
  await axiosInstance.patch(
    `/admin/playable-tags/${tagId}/categories/${categoryId}`,
    { isPrimary: true }
  )
}

/**
 * ---------------------------------------------------------
 * linkCategoryToTag
 * ---------------------------------------------------------
 *
 * Links a category to a playable tag.
 *
 * Endpoint:
 * POST /admin/playable-tags/:tagId/categories
 *
 * Payload:
 * {
 *   categoryId: string,
 *   isPrimary: boolean
 * }
 *
 * Returns:
 * - no response body is consumed by the frontend
 */
export async function linkCategoryToTag(
  tagId: string,
  categoryId: string,
  isPrimary = false
): Promise<void> {
  await axiosInstance.post(`/admin/playable-tags/${tagId}/categories`, {
    categoryId,
    isPrimary,
  })
}

/**
 * ---------------------------------------------------------
 * unlinkCategoryFromTag
 * ---------------------------------------------------------
 *
 * Removes a category link from a playable tag.
 *
 * Endpoint:
 * DELETE /admin/playable-tags/:tagId/categories/:categoryId
 *
 * Returns:
 * - no response body is consumed by the frontend
 */
export async function unlinkCategoryFromTag(
  tagId: string,
  categoryId: string
): Promise<void> {
  await axiosInstance.delete(
    `/admin/playable-tags/${tagId}/categories/${categoryId}`
  )
}

/**
 * ---------------------------------------------------------
 * playableTagService
 * ---------------------------------------------------------
 *
 * Convenience service export used by components/stores that
 * prefer object-style access over named imports.
 *
 * This keeps tag-related API calls grouped together in a
 * single namespace:
 *
 * playableTagService.getPlayableTags()
 * playableTagService.createPlayableTag(...)
 * playableTagService.updatePlayableTag(...)
 *
 * Note:
 * Both named exports and the grouped service object are kept
 * available so the calling code can use whichever style fits
 * the surrounding pattern best.
 */
export const playableTagService = {
  getPlayableTags,
  createPlayableTag,
  updatePlayableTag,
  deletePlayableTag,
  restorePlayableTag,
  togglePlayableTagActive,
  getTagCategories,
  setPrimaryCategory,
  linkCategoryToTag,
  unlinkCategoryFromTag,
}