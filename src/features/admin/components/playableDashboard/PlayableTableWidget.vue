<!-- /src/features/admin/components/playableDashboard/PlayableTableWidget.vue -->
<template>
  <WidgetWrapper title="Playable Class Table" icon="Table">
    <template #hover-tools>
      <button
        @click="modalOpen = true"
        class="text-sm text-blue-600 hover:underline"
      >
        🛠 Manage
      </button>
    </template>

    <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
      View and manage all playable classes.
    </p>

    <AdminModal
      :visible="modalOpen"
      @close="modalOpen = false"
      size="6xl"
      title="Manage Playable Classes"
    >
      <div class="space-y-4 text-gray-800 dark:text-gray-100">
        <!-- Create Button -->
        <div class="flex justify-end">
          <button
            @click="store.openCreateModal()"
            class="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
          >
            ➕ New Class
          </button>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto rounded border dark:border-neutral-700">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-100 dark:bg-neutral-800">
              <tr>
                <th class="px-4 py-2 text-left">Display Name</th>
                <th class="px-4 py-2 text-left">Name</th>
                <th class="px-4 py-2 text-left">Slug</th>
                <th class="px-4 py-2 text-left">Active</th>
                <th class="px-4 py-2 text-left">Sort Order</th>
                <th class="px-4 py-2 text-left">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in species"
                :key="item.id"
                class="border-t dark:border-neutral-700"
              >
                <td class="px-4 py-2 font-medium">{{ item.displayName }}</td>
                <td class="px-4 py-2">{{ item.name }}</td>
                <td class="px-4 py-2">{{ item.slug }}</td>
                <td class="px-4 py-2">
                  {{ item.isActive ? 'Yes' : 'No' }}
                </td>
                <td class="px-4 py-2">{{ item.sortOrder ?? '—' }}</td>
                <td class="px-4 py-2">
                  {{ formatDate(item.updatedAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminModal>

    <!-- Modal for Create/Edit -->
    <PlayableClassModal />
  </WidgetWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import WidgetWrapper from '@/components/molecules/WidgetWrapper.vue'
import AdminModal from '@/features/admin/components/shared/AdminModal.vue'
import { playableSpeciesService } from '@/features/admin/services/playableSpeciesService'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'
import type { PlayableSpeciesBrowseItem } from '@/features/admin/types/playableTypes'
import PlayableClassModal from './PlayableClassModal.vue'

const store = useAdminPlayableStore()
const modalOpen = ref(false)
const species = ref<PlayableSpeciesBrowseItem[]>([])

async function fetchSpecies() {
  const res = await playableSpeciesService.getPlayableSpecies()
  species.value = res
}

function formatDate(dateStr: string | null) {
  return dateStr ? new Date(dateStr).toLocaleDateString() : '—'
}

onMounted(fetchSpecies)
watch(() => store.lastPlayableRefresh, fetchSpecies)
</script>
