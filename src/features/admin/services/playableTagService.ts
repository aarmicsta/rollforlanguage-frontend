// /src/features/admin/services/playableTagService.ts

import { axiosInstance } from '@/services/axiosInstance'

/**
 * ---------------------------------------------------------
 * PlayableTag
 * ---------------------------------------------------------
 *
 * Frontend shape for a canonical playable tag definition as
 * returned by the current admin tag endpoints.
 *
 * Notes:
 * - `displayName` is the human-facing label shown in admin UI.
 * - `tagCategory` refers to the semantic grouping of the tag
 *   (for example: temperament, nature, etc.).
 * - This is NOT the same thing as "species vs class".
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

// 🔍 GET all tags (optionally include inactive + filter by category)
export async function getPlayableTags(
  includeInactive = false,
  category?: 'class' | 'species'
): Promise<PlayableTag[]> {
  const params: Record<string, string | boolean> = {}
  if (includeInactive) params.includeInactive = true
  if (category) params.category = category

  const response = await axiosInstance.get('/admin/playable/tags', { params })
  return response.data
}

// ➕ POST: create a new tag
export async function createPlayableTag(payload: {
  name: string
  description?: string
  colorHex?: string
  category: 'class' | 'species' // ✅ Enforce category at creation
}): Promise<PlayableTag> {
  const response = await axiosInstance.post('/admin/playable/tags', payload)
  return response.data
}

// 📝 PATCH: update tag name/description/sortOrder
export async function updatePlayableTag(id: string, payload: {
  name?: string
  description?: string
  sortOrder?: number
  colorHex?: string
  category?: 'class' | 'species' // ✅ Allow changing category
}): Promise<PlayableTag> {
  const response = await axiosInstance.patch(`/admin/playable/tags/${id}`, payload)
  return response.data
}

// 🗑 DELETE: soft-delete a tag (only works if unused)
export async function deletePlayableTag(id: string): Promise<void> {
  await axiosInstance.delete(`/admin/playable/tags/${id}`)
}

// ♻️ PATCH: restore soft-deleted tag
export async function restorePlayableTag(id: string): Promise<void> {
  await axiosInstance.patch(`/admin/playable/tags/${id}/active`, {
    isActive: true
  })
}

// 🔁 PATCH: toggle isActive to enable/disable tag
export async function togglePlayableTagActive(id: string, isActive: boolean): Promise<PlayableTag> {
  const response = await axiosInstance.patch(`/admin/playable/tags/${id}/active`, { isActive })
  return response.data
}

// 📎 GET: all categories linked to a given tag
export interface TagCategoryLink {
  id: string
  name: string
  displayName?: string
  colorHex: string
  isPrimary: boolean
}

export async function getTagCategories(tagId: string): Promise<TagCategoryLink[]> {
  const response = await axiosInstance.get(`/admin/playable-tags/${tagId}/categories`)
  return response.data
}

// 🛠 PATCH: update isPrimary for a category link
export async function setPrimaryCategory(tagId: string, categoryId: string): Promise<void> {
  await axiosInstance.patch(`/admin/playable-tags/${tagId}/categories/${categoryId}`, {
    isPrimary: true
  })
}

// ➕ Link a category to a tag
export async function linkCategoryToTag(tagId: string, categoryId: string, isPrimary = false): Promise<void> {
  await axiosInstance.post(`/admin/playable-tags/${tagId}/categories`, {
    categoryId,
    isPrimary
  })
}

// ❌ Unlink a category from a tag
export async function unlinkCategoryFromTag(tagId: string, categoryId: string): Promise<void> {
  await axiosInstance.delete(`/admin/playable-tags/${tagId}/categories/${categoryId}`)
}
