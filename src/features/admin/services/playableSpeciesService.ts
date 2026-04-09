/**
 * =========================================================
 * Playable Species Service (Admin)
 * =========================================================
 *
 * This service provides all frontend API interactions related
 * to playable species within the admin portal.
 *
 * Scope of this file:
 * - Fetching species for admin browse views
 * - Updating core species fields (displayName, description, isActive)
 * - Fetching assigned relational data (e.g., tags)
 * - Updating relational assignments using replace-all patterns
 *
 * Architectural Notes:
 * ---------------------------------------------------------
 * 1. Separation of Concerns
 *    This file ONLY handles species-specific API calls.
 *
 *    Shared reference data (tags, stats, passives) is handled
 *    by separate services, for example:
 *    - playableTagService
 *    - playableStatService
 *
 *    This distinction mirrors the backend architecture:
 *    - Reference tables (playable_tags, playable_passives, etc.)
 *    - Junction tables (playable_species_tags, etc.)
 *
 * 2. Scalar vs Relational Data
 *    - "Scalar fields" (displayName, description, isActive)
 *      are updated via:
 *        PATCH /admin/playable-species/:id
 *
 *    - "Relational data" (tags, passives, stats)
 *      is handled via dedicated endpoints, for example:
 *        GET   /admin/playable-species/:id/tags
 *        PATCH /admin/playable-species/:id/tags
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
 *    - species passives
 *    - species stat modifiers
 *    - possibly full "species detail" fetch endpoints
 *
 *    The same structural patterns should be followed.
 *
 * =========================================================
 */

import { axiosInstance } from '@/services/axiosInstance'

/**
 * ---------------------------------------------------------
 * PlayableSpecies
 * ---------------------------------------------------------
 *
 * Frontend shape for a playable species record as returned by
 * the admin species endpoints.
 *
 * This currently represents the "core scalar fields" for a
 * species record — i.e. the direct fields stored on the
 * species itself, rather than related collections like tags,
 * passives, or stat modifiers.
 *
 * Notes:
 * - `id` is the stable canonical identifier used by the backend.
 * - `name` is the internal canonical name.
 * - `slug` is the URL-safe/public-facing identifier.
 * - `displayName` is the admin/player-friendly label.
 * - `sortOrder` still exists in the DB model, but species are
 *   currently browsed alphabetically rather than by sort order.
 * - nullable fields reflect current backend response behavior.
 */
