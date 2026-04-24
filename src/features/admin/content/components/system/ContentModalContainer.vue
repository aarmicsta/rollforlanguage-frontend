<template>
  <!--
    =========================================================
    Content Modal Container
    =========================================================

    Centralized rendering layer for all Content-related modals.

    Responsibilities:
    - mount all modal components for the Content dashboard
    - control visibility via Content store state
    - decouple modal rendering from table and sidebar interactions

    Notes:
    - table interactions set selected records in the store
    - store state determines which modals are visible
    - this container owns all modal mounting for the Content domain
  -->

  <!--
    ---------------------------------------------------------
    Create Modals
    ---------------------------------------------------------
  -->
  <CreatureCreateModal />

  <!--
    ---------------------------------------------------------
    Edit Modals
    ---------------------------------------------------------
  -->
  <CreatureEditModal />
  <CreatureBaseStatsEditModal />
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Imports
 * =========================================================
 */

import CreatureBaseStatsEditModal from '@/features/admin/content/components/creature/CreatureBaseStatsEditModal.vue'
import CreatureCreateModal from '@/features/admin/content/components/creature/CreatureCreateModal.vue'
import CreatureEditModal from '@/features/admin/content/components/creature/CreatureEditModal.vue'
</script>