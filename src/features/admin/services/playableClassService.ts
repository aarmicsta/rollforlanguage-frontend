/**
 * =========================================================
 * Playable Class Service (Admin)
 * =========================================================
 *
 * This service provides all frontend API interactions related
 * to playable classes within the admin portal.
 *
 * Scope of this file:
 * - Fetching classes for admin browse views
 * - Updating core class fields (displayName, description, isActive)
 * - Fetching assigned relational data (e.g., tags)
 * - Updating relational assignments using replace-all patterns
 *
 * Architectural Notes:
 * ---------------------------------------------------------
 * 1. Separation of Concerns
 *    This file ONLY handles class-specific API calls.
 *
 *    Shared reference data (tags, stats, passives) is handled
 *    by separate services, for example:
 *    - playableTagService
 *    - playableStatService
 *
 *    This distinction mirrors the backend architecture:
 *    - Reference tables (playable_tags, playable_passives, etc.)
 *    - Junction tables (playable_class_tags, etc.)
 *
 * 2. Scalar vs Relational Data
 *    - "Scalar fields" (displayName, description, isActive)
 *      are updated via:
 *        PATCH /admin/playable-classes/:id
 *
 *    - "Relational data" (tags, passives, stats)
 *      is handled via dedicated endpoints, for example:
 *        GET   /admin/playable-classes/:id/tags
 *        PATCH /admin/playable-classes/:id/tags
 *
 * 3. Replace-All Update Pattern
 *    Relational updates (like tags) use a full replacement
 *    approach rather than incremental add/remove operations.
 *
 *    Example:
 *      { tagIds: [...] }
 *
 *    This simplifies backend logic and aligns with form-based
 *    admin editing workflows.
 *
 * 4. Response Shape Consistency
 *    Update endpoints return:
 *      {
 *        message: string,
 *        data: ...
 *      }
 *
 *    This allows the frontend to immediately use the
 *    backend-confirmed updated state.
 *
 * 5. Future Expansion
 *    This service will likely expand to include:
 *    - class passives
 *    - class stat modifiers
 *    - possibly full "class detail" fetch endpoints
 *
 *    The same structural patterns should be followed.
 *
 * =========================================================
 */

import { axiosInstance } from '@/services/axiosInstance'

/**
 * ---------------------------------------------------------
 * PlayableClass
 * ---------------------------------------------------------
 *
 * Frontend shape for a playable class record as returned by
 * the admin class endpoints.
 *
 * This currently represents the "core scalar fields" for a
 * class record — i.e. the direct fields stored on the
 * class itself, rather than related collections like tags,
 * passives, or stat modifiers.
 *
 * Notes:
 * - `id` is the stable canonical identifier used by the backend.
 * - `name` is the internal canonical name.
 * - `slug` is the URL-safe/public-facing identifier.
 * - `displayName` is the admin/player-friendly label.
 * - `sortOrder` still exists in the DB model, but classes are
 *   currently browsed alphabetically rather than by sort order.
 * - nullable fields reflect current backend response behavior.
 */
export interface PlayableClass {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null
  iconMediaAssetId: string | null
  isActive: boolean | null
  sortOrder: number | null
  createdAt: string | null
  updatedAt: string | null
}

/**
 * ---------------------------------------------------------
 * PlayableClassTag
 * ---------------------------------------------------------
 *
 * Frontend shape for a tag assigned to a playable class.
 *
 * These records come from the class-tag assignment endpoints,
 * which read from the class/tag junction table and return the
 * resolved tag objects rather than raw tag IDs.
 *
 * This means the frontend receives full tag metadata that can
 * be displayed directly in the UI without needing a second
 * lookup for each assigned tag.
 *
 * Notes:
 * - `tagCategory` refers to the canonical tag grouping
 *   (for example: combat_style, magic_source, etc.).
 * - This is NOT the same thing as "species vs class".
 * - `sortOrder` exists on the canonical tag definition and may
 *   still be useful elsewhere, even if not always surfaced in UI.
 */
