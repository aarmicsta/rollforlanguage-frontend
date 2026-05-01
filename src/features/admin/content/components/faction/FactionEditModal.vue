<template>
  <!--
    =========================================================
    Faction Edit Modal
    =========================================================

    Structure-only edit modal for canonical faction records.

    Current scope:
    - display selected faction data
    - validate modal/store wiring
    - close cleanly through Content store state

    Future scope:
    - editable scalar fields
    - alignment selector
    - save/update workflow
    - faction tag assignments
  -->
  <AdminModal
    :visible="store.showEditFactionModal"
    title="Edit Faction"
    size="3xl"
    @close="closeModal"
  >
    <div
      v-if="store.selectedFaction"
      class="space-y-4 text-sm text-gray-100"
    >
      <!-- Identity -->
      <div>
        <p class="text-xs text-gray-400">Display Name</p>
        <p class="font-medium">
          {{ store.selectedFaction.displayName }}
        </p>
        <p class="mt-1 text-xs text-gray-500">
          {{ store.selectedFaction.slug }}
        </p>
      </div>

      <!-- Details -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-400">Internal Name</p>
          <p>{{ store.selectedFaction.name }}</p>
        </div>

        <div>
          <p class="text-xs text-gray-400">Alignment</p>
          <p>{{ store.selectedFaction.alignment ?? '—' }}</p>
        </div>

        <div>
          <p class="text-xs text-gray-400">Active</p>
          <p>{{ store.selectedFaction.isActive ? 'Yes' : 'No' }}</p>
        </div>

        <div>
          <p class="text-xs text-gray-400">Sort Order</p>
          <p>{{ store.selectedFaction.sortOrder ?? '—' }}</p>
        </div>
      </div>

      <!-- Description -->
      <div>
        <p class="text-xs text-gray-400">Description</p>
        <p class="mt-1 leading-relaxed">
          {{ store.selectedFaction.description ?? '—' }}
        </p>
      </div>

      <!-- Modal Actions -->
      <div class="flex justify-end pt-4">
        <button
          type="button"
          class="rounded bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400 dark:bg-neutral-700 dark:text-gray-100 dark:hover:bg-neutral-600"
          @click="closeModal"
        >
          Close
        </button>
      </div>
    </div>

    <div v-else class="text-sm text-gray-400">
      No faction selected.
    </div>
  </AdminModal>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Imports
 * =========================================================
 */
import { useContentStore } from '@/features/admin/content/stores/contentStore'
import AdminModal from '@/features/admin/shared/components/AdminModal.vue'

/**
 * =========================================================
 * Store
 * =========================================================
 *
 * Modal visibility and selected faction context are owned by
 * the shared Content store.
 */
const store = useContentStore()

/**
 * ---------------------------------------------------------
 * Modal Controls
 * ---------------------------------------------------------
 */
function closeModal() {
  store.closeEditFactionModal()
}
</script>