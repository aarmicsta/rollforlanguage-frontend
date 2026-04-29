<template>
  <!--
    =========================================================
    Item Edit Modal
    =========================================================

    Edit workflow for canonical item records.

    Responsibilities:
    - load editable item data into local state
    - submit scalar updates
    - submit relational updates for equipment slots
    - trigger content refresh on successful save

    Visibility:
    - controlled explicitly by Content store state:
      store.showEditItemModal
    - selectedItem provides the editing context only
  -->
  <AdminModal
    :visible="store.showEditItemModal"
    title="Edit Item"
    size="4xl"
    @close="closeModal"
  >
    <form
      v-if="editableItem"
      class="space-y-4 text-sm text-gray-800 dark:text-gray-100"
      @submit.prevent="handleSave"
    >
      <!-- Core Editable Fields -->
      <div>
        <label class="mb-1 block text-xs text-gray-500">Display Name</label>
        <input
          v-model="editableItem.displayName"
          type="text"
          :disabled="isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ editableItem.slug }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-500">Internal Name</p>
          <p>{{ editableItem.name }}</p>
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Active</label>
          <label class="flex items-center gap-2">
            <input
              v-model="editableItem.isActive"
              type="checkbox"
              :disabled="isSubmitting"
              class="h-4 w-4"
              :true-value="true"
              :false-value="false"
            />
            <span>{{ editableItem.isActive ? 'Yes' : 'No' }}</span>
          </label>
        </div>

        <div>
          <label class="mb-1 block text-xs text-gray-500">Item Type</label>
          <select
            v-model="editableItem.itemTypeId"
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
            v-model="editableItem.rarityLevelId"
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

        <div>
          <label class="mb-1 block text-xs text-gray-500">Base Value</label>
          <input
            v-model.number="editableItem.baseValue"
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
            v-model="editableItem.weight"
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
            v-model.number="editableItem.maxStackSize"
            type="number"
            min="1"
            step="1"
            :disabled="isSubmitting"
            class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
          />
        </div>

        <div>
          <p class="text-xs text-gray-500">Last Updated</p>
          <p>{{ formatDate(editableItem.updatedAt) }}</p>
        </div>
      </div>

      <div>
        <label class="mb-1 block text-xs text-gray-500">Description</label>
        <textarea
          v-model="editableItem.description"
          rows="5"
          :disabled="isSubmitting"
          class="w-full rounded border px-3 py-2 text-sm text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100"
        />
      </div>

      <!-- Equipment Slot Assignment -->
      <div class="rounded border dark:border-neutral-700">
        <div class="px-4 py-3">
          <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Equipment Slots
          </h3>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Assign valid equipment slots for this item.
          </p>
        </div>

        <div class="border-t px-4 py-4 dark:border-neutral-700">
          <div class="max-h-72 overflow-y-auto pr-1">
            <div
              v-for="slot in availableEquipmentSlots"
              :key="slot.id"
              class="flex items-start gap-3 border-b py-3 last:border-b-0 dark:border-neutral-700"
            >
              <input
                :id="`edit-equipment-slot-${slot.id}`"
                v-model="selectedEquipmentSlotIds"
                type="checkbox"
                :value="slot.id"
                :disabled="isSubmitting"
                class="mt-1 h-4 w-4"
              />

              <label
                :for="`edit-equipment-slot-${slot.id}`"
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

      <!-- Submission Error -->
      <div v-if="submitError" class="text-sm text-red-500">
        {{ submitError }}
      </div>

      <!-- Modal Actions -->
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
          :disabled="isSubmitting || isLoadingReferenceOptions || !isFormValid"
          class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>

    <div v-else class="text-sm text-gray-500">
      No item selected.
    </div>
  </AdminModal>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Imports
 * =========================================================
 */
import { computed, onMounted, ref, watch } from 'vue'
import { useToastStore } from '@/stores/ui/useToastStore'
import {
  getEquipmentSlots,
  getItemEquipmentSlots,
  getItemTypes,
  getRarityLevels,
  updateItem,
  updateItemEquipmentSlots,
} from '@/features/admin/content/services/itemService'
import { useContentStore } from '@/features/admin/content/stores/contentStore'
import type {
  ContentItemRecord,
  EquipmentSlotOption,
  ItemEquipmentSlotAssignment,
  ItemTypeOption,
  RarityLevelOption,
} from '@/features/admin/content/types/contentTypes'
import AdminModal from '@/features/admin/shared/components/AdminModal.vue'

/**
 * =========================================================
 * Store
 * =========================================================
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
 * Local Editable Scalar State
 * ---------------------------------------------------------
 *
 * Uses a shallow local copy so the modal can edit safely
 * without directly mutating store-selected records.
 */
const editableItem = ref<ContentItemRecord | null>(null)

/**
 * ---------------------------------------------------------
 * Equipment Slot Assignment State
 * ---------------------------------------------------------
 *
 * - availableEquipmentSlots
 *   full canonical equipment slot list used by the selector UI
 * - assignedEquipmentSlots
 *   resolved currently assigned slots from backend
 * - selectedEquipmentSlotIds
 *   ID-only selection model bound to checkbox inputs
 */
const selectedEquipmentSlotIds = ref<string[]>([])
const assignedEquipmentSlots = ref<ItemEquipmentSlotAssignment[]>([])
const availableEquipmentSlots = ref<EquipmentSlotOption[]>([])

/**
 * ---------------------------------------------------------
 * Classification Reference State
 * ---------------------------------------------------------
 *
 * Canonical option sets used by item classification selectors.
 */
