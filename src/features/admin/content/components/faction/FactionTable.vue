<template>
  <!--
    =========================================================
    Faction Table
    =========================================================

    First implementation target for the Admin Table framework.

    Current scope:
    - validate AdminTableShell integration
    - establish domain table structure
    - no data fetching yet
  -->
    <AdminTableShell
      :loading="loading"
      :error="error"
      :is-empty="!factions.length"
      loading-message="Loading factions..."
      empty-message="No factions found."
    >
        <table class="min-w-full text-sm text-left">
            <!-- Header -->
            <thead class="border-b border-gray-300 bg-gray-100 text-gray-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-200">
            <tr>
                <th class="px-3 py-2">Name</th>
                <th class="px-3 py-2">Alignment</th>
                <th class="px-3 py-2">Description</th>
                <th class="px-3 py-2">Active</th>
                <th class="px-3 py-2">Updated</th>
            </tr>
            </thead>

            <tbody>
                <FactionTableRow
                    v-for="faction in factions"
                    :key="faction.id"
                    :faction="faction"
                    :is-selected="selectedFactionId === faction.id"
                    @select="selectedFactionId = $event"
                />
            </tbody>
        </table>
    </AdminTableShell>
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Imports
 * =========================================================
 */
import { onMounted, ref } from 'vue'
import FactionTableRow from '@/features/admin/content/components/faction/FactionTableRow.vue'
import { getFactions } from '@/features/admin/content/services/factionService'
import type { FactionListItem } from '@/features/admin/content/types/contentTypes'
import AdminTableShell from '@/features/admin/shared/components/table/AdminTableShell.vue'

/**
 * ---------------------------------------------------------
 * Faction Data (Live)
 * ---------------------------------------------------------
 *
 * Fetches faction records from backend admin endpoint.
 */
const factions = ref<FactionListItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

async function fetchFactions() {
  try {
    loading.value = true
    error.value = null

    const data = await getFactions()
    factions.value = data
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load factions.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchFactions)

/**
 * ---------------------------------------------------------
 * Selected Faction (Temporary)
 * ---------------------------------------------------------
 *
 * Local selection state used to:
 * - validate row selection styling
 * - mirror ItemTable behavior
 *
 * Notes:
 * - Will later be replaced by Content store selection
 */
const selectedFactionId = ref<string | null>(null)
</script>