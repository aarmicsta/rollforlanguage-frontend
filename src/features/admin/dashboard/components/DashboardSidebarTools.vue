<!-- /src/features/admin/components/dashboard/DashboardSidebarTools.vue -->
<template>
  <div class="flex flex-col gap-4">
    <button
      v-for="tool in filteredTools"
      :key="tool.name"
      :class="[
        'flex items-center gap-2 px-4 py-2 text-left rounded transition group',
        'bg-white text-black dark:bg-black dark:text-white',
        'border border-transparent hover:ring-4 hover:ring-offset-2 focus:outline-none'
      ]"
      :style="{ '--tw-ring-color': accentValue }"
      @click="handleToolClick(tool.action!)"
    >
      <AppIcon :name="tool.icon" :library="tool.library" />
      <span>{{ tool.name }}</span>
    </button>

    <!-- Modal for system logs -->
    <AdminModal
      :visible="isLogsModalOpen"
      @close="isLogsModalOpen = false"
      title="System Logs"
    >
      <p>This is placeholder content for system logs modal.</p>
    </AdminModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import AdminModal from '@/features/admin/components/shared/AdminModal.vue'
import { useDashboardStore } from '@/features/admin/stores/dashboardStore'
import { adminDashboardTools } from '@/features/admin/utils/adminDashboardTools'
import type { DashboardTheme } from '@/features/admin/utils/dashboardThemes'

const props = defineProps<{
  userRole: 'admin' | 'superadmin'
}>()

const dashboardStore = useDashboardStore()

// ✅ Inject theme and access the resolved accent color hex value
const dashboardThemeRef = inject<import('vue').ComputedRef<DashboardTheme | undefined>>('dashboardTheme')
const accentValue = dashboardThemeRef?.value?.accentValue ?? '#3b82f6'

const filteredTools = computed(() =>
  adminDashboardTools.filter(tool =>
    !tool.roles || tool.roles.includes(props.userRole)
  )
)

const isLogsModalOpen = ref(false)

function handleToolClick(action: string) {
  switch (action) {
    case 'viewSystemLogs':
      isLogsModalOpen.value = true
      break
    case 'refreshMetrics':
      dashboardStore.refreshMetrics()
      break
    case 'customizeDashboard':
      dashboardStore.enterCustomize()
      break
    case 'expandAlertsPanel':
      dashboardStore.toggleAlerts()
      break
    default:
      console.log(`Tool clicked: ${action}`)
  }
}
</script>
