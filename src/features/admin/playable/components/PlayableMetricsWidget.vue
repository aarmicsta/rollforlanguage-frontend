<!-- /src/features/admin/components/playableDashboard/PlayableMetricsWidget.vue -->
<template>
  <WidgetWrapper title="Playable Metrics" icon="Activity">
    <template #hover-tools>
      <button
        @click="modalOpen = true"
        class="text-sm text-blue-600 hover:underline"
      >
        🛠 View
      </button>
    </template>

    <p class="mt-2 text-sm">
      Summary of playable playable class data.
    </p>

    <AdminModal
      :visible="modalOpen"
      @close="modalOpen = false"
      size="2xl"
      title="Playable Metrics"
    >
      <div class="space-y-4 text-gray-800 dark:text-gray-100">
        <p><strong>Total Classes:</strong> Coming soon</p>
        <p><strong>Total Species:</strong> Coming soon</p>
        <p><strong>Average Stat Bonus:</strong> Placeholder</p>
        <p><strong>Most Common Tags:</strong> Placeholder</p>
      </div>
    </AdminModal>
  </WidgetWrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WidgetWrapper from '@/components/molecules/WidgetWrapper.vue'
import AdminModal from '@/features/admin/components/shared/AdminModal.vue'

const modalOpen = ref(false)
</script>
