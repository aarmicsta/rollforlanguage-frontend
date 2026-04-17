<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <Toast
      v-if="showToast"
      message="✅ User created successfully!"
      type="success"
      @dismiss="dismissToast"
    />

    <div>
      <label for="email" class="block text-sm font-medium mb-1">Email</label>
      <input v-model="email" id="email" type="email" class="input" required />
    </div>

    <div>
      <label for="username" class="block text-sm font-medium mb-1">Username</label>
      <input v-model="username" id="username" type="text" class="input" required />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium mb-1">Password</label>
      <input v-model="password" id="password" type="password" class="input" required />
    </div>

    <div>
      <label for="role" class="block text-sm font-medium mb-1">Role</label>
      <select v-model="role" id="role" class="input" required>
        <option value="" disabled>Select role</option>
        <option v-for="r in allowedRoles" :key="r.value" :value="r.value">{{ r.label }}</option>
      </select>
    </div>

    <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>

    <button type="submit" class="btn-primary w-full">Create User</button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Toast from '@/components/molecules/Toast.vue'
import { useUserDashboardStore } from '@/features/admin/stores/userDashboardStore'
import { useAuth } from '@/features/auth/hooks/useAuth'

const { user } = useAuth()
const userDashboardStore = useUserDashboardStore()

const emit = defineEmits(['success'])

const email = ref('')
const username = ref('')
const password = ref('')
const role = ref('')
const error = ref('')
const showToast = ref(false)

// Define allowed roles per logged-in role
const roleMap: Record<string, { label: string; value: string }[]> = {
  superadmin: [
    { label: 'Super Admin', value: 'superadmin' },
    { label: 'Admin', value: 'admin' },
    { label: 'Teacher', value: 'teacher' },
    { label: 'Student', value: 'student' },
  ],
  admin: [
    { label: 'Teacher', value: 'teacher' },
    { label: 'Student', value: 'student' },
  ],
  teacher: [
    { label: 'Student', value: 'student' },
  ],
}

const userRole = user.value?.roles?.[0] === 'superadmin'
  ? 'superadmin'
  : user.value?.roles?.[0] === 'admin'
    ? 'admin'
    : 'teacher'

const allowedRoles = computed(() => roleMap[userRole])

async function handleSubmit() {
  error.value = ''
  try {
    await userDashboardStore.createUser({
      email: email.value,
      username: username.value,
      password: password.value,
      role: role.value,
    })
    showToast.value = true
    emit('success') // optional if parent wants to close modal
  } catch (err) {
    error.value = userDashboardStore.userCreationError || 'An unexpected error occurred.'
  }
}

function dismissToast() {
  showToast.value = false
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  background-color: white;
  color: black;
}

.input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 1px #2563eb;
}

.btn-primary {
  background: #2563eb;
  color: white;
  padding: 0.5rem;
  border-radius: 0.375rem;
}
</style>
