<template>
  <!--
    =========================================================
    Content Modal Container
    =========================================================

    Renders Content-domain modals based on shared store state.
  -->

  <CreatureEditModal v-if="selectedCreature" />
</template>

<script setup lang="ts">
/**
 * =========================================================
 * Imports
 * =========================================================
 */
import { computed } from 'vue'
import CreatureEditModal from '@/features/admin/content/components/creature/CreatureEditModal.vue'
import { useContentStore } from '@/features/admin/content/stores/contentStore'


/**
 * =========================================================
 * Store
 * =========================================================
 *
 * The Content modal container is fully store-driven.
 */
const store = useContentStore()

/**
 * =========================================================
 * Selected Records
 * =========================================================
 *
 * Temporary computed bridge used to confirm that centralized
 * modal-layer access to selected creature state is working.
 */
const selectedCreature = computed(() => store.selectedCreature)
</script>