export interface PlayableSpecies {
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
 * PlayableSpeciesTag
 * ---------------------------------------------------------
 *
 * Frontend shape for a tag assigned to a playable species.
 *
 * These records come from the species-tag assignment endpoints,
 * which read from the species/tag junction table and return the
 * resolved tag objects rather than raw tag IDs.
 *
 * This means the frontend receives full tag metadata that can
 * be displayed directly in the UI without needing a second
 * lookup for each assigned tag.
 *
 * Notes:
 * - `tagCategory` refers to the canonical tag grouping
 *   (for example: temperament, nature, etc.).
 * - This is NOT the same thing as "species vs class".
 * - `sortOrder` exists on the canonical tag definition and may
 *   still be useful elsewhere, even if not always surfaced in UI.
 */
export interface PlayableSpeciesTag {
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
 * getPlayableSpecies
 * ---------------------------------------------------------
 *
 * Fetches the full browse list of playable species for the
 * admin species table/modal.
 *
 * Endpoint:
 * GET /admin/playable-species
 *
 * Returns:
 * - an array of species records
 *
 * Typical usage:
 * - species browse modal/table
 * - refresh after edits
 * - initial admin species load
 */
export async function getPlayableSpecies(): Promise<PlayableSpecies[]> {
  const response = await axiosInstance.get<PlayableSpecies[]>('/admin/playable-species')
  return response.data
}

/**
 * ---------------------------------------------------------
 * updatePlayableSpecies
 * ---------------------------------------------------------
 *
 * Updates the editable "core fields" for a single playable
 * species record.
 *
 * Endpoint:
 * PATCH /admin/playable-species/:id
 *
 * Current editable fields supported by this endpoint:
 * - displayName
 * - description
 * - isActive
 *
 * Returns:
 * - a success message
 * - the updated species record in `data`
 *
 * Why return `data`?
 * - lets the frontend immediately use the backend-confirmed
 *   updated row
 * - avoids relying only on local form state
 * - makes future optimization easier if we reduce refetching
 */
export async function updatePlayableSpecies(
  id: string,
  payload: { 
    displayName: string
    description: string | null
    isActive: boolean
  }
): Promise<{
  message: string
  data: PlayableSpecies | null
}> {
  const response = await axiosInstance.patch(
    `/admin/playable-species/${id}`,
    payload
  )

  return response.data
}

/**
 * ---------------------------------------------------------
 * createPlayableSpecies
 * ---------------------------------------------------------
 *
 * Creates a new playable species record.
 *
 * Endpoint:
 * POST /admin/playable-species
 *
 * Payload:
 * - displayName
 * - name (canonical internal)
 * - slug (URL-safe identifier)
 * - description (nullable)
 * - isActive
 *
 * Notes:
 * - `id` is generated by the backend
 * - canonical naming rules are enforced on the frontend
 *
 * Returns:
 * - success message
 * - created species record in `data`
 */
export async function createPlayableSpecies(
  payload: {
    displayName: string
    name: string
    slug: string
    description: string | null
    isActive: boolean
  }
): Promise<{
  message: string
  data: PlayableSpecies | null
}> {
  const response = await axiosInstance.post(
    `/admin/playable-species`,
    payload
  )

  return response.data
}

/**
 * ---------------------------------------------------------
 * getPlayableSpeciesTags
 * ---------------------------------------------------------
 *
 * Fetches the currently assigned tags for a specific species.
 *
 * Endpoint:
 * GET /admin/playable-species/:id/tags
 *
 * Returns:
 * - an array of resolved tag objects assigned to the species
 *
 * Important:
 * - this endpoint returns assigned tags only
 * - it does NOT return the full master list of available tags
 *
 * That distinction matters:
 * - use this function to load what the species currently has
 * - use the shared tag reference service to load all available
 *   tag options for selection UI
 */
export async function getPlayableSpeciesTags(
  id: string
): Promise<PlayableSpeciesTag[]> {
  const response = await axiosInstance.get<PlayableSpeciesTag[]>(
    `/admin/playable-species/${id}/tags`
  )
  return response.data
}

/**
 * ---------------------------------------------------------
 * updatePlayableSpeciesTags
 * ---------------------------------------------------------
 *
 * Replaces the full assigned tag set for a specific species.
 *
 * Endpoint:
 * PATCH /admin/playable-species/:id/tags
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
export async function updatePlayableSpeciesTags(
  id: string,
  payload: { tagIds: string[] }
): Promise<{
  message: string
  data: PlayableSpeciesTag[]
}> {
  const response = await axiosInstance.patch(
    `/admin/playable-species/${id}/tags`,
    payload
  )

  return response.data
}

/**
 * ---------------------------------------------------------
 * playableSpeciesService
 * ---------------------------------------------------------
 *
 * Convenience service export used by components/stores that
 * prefer object-style access over named imports.
 *
 * This keeps species-related API calls grouped together in a
 * single namespace:
 *
 * playableSpeciesService.getPlayableSpecies()
 * playableSpeciesService.updatePlayableSpecies(...)
 * playableSpeciesService.getPlayableSpeciesTags(...)
 * playableSpeciesService.updatePlayableSpeciesTags(...)
 *
 * Note:
 * Both named exports and the grouped service object are kept
 * available so the calling code can use whichever style fits
 * the surrounding pattern best.
 */
export const playableSpeciesService = {
  getPlayableSpecies,
  createPlayableSpecies,
  updatePlayableSpecies,
  getPlayableSpeciesTags,
  updatePlayableSpeciesTags,
}