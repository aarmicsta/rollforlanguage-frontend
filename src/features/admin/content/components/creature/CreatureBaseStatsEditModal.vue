<template>
  <!--
    =========================================================
    Creature Base Stats Edit Modal
    =========================================================

    Dedicated edit surface for a creature's base stat values.

    Responsibilities:
    - edit core scalar creature fields
    - edit creature classification fields
    - manage tag assignment for the creature
    - persist creature edits through Content-domain services

    Notes:
    - visibility is controlled by explicit Content store modal state
    - selectedCreature provides the edit target, but does not control visibility
    - local editable copy is used to prevent direct mutation
    - relational and reference data are loaded by the modal and passed into
      presentational selector components
  -->
  <AdminModal
    :visible="store.showCreatureBaseStatsModal"
    title="Edit Creature Base Stats"
    size="5xl"
    @close="closeModal"
  >
    <div class="mb-4">
      <button
        type="button"
        class="text-sm text-blue-600 hover:underline"
        @click="handleBack"
      >
        ← Back to Creature Stats Table
      </button>
    </div>

    <div v-if="selectedCreature" class="space-y-4 text-sm text-gray-800 dark:text-gray-100">
      <!-- Creature Context -->
      <div class="rounded border px-3 py-3 dark:border-neutral-700">
        <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
          {{ selectedCreature.displayName }}
        </h3>

        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ selectedCreature.creatureType }} · {{ selectedCreature.sizeCategory }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-sm text-gray-500">
        Loading base stats...
      </div>

      <!-- Error State -->
      <div v-else-if="loadError" class="text-sm text-red-500">
        {{ loadError }}
      </div>

      <!-- Base Stats Form -->
      <form
        v-else
        class="space-y-4"
        @submit.prevent="handleSave"
      >
        <div class="rounded border dark:border-neutral-700">
          <div class="border-b px-3 py-2 dark:border-neutral-700">
            <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Base Stats
            </h4>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              These values define the creature's foundational stat layer.
            </p>
          </div>

          <div class="max-h-96 overflow-y-auto">
            <div
              v-for="stat in editableStats"
              :key="stat.statId"
              class="grid grid-cols-1 gap-3 border-b px-3 py-3 last:border-b-0 dark:border-neutral-700 md:grid-cols-[1fr_10rem]"
            >
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-100">
                  {{ stat.statDisplayName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ stat.statSlug }}
                </p>
              </div>

              <div>
                <label class="mb-1 block text-xs text-gray-500">
                  Base Value
                </label>
                <input
                  v-model.number="stat.baseValue"
                  type="number"
                  step="1"
                  :disabled="isSubmitting"
                  class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
                  placeholder="—"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Submission Error -->
        <p
          v-if="submitError"
          class="text-sm text-red-600 dark:text-red-400"
        >
          {{ submitError }}
        </p>

        <!-- Actions -->
        <div class="flex justify-end gap-2 pt-4">
          <button
            type="button"
            @click="closeModal"
            :disabled="isSubmitting"
            class="rounded bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700 dark:text-gray-100 dark:hover:bg-neutral-600"
          >
            Cancel
          </button>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Base Stats' }}
          </button>
        </div>
      </form>
    </div>

    <div v-else class="text-sm text-gray-500">
      No creature selected.
    </div>
  </AdminModal>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Imports
 * =========================================================
 */
import { computed, ref, watch } from 'vue'
import { useToastStore } from '@/stores/ui/useToastStore'
import {
  getCreatureBaseStats,
  updateCreatureBaseStats,
  type CreatureBaseStatEditRow,
} from '@/features/admin/content/services/creatureService'
import { useContentStore } from '@/features/admin/content/stores/contentStore'
import AdminModal from '@/features/admin/shared/components/AdminModal.vue'

/**
 * =========================================================
 * Store / Global Feedback
 * =========================================================
 */
const store = useContentStore()
const toastStore = useToastStore()

/**
 * ---------------------------------------------------------
 * Selected Creature Context
 * ---------------------------------------------------------
 */
const selectedCreature = computed(() => store.selectedCreature)

/**
 * ---------------------------------------------------------
 * Local Editable State
 * ---------------------------------------------------------
 */
const editableStats = ref<CreatureBaseStatEditRow[]>([])

/**
 * ---------------------------------------------------------
 * Request / Submission State
 * ---------------------------------------------------------
 *
 * Loading state remains local because it only applies to this
 * modal's base-stat retrieval lifecycle.
 *
 * Submission state is delegated to the Content store so submit
 * behavior remains consistent across Content-domain modals.
 */
const loading = ref(false)
const loadError = ref('')

const isSubmitting = computed(() => store.isSubmitting)
const submitError = computed(() => store.submitError)

/**
 * ---------------------------------------------------------
 * Watch: Modal Visibility / Selected Creature
 * ---------------------------------------------------------
 *
 * Loads base stat values when the modal opens for a selected
 * creature.
 */
watch(
  () => [store.showCreatureBaseStatsModal, store.selectedCreature?.id],
  async ([visible, creatureId]) => {
    if (!visible || !creatureId) {
      editableStats.value = []
      loadError.value = ''
      store.clearSubmitError()
      return
    }

    await loadBaseStats(creatureId as string)
  },
  { immediate: true }
)

/**
 * ---------------------------------------------------------
 * Data Loading
 * ---------------------------------------------------------
 */
async function loadBaseStats(creatureId: string) {
  loading.value = true
  loadError.value = ''
  store.clearSubmitError()

  try {
    const stats = await getCreatureBaseStats(creatureId)
    editableStats.value = stats.map((stat) => ({ ...stat }))
  } catch (error) {
    console.error('Failed to load creature base stats:', error)
    editableStats.value = []
    loadError.value = 'Failed to load creature base stats.'
  } finally {
    loading.value = false
  }
}

/**
 * ---------------------------------------------------------
 * Modal Controls
 * ---------------------------------------------------------
 */
function closeModal() {
  store.closeCreatureBaseStatsModal()
  store.clearSelectedCreature()
  store.clearSubmitError()

  editableStats.value = []
  loadError.value = ''
}

function handleBack() {
  closeModal()
}

/**
 * ---------------------------------------------------------
 * Save Handler
 * ---------------------------------------------------------
 *
 * Save behavior:
 * - sends the full editable stat set to the backend
 * - null means "no stored base value"
 * - zero is preserved as an intentional numeric value
 */
async function handleSave() {
  if (!selectedCreature.value) return

  try {
    store.setSubmitting(true)
    store.clearSubmitError()

    await updateCreatureBaseStats(
      selectedCreature.value.id,
      editableStats.value.map((stat) => ({
        statId: stat.statId,
        baseValue:
          typeof stat.baseValue === 'number' && !Number.isNaN(stat.baseValue)
            ? stat.baseValue
            : null,
      }))
    )

    store.refreshContentList()
    closeModal()
    toastStore.showToast('Creature base stats updated successfully.', 'success')
  } catch (error) {
    console.error('Failed to save creature base stats:', error)
    store.setSubmitError('Failed to save creature base stats.')
  } finally {
    store.setSubmitting(false)
  }
}
</script>