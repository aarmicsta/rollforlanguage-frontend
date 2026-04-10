<template>
  <!--
    =========================================================
    Playable Stat Modifier Edit Modal
    =========================================================

    Primary admin edit surface for the unified Stat Modifier
    system.

    Responsibilities:
    - edit global stat baseline values
    - edit species-specific stat modifiers
    - edit class-specific stat modifiers
    - hydrate local form state from the selected modifier row
    - adapt required fields based on the active modifier context
  -->
  <AdminModal
    :visible="store.showEditStatModifierModal"
    title="Edit Stat Modifier"
    size="5xl"
    @close="closeModal"
  >
    <form
      class="space-y-4 text-sm text-gray-800 dark:text-gray-100"
      @submit.prevent="handleUpdate"
    >
      <!--
        ---------------------------------------------------------
        Context Mode
        ---------------------------------------------------------

        Unified mode selector for the Stat Modifier system.

        Contexts:
        - baseline: global stat baseline values
        - species: species-specific stat modifiers
        - class: class-specific stat modifiers
      -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Context</label>
        <select
          v-model="store.statModifierMode"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        >
          <option value="baseline">Baseline</option>
          <option value="species">Species</option>
          <option value="class">Class</option>
        </select>
      </div>

      <!--
        ---------------------------------------------------------
        Target Selection
        ---------------------------------------------------------

        Target is required for:
        - species modifiers
        - class modifiers

        Target is not used for:
        - baseline values
      -->
      <div v-if="store.statModifierMode === 'species'">
        <label class="mb-1 block text-xs text-gray-500">Playable Species</label>
        <select
          v-model="form.targetId"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        >
          <option value="">Select a species</option>
          <option
            v-for="item in speciesOptions"
            :key="item.id"
            :value="item.id"
          >
            {{ item.displayName }}
          </option>
        </select>
      </div>

      <div v-if="store.statModifierMode === 'class'">
        <label class="mb-1 block text-xs text-gray-500">Playable Class</label>
        <select
          v-model="form.targetId"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        >
          <option value="">Select a class</option>
          <option
            v-for="item in classOptions"
            :key="item.id"
            :value="item.id"
          >
            {{ item.displayName }}
          </option>
        </select>
      </div>

      <!--
        ---------------------------------------------------------
        Stat Selection
        ---------------------------------------------------------

        Canonical stat definition to which the baseline/modifier
        value applies.
      -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Playable Stat</label>
        <select
          v-model="form.statId"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        >
          <option value="">Select a stat</option>
          <option
            v-for="item in statOptions"
            :key="item.id"
            :value="item.id"
          >
            {{ item.displayName }}
          </option>
        </select>
      </div>

      <!--
        ---------------------------------------------------------
        Value Input
        ---------------------------------------------------------

        Numeric value used as:
        - the baseline value in baseline context
        - the modifier value in species/class contexts
      -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">
          {{ valueLabel }}
        </label>
        <input
          v-model.number="form.value"
          type="number"
          step="1"
          :disabled="store.isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          :placeholder="valuePlaceholder"
        />
      </div>

      <!--
        ---------------------------------------------------------
        Context Guidance
        ---------------------------------------------------------
      -->
      <div class="rounded border border-dashed px-3 py-2 text-xs text-gray-600 dark:border-neutral-700 dark:text-gray-300">
        <p v-if="store.statModifierMode === 'baseline'">
          Baseline mode edits the global starting value for the selected stat.
        </p>
        <p v-else-if="store.statModifierMode === 'species'">
          Species mode edits the stat modifier for the selected playable species.
        </p>
        <p v-else>
          Class mode edits the stat modifier for the selected playable class.
        </p>
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
          {{ store.isSubmitting ? 'Saving...' : updateButtonLabel }}
        </button>
      </div>
    </form>
  </AdminModal>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Playable Stat Modifier Edit Modal
 * =========================================================
 *
 * This modal edits an existing record in the unified Stat
 * Modifier system.
 *
 * Current scope:
 * - baseline value editing
 * - species stat modifier editing
 * - class stat modifier editing
 *
 * Notes:
 * - local form state is hydrated from `selectedStatModifierRow`
 * - canonical stat definitions remain a separate system
 * - the required target field depends on the active context
 * - this first implementation focuses on frontend structure;
 *   service-layer submission can be wired after the UI contract
 *   is fully stabilized
 */

import { computed, reactive, watch } from 'vue'
import { useToastStore } from '@/stores/ui/useToastStore'
import AdminModal from '@/features/admin/components/shared/AdminModal.vue'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'

/**
 * ---------------------------------------------------------
 * Store / Global Feedback
 * ---------------------------------------------------------
 */
const store = useAdminPlayableStore()
const toastStore = useToastStore()

