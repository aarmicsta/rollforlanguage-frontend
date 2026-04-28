<template>
  <!--
    =========================================================
    Item Table
    =========================================================

    First-pass Item management table.

    Responsibilities:
    - fetch and display item browse records
    - refresh when the shared Content refresh signal changes
    - open the item edit workflow when a row is selected

    Notes:
    - This component is browse-only.
    - It does not render modals directly.
    - Modal orchestration is handled via the Content store
      and the Content modal container.
  -->
  <div class="p-4">
    <!-- Loading State -->
    <div v-if="loading" class="text-sm text-gray-500">
      Loading items...
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-sm text-red-500">
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="!items.length" class="text-sm text-gray-500">
      No items found.
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full text-sm text-left">
        <thead class="border-b text-gray-600">
          <tr>
            <th class="px-3 py-2">Name</th>
            <th class="px-3 py-2">Type</th>
            <th class="px-3 py-2">Rarity</th>
            <th class="px-3 py-2">Value</th>
            <th class="px-3 py-2">Weight</th>
            <th class="px-3 py-2">Stack</th>
            <th class="px-3 py-2">Active</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            :class="[
              'border-b cursor-pointer',
              'hover:bg-gray-50 dark:hover:bg-neutral-800',
              selectedItem?.id === item.id
                ? 'bg-blue-50 dark:bg-neutral-800'
                : ''
            ]"
            @click="handleRowClick(item)"
          >
            <!-- Name -->
            <td class="px-3 py-2">
              <div class="font-medium text-gray-800 dark:text-gray-100">
                {{ item.displayName }}
              </div>
              <div class="text-xs text-gray-500">
                {{ item.slug }}
              </div>
            </td>

            <!-- Type -->
            <td class="px-3 py-2">
              {{ item.itemType }}
            </td>

            <!-- Rarity -->
            <td class="px-3 py-2">
              {{ item.rarityLevel }}
            </td>

            <!-- Value -->
            <td class="px-3 py-2">
              {{ item.baseValue }}
            </td>

            <!-- Weight -->
            <td class="px-3 py-2">
              {{ item.weight }}
            </td>

            <!-- Stack -->
            <td class="px-3 py-2">
              {{ item.maxStackSize }}
            </td>

            <!-- Active -->
            <td class="px-3 py-2">
              <span
                :class="[
                  'rounded px-2 py-1 text-xs',
                  item.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-600'
                ]"
              >
                {{ item.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Imports
 * =========================================================
 */
import { computed, onMounted, ref, watch } from 'vue'

import { getItems } from '@/features/admin/content/services/itemService'
import { useContentStore } from '@/features/admin/content/stores/contentStore'
import type { ItemListItem } from '@/features/admin/content/types/contentTypes'


/**
 * ---------------------------------------------------------
 * Store / Local State
 * ---------------------------------------------------------
 */
const store = useContentStore()
const items = ref<ItemListItem[]>([])

/**
 * ---------------------------------------------------------
 * Derived State
 * ---------------------------------------------------------
 */
const selectedItem = computed(() => store.selectedItem)

/**
 * ---------------------------------------------------------
 * Request State
 * ---------------------------------------------------------
 */
const loading = ref(false)
const error = ref('')

/**
 * ---------------------------------------------------------
 * Data Loading
 * ---------------------------------------------------------
 */
async function fetchItems() {
  loading.value = true
  error.value = ''

  try {
    items.value = await getItems()
  } catch (err: any) {
    error.value = err?.message || 'Failed to load items'
  } finally {
    loading.value = false
  }
}

/**
 * ---------------------------------------------------------
 * Row Interaction
 * ---------------------------------------------------------
 */
function handleRowClick(item: ItemListItem) {
  store.openEditItemModal(item)
}

/**
 * ---------------------------------------------------------
 * Lifecycle / Refresh Sync
 * ---------------------------------------------------------
 */
onMounted(fetchItems)
watch(() => store.lastContentRefresh, fetchItems)
</script>