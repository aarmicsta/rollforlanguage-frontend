<!-- /src/features/admin/components/playableDashboard/PlayableSpeciesTable.vue -->
<template>
  <div class="space-y-4 text-gray-800 dark:text-gray-100">

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
            class="border-t dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
            @click="handleRowClick(item)"
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
          <tr v-if="!species.length">
            <td colspan="6" class="px-4 py-6 text-center text-gray-500">
              No playable species found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { playableSpeciesService } from '@/features/admin/services/playableSpeciesService'
import { useAdminPlayableStore } from '@/features/admin/stores/adminPlayableStore'
import type { PlayableSpeciesBrowseItem } from '@/features/admin/types/playableTypes'

const store = useAdminPlayableStore()
const species = ref<PlayableSpeciesBrowseItem[]>([])

async function fetchSpecies() {
  const res = await playableSpeciesService.getPlayableSpecies()
  species.value = res
}

function handleRowClick(item: PlayableSpeciesBrowseItem) {
  store.selectedPlayable = item as any
  store.showEditModal = true
}

function formatDate(dateStr: string | null) {
  return dateStr ? new Date(dateStr).toLocaleDateString() : '—'
}

onMounted(fetchSpecies)
watch(() => store.lastPlayableRefresh, fetchSpecies)
</script>