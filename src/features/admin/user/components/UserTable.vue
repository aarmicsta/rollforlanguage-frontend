<template>
  <!--
    =========================================================
    User Table
    =========================================================

    First-class management table for the Users dashboard.

    Responsibilities:
    - fetch and render paginated user data
    - support search and pagination
    - emit edit intent via row click
    - respond to shared dashboard refresh signals

    Notes:
    - does not own modal rendering
    - does not perform mutations directly
  -->
  <div class="space-y-4">
    <!--
      ---------------------------------------------------------
      Search + Page Size Controls
      ---------------------------------------------------------
    -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <input
        v-model="search"
        type="text"
        placeholder="Search users..."
        class="w-full max-w-xs rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
      />

      <select
        v-model="limit"
        class="w-28 rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
      >
        <option v-for="opt in [10, 25, 50, 100]" :key="opt" :value="opt">
          {{ opt }} / page
        </option>
      </select>
    </div>

    <!--
      ---------------------------------------------------------
      Table
      ---------------------------------------------------------
    -->
    <div class="overflow-x-auto">
      <table class="min-w-full table-auto border-collapse text-sm">
        <thead class="bg-gray-100 text-left dark:bg-neutral-800">
          <tr>
            <th class="px-4 py-2 text-gray-700 dark:text-gray-200">Username</th>
            <th class="px-4 py-2 text-gray-700 dark:text-gray-200">Email</th>
            <th class="px-4 py-2 text-gray-700 dark:text-gray-200">Role</th>
            <th class="px-4 py-2 text-gray-700 dark:text-gray-200">Created</th>
          </tr>
        </thead>

        <tbody v-if="!loading && users.length">
          <tr
            v-for="user in users"
            :key="user.id"
            class="cursor-pointer border-b bg-white text-gray-800 transition hover:bg-gray-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800"
            @click="handleRowClick(user)"
          >
            <td class="px-4 py-2">{{ user.username }}</td>
            <td class="px-4 py-2">{{ user.email }}</td>
            <td class="px-4 py-2">
              <span
                :class="[
                  'inline-block rounded px-2 py-1 text-xs font-medium',
                  roleColors[user.role] || 'bg-gray-300 text-gray-800',
                ]"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-4 py-2">{{ formatDate(user.createdAt) }}</td>
          </tr>
        </tbody>

        <tbody v-else-if="loading">
          <tr>
            <td colspan="4" class="p-4 text-center text-gray-500">
              Loading users…
            </td>
          </tr>
        </tbody>

        <tbody v-else>
          <tr>
            <td colspan="4" class="p-4 text-center text-gray-500">
              No users found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!--
      ---------------------------------------------------------
      Error State
      ---------------------------------------------------------
    -->
    <p
      v-if="error"
      class="text-sm text-red-600 dark:text-red-400"
    >
      {{ error }}
    </p>

    <!--
      ---------------------------------------------------------
      Pagination
      ---------------------------------------------------------
    -->
    <div
      class="flex items-center justify-between pt-2 text-sm text-gray-600 dark:text-gray-300"
    >
      <div>
        Page {{ page }} of {{ pagination.totalPages }} •
        {{ pagination.total }} total users
      </div>

      <div class="flex gap-2">
        <button
          class="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300 disabled:opacity-50 dark:bg-neutral-700 dark:hover:bg-neutral-600"
          :disabled="page === 1 || loading"
          @click="page--"
        >
          ⬅ Prev
        </button>

        <button
          class="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300 disabled:opacity-50 dark:bg-neutral-700 dark:hover:bg-neutral-600"
          :disabled="page === pagination.totalPages || loading"
          @click="page++"
        >
          Next ➡
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * User Table
 * =========================================================
 *
 * First-class browse/select table for the Users dashboard.
 *
 * Architectural role:
 * - renders user data
 * - emits edit intent via store
 * - responds to refresh signals
 */

import { ref, watch } from 'vue'
import { userService } from '@/features/admin/services/userService'
import { useUserDashboardStore } from '@/features/admin/stores/userDashboardStore'
import type {
  UserBrowseItem,
  PaginatedUserResponse,
} from '@/features/admin/types/UserTypes'

const store = useUserDashboardStore()

const users = ref<UserBrowseItem[]>([])
const search = ref('')
const page = ref(1)
const limit = ref(25)

const loading = ref(false)
const error = ref<string | null>(null)

const pagination = ref<PaginatedUserResponse['pagination']>({
  total: 0,
  page: 1,
  limit: 25,
  totalPages: 1,
})

/**
 * ---------------------------------------------------------
 * Fetch Users
 * ---------------------------------------------------------
 */
async function fetchUsers() {
  loading.value = true
  error.value = null

  try {
    const response = await userService.getUsers({
      search: search.value,
      page: page.value,
      limit: limit.value,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    })

    users.value = response.data
    pagination.value = response.pagination
  } catch (err) {
    error.value = 'Failed to load users.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

/**
 * ---------------------------------------------------------
 * Row Click → Edit Workflow
 * ---------------------------------------------------------
 */
function handleRowClick(user: UserBrowseItem) {
  store.openEditUserModal(user)
}

/**
 * ---------------------------------------------------------
 * Initial Load
 * ---------------------------------------------------------
 */
fetchUsers()

/**
 * ---------------------------------------------------------
 * Search (debounced)
 * ---------------------------------------------------------
 */
let timeout: ReturnType<typeof setTimeout>

watch(search, () => {
  clearTimeout(timeout)

  timeout = setTimeout(() => {
    page.value = 1
    fetchUsers()
  }, 300)
})

/**
 * ---------------------------------------------------------
 * Pagination
 * ---------------------------------------------------------
 */
watch([page, limit], () => {
  fetchUsers()
})

/**
 * ---------------------------------------------------------
 * Dashboard Refresh Trigger
 * ---------------------------------------------------------
 */
watch(
  () => store.lastUserListRefresh,
  () => {
    fetchUsers()
  }
)

/**
 * ---------------------------------------------------------
 * Utilities
 * ---------------------------------------------------------
 */
function formatDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const roleColors: Record<string, string> = {
  superadmin: 'bg-purple-100 text-purple-800',
  admin: 'bg-blue-100 text-blue-800',
  teacher: 'bg-green-100 text-green-800',
  student: 'bg-yellow-100 text-yellow-800',
}
</script>