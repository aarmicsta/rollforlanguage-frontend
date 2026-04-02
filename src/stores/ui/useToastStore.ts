// src/stores/ui/useToastStore.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * ---------------------------------------------------------
 * Toast Types
 * ---------------------------------------------------------
 *
 * Centralized union for supported toast variants.
 *
 * Keeping this local to the store is sufficient for now
 * because the toast type contract is still small and tightly
 * coupled to this store's public API.
 */
type ToastType = 'success' | 'error' | 'info'

/**
 * ---------------------------------------------------------
 * useToastStore
 * ---------------------------------------------------------
 *
 * Global UI store for toast notifications.
 *
 * Responsibilities:
 * - hold the current toast visibility state
 * - hold the current toast message + type
 * - provide a shared trigger point for global user feedback
 *
 * Architectural boundaries:
 * - this store manages toast state only
 * - this store does NOT render the toast UI
 * - this store does NOT own domain/business logic
 *
 * Rendering responsibility belongs to a persistent layout
 * layer (currently: AdminLayout), while feature components
 * and workflows may trigger toast messages through this store.
 */
export const useToastStore = defineStore('toast', () => {
  /**
   * -------------------------------------------------------
   * Store State
   * -------------------------------------------------------
   *
   * `visible`
   * - whether a toast should currently be rendered
   *
   * `message`
   * - the user-facing toast content
   *
   * `type`
   * - semantic toast variant used by the Toast component
   */
  const visible = ref(false)
  const message = ref('')
  const type = ref<ToastType>('info')

  /**
   * -------------------------------------------------------
   * showToast
   * -------------------------------------------------------
   *
   * Primary entry point for triggering toast feedback across
   * the application.
   *
   * Behavior:
   * - sets the toast message
   * - sets the toast type
   * - marks the toast as visible
   *
   * Notes:
   * - this store intentionally does not manage duration or
   *   dismissal timing
   * - auto-dismiss behavior belongs to the Toast component,
   *   which can call `hideToast()` via its dismiss event
   */
  function showToast(toastMessage: string, toastType: ToastType = 'info') {
    message.value = toastMessage
    type.value = toastType
    visible.value = true
  }

  /**
   * -------------------------------------------------------
   * hideToast
   * -------------------------------------------------------
   *
   * Hides the currently active toast.
   *
   * This is typically called when:
   * - the Toast component auto-dismisses after its duration
   * - the user manually dismisses the toast
   *
   * The message/type values are preserved intentionally.
   * Only visibility is reset here because the next toast
   * invocation will overwrite message/type as needed.
   */
  function hideToast() {
    visible.value = false
  }

  /**
   * -------------------------------------------------------
   * resetToast
   * -------------------------------------------------------
   *
   * Full reset helper for cases where the toast state should
   * be completely cleared rather than simply hidden.
   *
   * This is not required for normal toast usage, but it is
   * useful as an explicit utility for future edge cases,
   * testing, or route-level cleanup.
   */
  function resetToast() {
    visible.value = false
    message.value = ''
    type.value = 'info'
  }

  return {
    visible,
    message,
    type,
    showToast,
    hideToast,
    resetToast,
  }
})