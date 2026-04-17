<template>
  <!--
    =========================================================
    Playable Stat Modifier Create Modal
    =========================================================

    Primary admin creation surface for the unified Stat Modifier
    system.

    Responsibilities:
    - create global stat baseline values
    - create species-specific stat modifiers
    - create class-specific stat modifiers
    - adapt required fields based on the active modifier context
  -->
  <AdminModal
    :visible="store.showCreateStatModifierModal"
    title="Create Stat Modifier"
    size="5xl"
    @close="closeModal"
  >
    <form
      class="space-y-4 text-sm text-gray-800 dark:text-gray-100"
      @submit.prevent="handleCreate"
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
          Baseline mode sets the global starting value for the selected stat.
        </p>
        <p v-else-if="store.statModifierMode === 'species'">
          Species mode applies a stat modifier to the selected playable species.
        </p>
        <p v-else>
          Class mode applies a stat modifier to the selected playable class.
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
          {{ store.isSubmitting ? 'Creating...' : createButtonLabel }}
        </button>
      </div>
    </form>
  </AdminModal>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Playable Stat Modifier Create Modal
 * =========================================================
 *
 * This modal creates a new record in the unified Stat Modifier
 * system.
 *
 * Current scope:
 * - baseline value creation
 * - species stat modifier creation
 * - class stat modifier creation
 *
 * Notes:
 * - canonical stat definitions remain a separate system
 * - the required target field depends on the active context
 * - this first implementation focuses on frontend structure;
 *   service-layer submission can be wired after the UI contract
 *   is fully stabilized
 */
import { onMounted, ref } from 'vue'
import { computed, reactive, watch } from 'vue'
import { useToastStore } from '@/stores/ui/useToastStore'
import AdminModal from '@/features/admin/components/shared/AdminModal.vue'
import { getPlayableClasses } from '@/features/admin/services/playableClassService'
import { getPlayableSpecies } from '@/features/admin/services/playableSpeciesService'
import {
  createPlayableStatBaseline,
  createPlayableSpeciesStatModifier,
  createPlayableClassStatModifier,
} from '@/features/admin/services/playableStatModifierService'
import { getPlayableStats } from '@/features/admin/services/playableStatService'
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
 * Option Sources
 * ---------------------------------------------------------
 *
 * Option arrays used to establish the UI contract.
 *
 */
const speciesOptions = ref<any[]>([])
const classOptions = ref<any[]>([])
const statOptions = ref<any[]>([])

/**
 * ---------------------------------------------------------
 * Fetch
 * ---------------------------------------------------------
 */
async function fetchOptions() {
  const [stats, species, classes] = await Promise.all([
    getPlayableStats(),
    getPlayableSpecies(),
    getPlayableClasses(),
  ])

  statOptions.value = stats
  speciesOptions.value = species
  classOptions.value = classes
}

/**
 * ---------------------------------------------------------
 * Lifecycle
 * ---------------------------------------------------------
 */
onMounted(fetchOptions)

/**
 * ---------------------------------------------------------
 * Mode Synchronization
 * ---------------------------------------------------------
 *
 * Reset target selection whenever the modifier context changes
 * so stale species/class selections do not bleed across modes.
 */
watch(
  () => store.statModifierMode,
  () => {
    form.targetId = ''
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

const createButtonLabel = computed(() => {
  switch (store.statModifierMode) {
    case 'baseline':
      return 'Create Baseline'
    case 'species':
      return 'Create Species Modifier'
    case 'class':
      return 'Create Class Modifier'
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
  store.closeCreateStatModifierModal()
  resetForm()
}

/**
 * ---------------------------------------------------------
 * Submit
 * ---------------------------------------------------------
 */
async function handleCreate() {
  if (!isFormValid.value) return

  try {
    store.isSubmitting = true
    store.submitError = null

    let created

    if (store.statModifierMode === 'baseline') {
      created = await createPlayableStatBaseline({
        statId: form.statId,
        baseValue: form.value as number,
      })
    }

    if (store.statModifierMode === 'species') {
      created = await createPlayableSpeciesStatModifier({
        speciesId: form.targetId,
        statId: form.statId,
        modifierValue: form.value as number,
      })
    }

    if (store.statModifierMode === 'class') {
      created = await createPlayableClassStatModifier({
        classId: form.targetId,
        statId: form.statId,
        modifierValue: form.value as number,
      })
    }

    store.refreshPlayableList()
    closeModal()

    toastStore.showToast('Stat modifier created successfully.', 'success')
  } catch (error) {
    console.error(error)
    store.submitError = 'Failed to create stat modifier.'
  } finally {
    store.isSubmitting = false
  }
}
</script>