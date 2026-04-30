<template>
  <!--
    =========================================================
    Item Create Modal
    =========================================================

    Primary Content admin creation surface for a new item.

    Responsibilities:
    - collect required item identity fields
    - collect required item classification fields
    - collect item economy / physical fields
    - auto-generate canonical helper fields from displayName
    - allow manual override of generated name/slug
    - optionally assign equipment slots after creation
    - submit the create payload to the backend

    Notes:
    - mirrors the established Content create-modal pattern
    - visibility is controlled by the Content store
    - shared submission state is owned by the Content store
    - optional equipment slot assignment occurs only after the
      item record has been successfully created
  -->
  <AdminModal
    :visible="store.showCreateItemModal"
    title="Create Item"
    size="5xl"
    @close="closeModal"
  >
    <form
      class="space-y-4 text-sm text-gray-800 dark:text-gray-100"
      @submit.prevent="handleCreate"
    >
      <!--
        ---------------------------------------------------------
        Display Name
        ---------------------------------------------------------
      -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Display Name</label>
        <input
          v-model="form.displayName"
          type="text"
          :disabled="isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          placeholder="e.g. Iron Sword"
        />
      </div>

      <!--
        ---------------------------------------------------------
        Canonical Identity Fields
        ---------------------------------------------------------
      -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs text-gray-500">Internal Name</label>
          <input
            v-model="form.name"
            type="text"
            :disabled="isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
            placeholder="e.g. iron_sword"
            @input="nameManuallyEdited = true"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Canonical internal form. Uses underscores.
          </p>
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Slug</label>
          <input
            v-model="form.slug"
            type="text"
            :disabled="isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
            placeholder="e.g. iron-sword"
            @input="slugManuallyEdited = true"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Public / URL-safe form. Uses hyphens.
          </p>
        </div>
      </div>

      <!--
        ---------------------------------------------------------
        Required Classification Fields
        ---------------------------------------------------------
      -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs text-gray-500">Item Type</label>
          <select
            v-model="form.itemTypeId"
            :disabled="isSubmitting || isLoadingReferenceOptions"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          >
            <option value="">Select item type...</option>
            <option
              v-for="type in availableItemTypes"
              :key="type.id"
              :value="type.id"
            >
              {{ type.displayName }}
            </option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Rarity Level</label>
          <select
            v-model="form.rarityLevelId"
            :disabled="isSubmitting || isLoadingReferenceOptions"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          >
            <option value="">Select rarity...</option>
            <option
              v-for="rarity in availableRarityLevels"
              :key="rarity.id"
              :value="rarity.id"
            >
              {{ rarity.displayName }}
            </option>
          </select>
        </div>
      </div>

      <!--
        ---------------------------------------------------------
        Economy / Physical Fields
        ---------------------------------------------------------
      -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label class="mb-1 block text-xs text-gray-500">Base Value</label>
          <input
            v-model.number="form.baseValue"
            type="number"
            min="0"
            step="1"
            :disabled="isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Weight</label>
          <input
            v-model="form.weight"
            type="number"
            min="0"
            step="0.01"
            :disabled="isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Max Stack Size</label>
          <input
            v-model.number="form.maxStackSize"
            type="number"
            min="1"
            step="1"
            :disabled="isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          />
        </div>
      </div>

      <!--
        ---------------------------------------------------------
        Optional / Status Fields
        ---------------------------------------------------------
      -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Description</label>
        <textarea
          v-model="form.description"
          rows="5"
          :disabled="isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          placeholder="Optional description..."
        />
      </div>

      <div>
        <label class="mb-1 block text-xs text-gray-500">Active</label>
        <label class="flex items-center gap-2">
          <input
            v-model="form.isActive"
            type="checkbox"
            :disabled="isSubmitting"
            class="h-4 w-4"
            :true-value="true"
            :false-value="false"
          />
          <span>{{ form.isActive ? 'Yes' : 'No' }}</span>
        </label>
      </div>

      <!--
        ---------------------------------------------------------
        Optional Equipment Slots
        ---------------------------------------------------------
      -->
      <div class="rounded border dark:border-neutral-700">
        <button
          type="button"
          :disabled="isSubmitting"
          class="flex w-full items-center justify-between px-4 py-3 text-left"
          @click="toggleEquipmentSlots"
        >
          <div>
            <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Optional Equipment Slots
            </h3>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Assign equipment slots after the item is created.
            </p>
          </div>

          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ showEquipmentSlots ? 'Hide' : 'Show' }}
          </span>
        </button>

        <div
          v-if="showEquipmentSlots"
          class="border-t px-4 py-4 dark:border-neutral-700"
        >
          <div class="max-h-72 overflow-y-auto pr-1">
            <div
              v-for="slot in availableEquipmentSlots"
              :key="slot.id"
              class="flex items-start gap-3 border-b py-3 last:border-b-0 dark:border-neutral-700"
            >
              <input
                :id="`equipment-slot-${slot.id}`"
                v-model="selectedEquipmentSlotIds"
                type="checkbox"
                :value="slot.id"
                :disabled="isSubmitting"
                class="mt-1 h-4 w-4"
              />

              <label
                :for="`equipment-slot-${slot.id}`"
                class="flex-1 cursor-pointer"
              >
                <p class="font-medium text-gray-800 dark:text-gray-100">
                  {{ slot.displayName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ slot.slotCategory ?? 'Uncategorized' }}
                </p>
              </label>
            </div>

            <p
              v-if="!availableEquipmentSlots.length"
              class="text-sm text-gray-500 dark:text-gray-400"
            >
              No equipment slots available.
            </p>
          </div>
        </div>
      </div>

      <!--
        ---------------------------------------------------------
        Submission / Loading Feedback
        ---------------------------------------------------------
      -->
      <p
        v-if="referenceLoadError"
        class="text-sm text-red-600 dark:text-red-400"
      >
        {{ referenceLoadError }}
      </p>

      <p
        v-if="submitError"
        class="text-sm text-red-600 dark:text-red-400"
      >
        {{ submitError }}
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
          :disabled="isSubmitting"
          class="rounded bg-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-400 dark:bg-neutral-700 dark:text-gray-100 dark:hover:bg-neutral-600"
        >
          Cancel
        </button>

        <button
          type="submit"
          :disabled="isSubmitting || isLoadingReferenceOptions || !isFormValid"
          class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ isSubmitting ? 'Creating...' : 'Create Item' }}
        </button>
      </div>
    </form>
  </AdminModal>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Item Create Modal
 * =========================================================
 *
 * Creates a new item record and optionally attaches initial
 * equipment slot relational data after creation.
 *
 * Current scope:
 * - item identity
 * - required item classification
 * - economy / physical fields
 * - active status
 * - optional equipment slot assignment
 *
 * Architectural Notes:
 * - visibility is controlled by the Content store
 * - submission/error state is owned by the Content store
 * - reference data is loaded locally because it is modal-specific
 * - equipment slot assignment occurs after the item exists
 */

 /**
 * =========================================================
 * Imports
 * =========================================================
 */
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useToastStore } from '@/stores/ui/useToastStore'
import {
  createItem,
  getEquipmentSlots,
  getItemTypes,
  getRarityLevels,
  updateItemEquipmentSlots,
} from '@/features/admin/content/services/itemService'
import { useContentStore } from '@/features/admin/content/stores/contentStore'
import type {
  EquipmentSlotOption,
  ItemTypeOption,
  RarityLevelOption,
} from '@/features/admin/content/types/contentTypes'
import AdminModal from '@/features/admin/shared/components/AdminModal.vue'

