<template>
  <!--
    =========================================================
    Playables Modal Container
    =========================================================

    Centralized rendering layer for all Playables-related modals.

    Responsibilities:
    - mount all modal components for the Playables dashboard
    - control visibility via adminPlayableStore state
    - decouple modal rendering from sidebar controls

    Notes:
    - This container does NOT decide when modals open.
    - It only reacts to store state.
    - Sidebar → triggers store
    - Store → drives this container
  -->

  <!-- Edit Modals -->
  <PlayableSpeciesEditModal />
  <PlayableClassEditModal />

  <!-- (Future) Create Modals will be mounted here -->
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Imports
 * =========================================================
 */

import PlayableClassEditModal from '@/features/admin/components/playableDashboard/PlayableClassEditModal.vue'
import PlayableSpeciesEditModal from '@/features/admin/components/playableDashboard/PlayableSpeciesEditModal.vue'
</script>