<template>
  <!--
    =========================================================
    User Create Modal
    =========================================================

    Canonical create workflow modal for the Users dashboard.

    Responsibilities:
    - collect required user creation fields
    - validate local form input
    - submit creation request through the store/service layer
    - trigger dashboard refresh on success
    - reset local form state on close
  -->
  <AdminModal
    :visible="store.showCreateUserModal"
    title="Create User"
    size="5xl"
    @close="closeModal"
  >
    <form
      class="space-y-4 text-sm text-gray-800 dark:text-gray-100"
      @submit.prevent="handleCreate"
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
            placeholder="e.g. aaronsmith"
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
            placeholder="e.g. aaron@example.com"
            autocomplete="email"
          />
        </div>
      </div>

      <!--
        ---------------------------------------------------------
        Credential / Role Fields
        ---------------------------------------------------------
      -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs text-gray-500">Password</label>
          <input
            v-model="form.password"
            type="password"
            :disabled="store.isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
            placeholder="Enter a temporary password"
            autocomplete="new-password"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            MVP uses an admin-provided password during account creation.
          </p>
        </div>

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
          {{ store.isSubmitting ? 'Creating...' : 'Create User' }}
        </button>
      </div>
    </form>
  </AdminModal>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * User Create Modal
 * =========================================================
 *
 * Canonical create workflow modal for the admin Users dashboard.
 *
 * Notes:
 * - form state is fully local to the modal
 * - visibility is store-controlled
 * - successful creation triggers dashboard-wide refresh
 */

import { computed, reactive } from 'vue'
import AdminModal from '@/features/admin/shared/components/AdminModal.vue'
import type { UserRole } from '@/features/admin/types/UserTypes'
import { useUserDashboardStore } from '@/features/admin/user/stores/userStore'

const store = useUserDashboardStore()

/**
 * ---------------------------------------------------------
 * Local Form State
 * ---------------------------------------------------------
 *
 * Fresh local state used for each create workflow instance.
 */
const form = reactive({
  username: '',
  email: '',
  password: '',
  role: 'student' as UserRole,
})

/**
 * ---------------------------------------------------------
 * Validation
 * ---------------------------------------------------------
 *
 * Keeps MVP validation intentionally simple:
 * - username required
 * - email required
 * - password required
 * - role required
 */
const isFormValid = computed(() => {
  return (
    form.username.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.password.trim().length > 0 &&
    form.role.trim().length > 0
  )
})

/**
 * ---------------------------------------------------------
 * Reset / Close
 * ---------------------------------------------------------
 *
 * Resets local form state so each create workflow begins with
 * a clean slate.
 */
function resetForm() {
  form.username = ''
  form.email = ''
  form.password = ''
  form.role = 'student'
}

function closeModal() {
  if (store.isSubmitting) return

  store.closeCreateUserModal()
  resetForm()
}

/**
 * ---------------------------------------------------------
 * Submit
 * ---------------------------------------------------------
 *
 * Creates a new user and triggers the shared refresh signal on
 * success through the dashboard store.
 */
async function handleCreate() {
  if (!isFormValid.value) return

  try {
    store.isSubmitting = true
    store.submitError = null

    await store.createUser({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    })

    closeModal()
  } catch (error) {
    console.error(error)
  } finally {
    store.isSubmitting = false
  }
}
</script>