/**
 * ---------------------------------------------------------
 * Stores
 * ---------------------------------------------------------
 *
 * `store`
 * - owns shared Content dashboard state
 * - controls modal visibility
 * - owns shared submission/error state
 *
 * `toastStore`
 * - displays global success/error feedback
 */
const store = useContentStore()
const toastStore = useToastStore()

/**
 * ---------------------------------------------------------
 * Shared Submission State
 * ---------------------------------------------------------
 *
 * Mirrors Content store-owned submission state into this
 * modal for template readability.
 */
const isSubmitting = computed(() => store.isSubmitting)
const submitError = computed(() => store.submitError)

/**
 * ---------------------------------------------------------
 * Item Identity Form State
 * ---------------------------------------------------------
 *
 * Local create-form state for required item identity,
 * classification, economy, and physical fields.
 *
 * Notes:
 * - displayName drives automatic name/slug generation
 * - name and slug may be manually overridden
 * - itemTypeId and rarityLevelId are required
 * - weight is stored as a string to match backend decimal shape
 */
const form = reactive({
  displayName: '',
  name: '',
  slug: '',
  description: '',
  itemTypeId: '',
  rarityLevelId: '',
  baseValue: 0,
  weight: '0.00',
  maxStackSize: 1,
  isActive: true,
})

