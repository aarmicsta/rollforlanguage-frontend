<template>
  <AdminModal
    :visible="store.showCreatePassiveModal"
    title="Create Playable Passive"
    size="5xl"
    @close="closeModal"
  >
    <form
      class="space-y-4 text-sm text-gray-800 dark:text-gray-100"
      @submit.prevent="handleCreate"
    >
      <!-- Display Name -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Display Name</label>
        <input
          v-model="form.displayName"
          type="text"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2"
          placeholder="e.g. Night Vision"
        />
      </div>

      <!-- Canonical Identity -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs text-gray-500">Internal Name</label>
          <input
            v-model="form.name"
            type="text"
            :disabled="store.isSubmitting"
            class="w-full rounded border px-3 py-2"
            @input="nameManuallyEdited = true"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Slug</label>
          <input
            v-model="form.slug"
            type="text"
            :disabled="store.isSubmitting"
            class="w-full rounded border px-3 py-2"
            @input="slugManuallyEdited = true"
          />
        </div>
      </div>

      <!-- Description -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Description</label>
        <textarea v-model="form.description" rows="3" class="w-full rounded border px-3 py-2" />
      </div>

      <!-- Effect -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Effect Text</label>
        <textarea v-model="form.effectText" rows="3" class="w-full rounded border px-3 py-2" />
      </div>

      <div>
        <label class="mb-1 block text-xs text-gray-500">Effect Type</label>
        <input v-model="form.effectType" type="text" class="w-full rounded border px-3 py-2" />
      </div>

      <!-- Active -->
      <div class="flex items-center gap-2">
        <input type="checkbox" v-model="form.isActive" />
        <span>Active</span>
      </div>

      <!-- Error -->
      <p v-if="store.submitError" class="text-red-500">
        {{ store.submitError }}
      </p>

      <!-- Actions -->
      <div class="flex justify-end gap-2 pt-4">
        <button type="button" @click="closeModal">Cancel</button>
        <button type="submit" :disabled="!isFormValid || store.isSubmitting">
          {{ store.isSubmitting ? 'Creating...' : 'Create Passive' }}
        </button>
      </div>
    </form>
  </AdminModal>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue'
import AdminModal from '@/features/admin/components/shared/AdminModal.vue'
import { createPlayablePassive } from '@/features/admin/services/playablePassiveService'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'

const store = useAdminPlayableStore()

const form = reactive({
  displayName: '',
  name: '',
  slug: '',
  description: '',
  effectText: '',
  effectType: '',
  isActive: true,
})

const nameManuallyEdited = ref(false)
const slugManuallyEdited = ref(false)

/**
 * ---------------------------------------------------------
 * Normalization
 * ---------------------------------------------------------
 */

function normalizeToName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_')
    .replace(/[^\w_]/g, '')
}

function normalizeToSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')   // 🔥 critical fix
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
}

/**
 * Auto-sync from displayName
 */
watch(
  () => form.displayName,
  (val) => {
    if (!nameManuallyEdited.value) {
      form.name = normalizeToName(val)
    }
    if (!slugManuallyEdited.value) {
      form.slug = normalizeToSlug(val)
    }
  }
)

const isFormValid = computed(() => {
  return (
    form.displayName.trim().length > 0 &&
    form.name.trim().length > 0 &&
    form.slug.trim().length > 0
  )
})

function resetForm() {
  form.displayName = ''
  form.name = ''
  form.slug = ''
  form.description = ''
  form.effectText = ''
  form.effectType = ''
  form.isActive = true
  nameManuallyEdited.value = false
  slugManuallyEdited.value = false
}

function closeModal() {
  if (store.isSubmitting) return
  resetForm()
  store.closeCreatePassiveModal()
}

async function handleCreate() {
  if (!isFormValid.value) return

  store.isSubmitting = true
  store.submitError = null

  try {
    await createPlayablePassive({
      displayName: form.displayName,
      name: form.name,
      slug: form.slug,
      description: form.description || null,
      effectText: form.effectText || null,
      effectType: form.effectType || null,
      isActive: form.isActive,
    })

    store.refreshPlayableList()
    closeModal()
  } catch (err) {
    console.error(err)
    store.submitError = 'Failed to create passive'
  } finally {
    store.isSubmitting = false
  }
}
</script>