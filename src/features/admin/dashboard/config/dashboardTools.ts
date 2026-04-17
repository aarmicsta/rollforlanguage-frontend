// /features/admin/utils/adminDashboardTools.ts

export interface AdminDashboardTool {
  name: string
  icon: string
  library?: 'lucide' | 'heroicons' | 'iconify'
  action?: string
  roles?: ('admin' | 'superadmin')[]
  children?: AdminDashboardTool[] // ✅ <-- add this line
}
  
  export const adminDashboardTools: AdminDashboardTool[] = [
    {
      name: 'Refresh Metrics',
      icon: 'RefreshCcw',
      library: 'lucide',
      action: 'refreshMetrics',
      roles: ['admin', 'superadmin'],
    },
    {
      name: 'Customize Dashboard',
      icon: 'Settings',
      library: 'lucide',
      action: 'customizeDashboard',
      roles: ['admin', 'superadmin'],
    },
    {
      name: 'Expand Alerts Panel',
      icon: 'AlertCircle',
      library: 'lucide',
      action: 'expandAlertsPanel',
      roles: ['admin', 'superadmin'],
    },
    {
      name: 'View System Logs',
      icon: 'FileText',
      library: 'lucide',
      action: 'viewSystemLogs',
      roles: ['superadmin'],
    },
  ]
  