const availableItemTypes = ref<ItemTypeOption[]>([])
const availableRarityLevels = ref<RarityLevelOption[]>([])

/**
 * ---------------------------------------------------------
 * Reference Loading State
 * ---------------------------------------------------------
 *
 * Tracks loading state for item classification and equipment
 * slot option retrieval.
 */
const isLoadingReferenceOptions = ref(false)

/**
 * ---------------------------------------------------------
 * Watch: Selected Item
 * ---------------------------------------------------------
 *
 * Synchronizes local scalar state and relational assignment
 * state whenever the store-selected item changes.
 */
watch(
  () => store.selectedItem,
  async (value) => {
    editableItem.value = value ? { ...value } : null
    store.clearSubmitError()

    if (!value) {
      assignedEquipmentSlots.value = []
      selectedEquipmentSlotIds.value = []
      return
    }

    try {
      if (!availableEquipmentSlots.value.length) {
        await loadReferenceOptions()
      }

      await loadAssignedEquipmentSlots(value.id)
    } catch (error) {
      console.error('Failed to synchronize item equipment slot state:', error)
      assignedEquipmentSlots.value = []
      selectedEquipmentSlotIds.value = []
    }
  },
  { immediate: true }
)

/**
 * ---------------------------------------------------------
 * Load Assigned Equipment Slots
 * ---------------------------------------------------------
 *
 * Loads current equipment slot assignments for the selected
 * item and converts them into the checkbox selection model.
 */
async function loadAssignedEquipmentSlots(itemId: string) {
  try {
    const slots = await getItemEquipmentSlots(itemId)
    assignedEquipmentSlots.value = slots
    selectedEquipmentSlotIds.value = slots.map((slot) => slot.id)
  } catch (error) {
    console.error('Failed to load assigned item equipment slots:', error)
    assignedEquipmentSlots.value = []
    selectedEquipmentSlotIds.value = []
  }
}

/**
 * ---------------------------------------------------------
 * Load Reference Options
 * ---------------------------------------------------------
 *
 * Loads canonical item reference option sets used by the edit
 * modal:
 * - item types
 * - rarity levels
 * - equipment slots
 */
async function loadReferenceOptions() {
  try {
    isLoadingReferenceOptions.value = true

    const [itemTypes, rarityLevels, equipmentSlots] = await Promise.all([
      getItemTypes(),
      getRarityLevels(),
      getEquipmentSlots(),
    ])

    availableItemTypes.value = itemTypes
    availableRarityLevels.value = rarityLevels
    availableEquipmentSlots.value = equipmentSlots
  } catch (error) {
    console.error('Failed to load item edit reference options:', error)

    availableItemTypes.value = []
    availableRarityLevels.value = []
    availableEquipmentSlots.value = []
  } finally {
    isLoadingReferenceOptions.value = false
  }
}

/**
 * ---------------------------------------------------------
 * Lifecycle
 * ---------------------------------------------------------
 *
 * Loads edit-modal reference options when the modal component
 * is mounted.
 */
onMounted(loadReferenceOptions)

/**
 * ---------------------------------------------------------
 * Formatting
 * ---------------------------------------------------------
 *
 * Lightweight formatter for nullable backend date strings.
 */
function formatDate(dateStr: string | null) {
  return dateStr ? new Date(dateStr).toLocaleDateString() : '—'
}

/**
 * ---------------------------------------------------------
 * Form Validity
 * ---------------------------------------------------------
 *
 * Minimum schema-valid update requirements.
 */
const isFormValid = computed(() => {
  if (!editableItem.value) return false

  return (
    editableItem.value.displayName.trim().length > 0 &&
    editableItem.value.itemTypeId.trim().length > 0 &&
    editableItem.value.rarityLevelId.trim().length > 0 &&
    editableItem.value.baseValue >= 0 &&
    editableItem.value.weight.trim().length > 0 &&
    editableItem.value.maxStackSize >= 1
  )
})

/**
 * ---------------------------------------------------------
 * Modal Controls
 * ---------------------------------------------------------
 */
function closeModal() {
  store.closeEditItemModal()
  editableItem.value = null
  store.clearSubmitError()
}

/**
 * ---------------------------------------------------------
 * Save Handler
 * ---------------------------------------------------------
 *
 * Save order:
 * 1. scalar item fields
 * 2. equipment slot assignments
 *
 * This mirrors the canonical Content save pattern:
 * scalar update first, then relational replace-all updates.
 */
async function handleSave() {
  if (!editableItem.value || !isFormValid.value) return

  try {
    store.setSubmitting(true)
    store.clearSubmitError()

    const updated = await updateItem(editableItem.value.id, {
      displayName: editableItem.value.displayName,
      description: editableItem.value.description ?? null,
      itemTypeId: editableItem.value.itemTypeId,
      rarityLevelId: editableItem.value.rarityLevelId,
      baseValue: editableItem.value.baseValue,
      weight: editableItem.value.weight,
      maxStackSize: editableItem.value.maxStackSize,
      isActive: editableItem.value.isActive ?? false,
    })

    await updateItemEquipmentSlots(editableItem.value.id, {
      equipmentSlotIds: selectedEquipmentSlotIds.value,
    })

    if (updated) {
      store.setSelectedItem(updated)
      editableItem.value = { ...updated }
      store.refreshContentList()
    }

    closeModal()
    toastStore.showToast('Item updated successfully.', 'success')
  } catch (error) {
    console.error(error)
    store.setSubmitError('Failed to save item changes.')
  } finally {
    store.setSubmitting(false)
  }
}
</script>