/**
 * ---------------------------------------------------------
 * Manual Identity Override Flags
 * ---------------------------------------------------------
 *
 * Prevent automatic name/slug generation from overwriting
 * deliberate user edits.
 */
const nameManuallyEdited = ref(false)
const slugManuallyEdited = ref(false)

/**
 * ---------------------------------------------------------
 * Optional Section Visibility
 * ---------------------------------------------------------
 *
 * Controls collapsed/expanded state for optional create-time
 * assignment sections.
 */
const showEquipmentSlots = ref(false)

/**
 * ---------------------------------------------------------
 * Equipment Slot Assignment State
 * ---------------------------------------------------------
 *
 * `availableEquipmentSlots`
 * - canonical equipment slot options loaded from backend
 *
 * `selectedEquipmentSlotIds`
 * - selected slot IDs to attach after item creation
 *
 * Notes:
 * - non-equippable items may have no equipment slots
 * - assignment occurs after the core item record exists
 */
const availableEquipmentSlots = ref<EquipmentSlotOption[]>([])
const selectedEquipmentSlotIds = ref<string[]>([])

/**
 * ---------------------------------------------------------
 * Classification Reference State
 * ---------------------------------------------------------
 *
 * Canonical option sets used by required item classification
 * selectors.
 */
const availableItemTypes = ref<ItemTypeOption[]>([])
const availableRarityLevels = ref<RarityLevelOption[]>([])

/**
 * ---------------------------------------------------------
 * Reference Loading State
 * ---------------------------------------------------------
 *
 * Tracks reference option loading separately from submission.
 */
const isLoadingReferenceOptions = ref(false)
const referenceLoadError = ref('')

/**
 * ---------------------------------------------------------
 * Load Reference Options
 * ---------------------------------------------------------
 *
 * Loads all reference data required by the create modal:
 * - item types
 * - rarity levels
 * - equipment slots
 *
 * Notes:
 * - item type and rarity are required for create
 * - equipment slots are optional post-create assignments
 * - failures clear local option arrays to prevent stale UI
 */
async function loadReferenceOptions() {
  try {
    isLoadingReferenceOptions.value = true
    referenceLoadError.value = ''

    const [itemTypes, rarityLevels, equipmentSlots] = await Promise.all([
      getItemTypes(),
      getRarityLevels(),
      getEquipmentSlots(),
    ])

    availableItemTypes.value = itemTypes
    availableRarityLevels.value = rarityLevels
    availableEquipmentSlots.value = equipmentSlots
  } catch (error) {
    console.error('Failed to load item create reference options:', error)

    availableItemTypes.value = []
    availableRarityLevels.value = []
    availableEquipmentSlots.value = []
    referenceLoadError.value = 'Failed to load required item create options.'
  } finally {
    isLoadingReferenceOptions.value = false
  }
}

/**
 * ---------------------------------------------------------
 * Lifecycle
 * ---------------------------------------------------------
 *
 * Load create-modal reference options when the modal component
 * is mounted.
 */
onMounted(() => {
  loadReferenceOptions()
})

/**
 * ---------------------------------------------------------
 * Optional Section Toggles
 * ---------------------------------------------------------
 */
function toggleEquipmentSlots() {
  showEquipmentSlots.value = !showEquipmentSlots.value
}