export interface PlayableClassTag {
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
 * getPlayableClasses
 * ---------------------------------------------------------
 *
 * Fetches the full browse list of playable classes for the
 * admin class table/modal.
 *
 * Endpoint:
 * GET /admin/playable-classes
 *
 * Returns:
 * - an array of class records
 *
 * Typical usage:
 * - class browse modal/table
 * - refresh after edits
 * - initial admin class load
 */
export async function getPlayableClasses(): Promise<PlayableClass[]> {
  const response = await axiosInstance.get<PlayableClass[]>('/admin/playable-classes')
  return response.data
}

/**
 * ---------------------------------------------------------
 * updatePlayableClass
 * ---------------------------------------------------------
 *
 * Updates the editable "core fields" for a single playable
 * class record.
 *
 * Endpoint:
 * PATCH /admin/playable-classes/:id
 *
 * Current editable fields supported by this endpoint:
 * - displayName
 * - description
 * - isActive
 *
 * Returns:
 * - a success message
 * - the updated class record in `data`
 *
 * Why return `data`?
 * - lets the frontend immediately use the backend-confirmed
 *   updated row
 * - avoids relying only on local form state
 * - makes future optimization easier if we reduce refetching
 */
export async function updatePlayableClass(
  id: string,
  payload: {
    displayName: string
    description: string | null
    isActive: boolean
  }
): Promise<{
  message: string
  data: PlayableClass | null
}> {
  const response = await axiosInstance.patch(
    `/admin/playable-classes/${id}`,
    payload
  )

  return response.data
}

/**
 * ---------------------------------------------------------
 * getPlayableClassTags
 * ---------------------------------------------------------
 *
 * Fetches the currently assigned tags for a specific class.
 *
 * Endpoint:
 * GET /admin/playable-classes/:id/tags
 *
 * Returns:
 * - an array of resolved tag objects assigned to the class
 *
 * Important:
 * - this endpoint returns assigned tags only
 * - it does NOT return the full master list of available tags
 *
 * That distinction matters:
 * - use this function to load what the class currently has
 * - use the shared tag reference service to load all available
 *   tag options for selection UI
 */
export async function getPlayableClassTags(
  id: string
): Promise<PlayableClassTag[]> {
  const response = await axiosInstance.get<PlayableClassTag[]>(
    `/admin/playable-classes/${id}/tags`
  )
  return response.data
}

/**
 * ---------------------------------------------------------
 * updatePlayableClassTags
 * ---------------------------------------------------------
 *
 * Replaces the full assigned tag set for a specific class.
 *
 * Endpoint:
 * PATCH /admin/playable-classes/:id/tags
 *
 * Payload shape:
 * {
 *   tagIds: string[]
 * }
 *
 * Behavior:
 * - this uses a "replace-all" update pattern
 * - the provided `tagIds` become the new full assignment set
 * - any previously assigned tags not included are removed
 *
 * Returns:
 * - a success message
 * - the updated assigned tag objects in `data`
 *
 * Why replace-all instead of add/remove one at a time?
 * - simpler backend logic
 * - easier admin form workflow
 * - cleaner match for multi-select editing UIs
 */
export async function updatePlayableClassTags(
  id: string,
  payload: { tagIds: string[] }
): Promise<{
  message: string
  data: PlayableClassTag[]
}> {
  const response = await axiosInstance.patch(
    `/admin/playable-classes/${id}/tags`,
    payload
  )

  return response.data
}

/**
 * ---------------------------------------------------------
 * playableClassService
 * ---------------------------------------------------------
 *
 * Convenience service export used by components/stores that
 * prefer object-style access over named imports.
 *
 * This keeps class-related API calls grouped together in a
 * single namespace:
 *
 * playableClassService.getPlayableClasses()
 * playableClassService.updatePlayableClass(...)
 * playableClassService.getPlayableClassTags(...)
 * playableClassService.updatePlayableClassTags(...)
 *
 * Note:
 * Both named exports and the grouped service object are kept
 * available so the calling code can use whichever style fits
 * the surrounding pattern best.
 */
export const playableClassService = {
  getPlayableClasses,
  updatePlayableClass,
  getPlayableClassTags,
  updatePlayableClassTags,
}