/**
 * ---------------------------------------------------------
 * Local Form State
 * ---------------------------------------------------------
 *
 * `targetId`
 * - null/empty for baseline mode
 * - species id for species mode
 * - class id for class mode
 */
const form = reactive({
  targetId: '',
  statId: '',
  value: 0 as number | null,
})

/**
 * ---------------------------------------------------------
 * Temporary Option Sources
 * ---------------------------------------------------------
 *
 * Placeholder option arrays used to establish the UI contract.
 *
 * These should later be replaced with:
 * - service-backed option loading
 * - or shared store-provided option sources
 */
const speciesOptions = [
  { id: 'species_dragonborn', displayName: 'Dragonborn' },
  { id: 'species_elf', displayName: 'Elf' },
]

const classOptions = [
  { id: 'class_barbarian', displayName: 'Barbarian' },
  { id: 'class_wizard', displayName: 'Wizard' },
]

const statOptions = [
  { id: 'ref_stat_hp', displayName: 'HP' },
  { id: 'ref_stat_attack', displayName: 'Attack' },
  { id: 'ref_stat_defense', displayName: 'Defense' },
]

/**
 * ---------------------------------------------------------
 * Row Hydration
 * ---------------------------------------------------------
 *
 * Synchronizes local form state from the selected modifier row
 * whenever the edit modal target changes.
 *
 * Notes:
 * - `targetId` is not available on baseline rows and remains empty
 * - this first-pass hydration uses the flattened UI row shape
 * - full backend-backed edit hydration can become more precise once
 *   the service layer is wired
 */
watch(
  () => store.selectedStatModifierRow,
  (row) => {
    if (!row) {
      resetForm()
      return
    }

    store.statModifierMode = row.context
    form.targetId = row.targetId ?? ''
    form.statId = row.statId
    form.value = row.value
  },
  { immediate: true }
)

/**
 * ---------------------------------------------------------
 * Mode Synchronization
 * ---------------------------------------------------------
 *
 * Reset target selection whenever the modifier context changes
 * away from the previous target-bearing context so stale
 * species/class selections do not bleed across modes.
 */
watch(
  () => store.statModifierMode,
  (mode) => {
    if (mode === 'baseline') {
      form.targetId = ''
    }
  }
)

/**
 * ---------------------------------------------------------
 * Derived Labels
 * ---------------------------------------------------------
 */
const valueLabel = computed(() => {
  return store.statModifierMode === 'baseline'
    ? 'Baseline Value'
    : 'Modifier Value'
})

const valuePlaceholder = computed(() => {
  return store.statModifierMode === 'baseline'
    ? 'e.g. 10'
    : 'e.g. 1'
})

const updateButtonLabel = computed(() => {
  switch (store.statModifierMode) {
    case 'baseline':
      return 'Save Baseline'
    case 'species':
      return 'Save Species Modifier'
    case 'class':
      return 'Save Class Modifier'
  }
})

/**
 * ---------------------------------------------------------
 * Validation
 * ---------------------------------------------------------
 */
const isFormValid = computed(() => {
  const hasStat = form.statId.trim().length > 0
  const hasValue = typeof form.value === 'number' && !Number.isNaN(form.value)

  if (store.statModifierMode === 'baseline') {
    return hasStat && hasValue
  }

  return form.targetId.trim().length > 0 && hasStat && hasValue
})

/**
 * ---------------------------------------------------------
 * Reset / Close
 * ---------------------------------------------------------
 */
function resetForm() {
  form.targetId = ''
  form.statId = ''
  form.value = 0
}

function closeModal() {
  store.closeEditStatModifierModal()
  resetForm()
}

/**
 * ---------------------------------------------------------
 * Submit
 * ---------------------------------------------------------
 *
 * Temporary stub:
 * - confirms the modal/UI flow works
 * - can be replaced with service-backed submission next
 */
async function handleUpdate() {
  if (!isFormValid.value) return

  try {
    store.isSubmitting = true
    store.submitError = null

    /**
     * Replace this section next with actual service calls based on:
     * - baseline
     * - species
     * - class
     *
     * Also note:
     * - if backend update semantics require immutable context/target/stat
     *   identity, the eventual implementation may choose to restrict
     *   editable fields here
     */
    console.log('Update stat modifier payload:', {
      originalRow: store.selectedStatModifierRow,
      updatedContext: store.statModifierMode,
      targetId: store.statModifierMode === 'baseline' ? null : form.targetId,
      statId: form.statId,
      value: form.value,
    })

    store.refreshPlayableList()
    closeModal()
    toastStore.showToast('Stat modifier edit flow structure created successfully.', 'success')
  } catch (error) {
    console.error(error)
    store.submitError = 'Failed to update stat modifier.'
  } finally {
    store.isSubmitting = false
  }
}
</script>