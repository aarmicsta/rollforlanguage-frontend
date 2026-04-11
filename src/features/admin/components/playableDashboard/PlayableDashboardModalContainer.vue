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
    - Sidebar triggers store actions
    - Store controls visibility
    - This container renders modals based on store state
  -->

  <!--
    ---------------------------------------------------------
    Create Modals
    ---------------------------------------------------------
  -->
  <PlayableSpeciesCreateModal />
  <PlayableClassCreateModal />
  <PlayableStatCreateModal />
  <PlayableStatModifierCreateModal />
  <PlayablePassiveCreateModal />
  <PlayablePassiveEditModal />

  <!--
    ---------------------------------------------------------
    Edit Modals
    ---------------------------------------------------------
  -->
  <PlayableSpeciesEditModal />
  <PlayableClassEditModal />
  <PlayableStatEditModal />
  <PlayableStatModifierEditModal />
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Imports
 * =========================================================
 */

import PlayableClassCreateModal from '@/features/admin/components/playableDashboard/PlayableClassCreateModal.vue'
import PlayableClassEditModal from '@/features/admin/components/playableDashboard/PlayableClassEditModal.vue'
import PlayableSpeciesCreateModal from '@/features/admin/components/playableDashboard/PlayableSpeciesCreateModal.vue'
import PlayableSpeciesEditModal from '@/features/admin/components/playableDashboard/PlayableSpeciesEditModal.vue'
import PlayableStatCreateModal from '@/features/admin/components/playableDashboard/PlayableStatCreateModal.vue'
import PlayableStatEditModal from '@/features/admin/components/playableDashboard/PlayableStatEditModal.vue'
import PlayableStatModifierCreateModal from '@/features/admin/components/playableDashboard/PlayableStatModifierCreateModal.vue'
import PlayableStatModifierEditModal from '@/features/admin/components/playableDashboard/PlayableStatModifierEditModal.vue'
import PlayablePassiveCreateModal from './PlayablePassiveCreateModal.vue'
import PlayablePassiveEditModal from './PlayablePassiveEditModal.vue'
</script>