// /features/admin/stores/dashboardStore.ts

import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    isCustomizeMode: false,
    isAlertsExpanded: false,
    lastRefreshTimestamp: Date.now(), // optional: for tracking refresh triggers
  }),

  actions: {
    enterCustomize() {
      this.isCustomizeMode = true
    },
    exitCustomize() {
      this.isCustomizeMode = false
    },
    toggleAlerts() {
      this.isAlertsExpanded = !this.isAlertsExpanded
    },
    refreshMetrics() {
      // This action can simply update a timestamp or trigger logic
      this.lastRefreshTimestamp = Date.now()
      console.log('Dashboard metrics refresh triggered')
    },
  },
})
