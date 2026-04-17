<!-- /src/features/admin/components/userDashboard/FlaggedUsersWidget.vue -->

<template>
  <WidgetWrapper title="Flagged Users" icon="AlertTriangle">
    <template #hover-tools>
      <button
        @click="isModalOpen = true"
        class="text-sm text-blue-600 hover:underline"
      >
        🛠 Manage
      </button>
    </template>

    <p class="text-sm">A list of flagged users for review will appear here.</p>

    <AdminModal
      :visible="isModalOpen"
      @close="isModalOpen = false"
      title="Flagged Users Details"
    >
      <p>This is placeholder content for the Flagged Users widget modal.</p>
    </AdminModal>
  </WidgetWrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WidgetWrapper from '@/components/molecules/WidgetWrapper.vue'
import AdminModal from '@/features/admin/shared/components/AdminModal.vue'

const isModalOpen = ref(false)
</script>
