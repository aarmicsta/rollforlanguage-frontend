<!-- /src/features/admin/components/userDashboard/UserMetricsWidget.vue -->

<template>
  <WidgetWrapper title="User Metrics" icon="BarChart2">
    <template #hover-tools>
      <button
        @click="isModalOpen = true"
        class="text-sm text-blue-600 hover:underline"
      >
        🛠 Manage
      </button>
    </template>

    <p class="text-sm">Metrics like total users, active users, etc., will appear here.</p>

    <AdminModal
      :visible="isModalOpen"
      @close="isModalOpen = false"
      title="User Metrics Details"
    >
      <p>This is placeholder content for the User Metrics widget modal.</p>
    </AdminModal>
  </WidgetWrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WidgetWrapper from '@/components/molecules/WidgetWrapper.vue'
import AdminModal from '@/features/admin/shared/components/AdminModal.vue'

const isModalOpen = ref(false)
</script>
