<template>
  <DashboardWidgetGrid>
    <!-- Playable Table Widget -->
    <PlayableTableWidget />

    <!-- Playable Metrics Widget -->
    <PlayableMetricsWidget />

    <!-- Featured Tags Widget (display-only) -->
    <!-- <FeaturedTagsWidget ref="featuredTagsRef" /> -->

    <!-- Central Tag Management Modal (sidebar-triggered) -->
    <!-- <ManageTagsModal
      :visible="props.showTagsModal"
      :default-category="props.defaultCategory"
      @close="emit('update:showTagsModal', false)"
      @refresh="handleTagRefresh"
    /> -->
  </DashboardWidgetGrid>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Admin dashboard widgets for managing playable classes & species
import DashboardWidgetGrid from '@/features/admin/components/dashboard/DashboardWidgetGrid.vue'
// import FeaturedTagsWidget from '@/features/admin/components/playableDashboard/FeaturedTagsWidget.vue'
// import ManageTagsModal from '@/features/admin/components/playableDashboard/ManageTagsModal.vue'
import PlayableMetricsWidget from '@/features/admin/components/playableDashboard/PlayableMetricsWidget.vue'
import PlayableTableWidget from '@/features/admin/components/playableDashboard/PlayableTableWidget.vue'

// Props passed from AdminLayout
const props = defineProps<{
  showTagsModal: boolean
  defaultCategory?: 'class' | 'species' // ✅ New optional prop
}>()

const emit = defineEmits<{
  (e: 'update:showTagsModal', value: boolean): void
}>()

const featuredTagsRef = ref()

function handleTagRefresh() {
  console.log('📣 handleTagRefresh triggered')
  featuredTagsRef.value?.refetch?.()
}
</script>
