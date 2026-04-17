<template>
  <!--
    =========================================================
    User Edit Modal
    =========================================================

    Canonical edit workflow modal for the Users dashboard.

    Responsibilities:
    - clone the store-selected user into local editable state
    - validate editable fields
    - submit updates through the service layer
    - trigger dashboard refresh on success
    - never mutate store-selected entity directly
  -->
  <AdminModal
    :visible="store.showEditUserModal"
    title="Edit User"
    size="5xl"
    @close="closeModal"
  >
    <form
      v-if="selectedUser"
      class="space-y-4 text-sm text-gray-800 dark:text-gray-100"
      @submit.prevent="handleUpdate"
    >
      <!--
        ---------------------------------------------------------
        Identity Fields
        ---------------------------------------------------------
      -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs text-gray-500">Username</label>
          <input
            v-model="form.username"
            type="text"
            :disabled="store.isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
            autocomplete="username"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Email</label>
          <input
            v-model="form.email"
            type="email"
            :disabled="store.isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
            autocomplete="email"
          />
        </div>
      </div>

      <!--
        ---------------------------------------------------------
        Role Field
        ---------------------------------------------------------
      -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Role</label>
        <select
          v-model="form.role"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
      </div>

      <!--
        ---------------------------------------------------------
        Error Feedback
        ---------------------------------------------------------
      -->
      <p
        v-if="store.submitError"
        class="text-sm text-red-600 dark:text-red-400"
      >
        {{ store.submitError }}
      </p>

      <!--
        ---------------------------------------------------------
        Action Buttons
        ---------------------------------------------------------
      -->
      <div class="flex justify-end gap-2 pt-4">
        <button
          type="button"
          @click="closeModal"
          :disabled="store.isSubmitting"
          class="rounded bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400 dark:bg-neutral-700 dark:text-gray-100 dark:hover:bg-neutral-600"
        >
          Cancel
        </button>

        <button
          type="submit"
          :disabled="store.isSubmitting || !isFormValid"
          class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ store.isSubmitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </AdminModal>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * User Edit Modal
 * =========================================================
 *
 * Canonical edit workflow modal for the admin Users dashboard.
 *
 * Notes:
 * - store owns selected user and modal visibility
 * - this modal owns local editable form state
 * - local state is cloned from the selected user to prevent
 *   direct mutation of store-owned selection state
 */

import { computed, reactive, watch } from 'vue'
import AdminModal from '@/features/admin/shared/components/AdminModal.vue'
import { updateUser } from '@/features/admin/user/services/userService'
import { useUserDashboardStore } from '@/features/admin/user/stores/userStore'
import type { UserRole } from '@/features/admin/user/types/userTypes'

const store = useUserDashboardStore()

/**
 * ---------------------------------------------------------
 * Selected User
 * ---------------------------------------------------------
 *
 * Store-owned source of truth for the current edit target.
 */
const selectedUser = computed(() => store.selectedUser)

/**
 * ---------------------------------------------------------
 * Local Form State
 * ---------------------------------------------------------
 *
 * Editable clone of the selected user.
 */
const form = reactive({
  username: '',
  email: '',
  role: 'student' as UserRole,
})

/**
 * ---------------------------------------------------------
 * Sync from Store Selection
 * ---------------------------------------------------------
 *
 * Copies the selected user into local editable state whenever
 * the edit workflow target changes.
 */
watch(
  selectedUser,
  (user) => {
    if (!user) return

    form.username = user.username ?? ''
    form.email = user.email ?? ''
    form.role = user.role ?? 'student'
  },
  { immediate: true }
)

/**
 * ---------------------------------------------------------
 * Validation
 * ---------------------------------------------------------
 */
const isFormValid = computed(() => {
  return (
    form.username.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.role.trim().length > 0
  )
})

/**
 * ---------------------------------------------------------
 * Reset / Close
 * ---------------------------------------------------------
 */
function resetForm() {
  form.username = ''
  form.email = ''
  form.role = 'student'
}

function closeModal() {
  if (store.isSubmitting) return

  store.closeEditUserModal()
  resetForm()
}

/**
 * ---------------------------------------------------------
 * Submit
 * ---------------------------------------------------------
 *
 * Updates the selected user and triggers shared dashboard
 * refresh on success.
 */
async function handleUpdate() {
  if (!selectedUser.value || !isFormValid.value) return

  try {
    store.isSubmitting = true
    store.submitError = null

    await updateUser(selectedUser.value.id, {
      username: form.username.trim(),
      email: form.email.trim(),
      role: form.role,
    })

    store.refreshUserList()
    closeModal()
  } catch (error) {
    console.error(error)
    store.submitError = 'Failed to update user.'
  } finally {
    store.isSubmitting = false
  }
}
</script>