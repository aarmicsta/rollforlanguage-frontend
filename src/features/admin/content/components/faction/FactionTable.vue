<template>
  <!--
    =========================================================
    Faction Table (Stub)
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
    :is-empty="false"
    >
        <table class="min-w-full text-sm text-left">
            <!-- Header -->
            <thead class="border-b text-gray-600 dark:text-gray-300">
            <tr>
                <th class="px-3 py-2">Name</th>
                <th class="px-3 py-2">Alignment</th>
                <th class="px-3 py-2">Description</th>
                <th class="px-3 py-2">Active</th>
                <th class="px-3 py-2">Updated</th>
            </tr>
            </thead>

            <!-- Placeholder Body -->
            <tbody>
            <tr class="border-b">
                <td class="px-3 py-2 text-gray-500" colspan="5">
                Table structure initialized.
                </td>
            </tr>
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
import AdminTableShell from '@/features/admin/shared/components/table/AdminTableShell.vue'
</script>