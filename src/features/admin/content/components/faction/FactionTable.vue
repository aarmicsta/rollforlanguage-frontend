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
    :loading="false"
    :error="''"
    :is-empty="!factions.length"
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
import { ref } from 'vue'
import FactionTableRow from '@/features/admin/content/components/faction/FactionTableRow.vue'
import type { FactionListItem } from '@/features/admin/content/types/contentTypes'
import AdminTableShell from '@/features/admin/shared/components/table/AdminTableShell.vue'

/**
 * ---------------------------------------------------------
 * Local Mock Data (Temporary)
 * ---------------------------------------------------------
 *
 * Provides a minimal in-component dataset used to:
 * - validate table structure and column layout
 * - test row rendering and spacing
 * - simulate real data before backend integration
 *
 * Notes:
 * - This will be removed once factionService + API endpoints exist
 * - Shape mirrors ContentFactionRecord to prevent drift
 */
const factions = ref<FactionListItem[]>([
  {
    id: 'demo-faction-1',
    name: 'iron_circle',
    slug: 'iron-circle',
    displayName: 'Iron Circle',
    description: 'A disciplined faction used to validate table layout.',
    alignmentId: null,
    alignment: null,
    iconMediaAssetId: null,
    isActive: true,
    sortOrder: 0,
    createdAt: null,
    updatedAt: null,
  },
])

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