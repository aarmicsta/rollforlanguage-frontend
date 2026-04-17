import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * =========================================================
 * Content Store
 * =========================================================
 *
 * Responsibilities
 * - own shared dashboard state for the Content admin domain
 *
 * Current Scope
 * - active content domain only
 *
 * Notes
 * - This is the first live behavior step
 * - Additional state (active surface, modal visibility,
 *   refresh triggers, selected records, etc.) will be added
 *   incrementally as the Content domain grows
 * =========================================================
 */

export type ContentDomain = 'creatures' | 'items'

export const useContentStore = defineStore('content', () => {
  /**
   * ---------------------------------------------------------
   * Active Content Domain
   * ---------------------------------------------------------
   *
   * Determines which Content category the user is currently
   * working in.
   */
  const activeContentDomain = ref<ContentDomain>('creatures')

  /**
   * ---------------------------------------------------------
   * Actions
   * ---------------------------------------------------------
   */
  function setActiveContentDomain(domain: ContentDomain) {
    activeContentDomain.value = domain
  }

  return {
    activeContentDomain,
    setActiveContentDomain,
  }
})