/**
 * ---------------------------------------------------------
 * Name Normalization
 * ---------------------------------------------------------
 *
 * Converts display labels into canonical internal names.
 *
 * Example:
 * - "Iron Sword" -> "iron_sword"
 */
function normalizeToName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/[^\p{L}\p{N}_]/gu, '')
    .replace(/^_+|_+$/g, '')
}

/**
 * ---------------------------------------------------------
 * Slug Normalization
 * ---------------------------------------------------------
 *
 * Converts display labels into URL-safe slugs.
 *
 * Example:
 * - "Iron Sword" -> "iron-sword"
 */
function normalizeToSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/^-+|-+$/g, '')
}

/**
 * ---------------------------------------------------------
 * Watch: Display Name
 * ---------------------------------------------------------
 *
 * Auto-generates name and slug while preserving manual
 * overrides once the user edits either field directly.
 */
watch(
  () => form.displayName,
  (value) => {
    if (!nameManuallyEdited.value) {
      form.name = normalizeToName(value)
    }

    if (!slugManuallyEdited.value) {
      form.slug = normalizeToSlug(value)
    }
  }
)

/**
 * ---------------------------------------------------------
 * Form Validity
 * ---------------------------------------------------------
 *
 * Minimum schema-valid create requirements.
 */
const isFormValid = computed(() => {
  return (
    form.displayName.trim().length > 0 &&
    form.name.trim().length > 0 &&
    form.slug.trim().length > 0 &&
    form.itemTypeId.trim().length > 0 &&
    form.rarityLevelId.trim().length > 0 &&
    form.baseValue >= 0 &&
    form.weight.trim().length > 0 &&
    form.maxStackSize >= 1
  )
})

/**
 * ---------------------------------------------------------
 * Reset Form
 * ---------------------------------------------------------
 *
 * Restores create-modal state after close or successful create.
 *
 * Notes:
 * - keeps loaded reference option arrays intact
 * - clears selected optional assignments
 * - resets identity/economy fields to safe defaults
 */
function resetForm() {
  form.displayName = ''
  form.name = ''
  form.slug = ''
  form.description = ''
  form.itemTypeId = ''
  form.rarityLevelId = ''
  form.baseValue = 0
  form.weight = '0.00'
  form.maxStackSize = 1
  form.isActive = true

  nameManuallyEdited.value = false
  slugManuallyEdited.value = false

  showEquipmentSlots.value = false
  selectedEquipmentSlotIds.value = []

  store.clearSubmitError()
  referenceLoadError.value = ''
}

/**
 * ---------------------------------------------------------
 * Close Modal
 * ---------------------------------------------------------
 *
 * Closes the create modal and clears local form state.
 */
function closeModal() {
  store.closeCreateItemModal()
  resetForm()
}

/**
 * ---------------------------------------------------------
 * Create Handler
 * ---------------------------------------------------------
 *
 * Save order:
 * 1. create core item record
 * 2. optionally attach selected equipment slots
 *
 * Notes:
 * - relational assignments require the created item ID
 * - shared submission/error state is owned by the Content store
 * - refresh signal updates Content browse surfaces after success
 */
async function handleCreate() {
  if (!isFormValid.value) return

  try {
    store.setSubmitting(true)
    store.clearSubmitError()

    const createdItem = await createItem({
      displayName: form.displayName.trim(),
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      itemTypeId: form.itemTypeId,
      rarityLevelId: form.rarityLevelId,
      baseValue: form.baseValue,
      weight: form.weight,
      maxStackSize: form.maxStackSize,
      isActive: form.isActive,
    })

    if (!createdItem?.id) {
      throw new Error('Item creation did not return a valid item ID.')
    }

    if (selectedEquipmentSlotIds.value.length > 0) {
      await updateItemEquipmentSlots(createdItem.id, {
        equipmentSlotIds: selectedEquipmentSlotIds.value,
      })
    }

    store.refreshContentList()
    closeModal()
    toastStore.showToast('Item created successfully.', 'success')
  } catch (error) {
    console.error(error)
    store.setSubmitError('Failed to create item.')
  } finally {
    store.setSubmitting(false)
  }
}
</script>