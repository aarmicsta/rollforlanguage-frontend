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

import PlayableClassCreateModal from '@/features/admin/playable/components/class/ClassCreateModal.vue'
import PlayableClassEditModal from '@/features/admin/playable/components/class/ClassEditModal.vue'
import PlayablePassiveCreateModal from '@/features/admin/playable/components/passive/PassiveCreateModal.vue'
import PlayablePassiveEditModal from '@/features/admin/playable/components/passive/PassiveEditModal.vue'
import PlayableSpeciesCreateModal from '@/features/admin/playable/components/species/SpeciesCreateModal.vue'
import PlayableSpeciesEditModal from '@/features/admin/playable/components/species/SpeciesEditModal.vue'
import PlayableStatCreateModal from '@/features/admin/playable/components/stat/StatCreateModal.vue'
import PlayableStatEditModal from '@/features/admin/playable/components/stat/StatEditModal.vue'
import PlayableStatModifierCreateModal from '@/features/admin/playable/components/statModifier/StatModifierCreateModal.vue'
import PlayableStatModifierEditModal from '@/features/admin/playable/components/statModifier/StatModifierEditModal.vue'
</script>