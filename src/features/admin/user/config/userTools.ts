// /features/admin/utils/adminUserDashboardTools.ts

import type { AdminDashboardTool } from '../../dashboard/config/dashboardTools'

export const adminUserDashboardTools: AdminDashboardTool[] = [
  // General tools (admin + superadmin)
  {
    name: 'Add User',
    icon: 'UserPlus',
    library: 'lucide',
    action: 'addUser',
    roles: ['admin', 'superadmin'],
  },
  {
    name: 'Search Users',
    icon: 'Search',
    library: 'lucide',
    action: 'searchUsers',
    roles: ['admin', 'superadmin'],
  },
  {
    name: 'Export Users',
    icon: 'Download',
    library: 'lucide',
    action: 'exportUsers',
    roles: ['admin', 'superadmin'],
  },
  {
    name: 'Bulk Actions',
    icon: 'CheckSquare',
    library: 'lucide',
    action: 'bulkActions',
    roles: ['admin', 'superadmin'],
  },

  // Superadmin-only tools
  {
    name: 'Manage Roles',
    icon: 'ShieldCheck',
    library: 'lucide',
    action: 'manageRoles',
    roles: ['superadmin'],
  },
  {
    name: 'View Audit Logs',
    icon: 'ClipboardList',
    library: 'lucide',
    action: 'viewAuditLogs',
    roles: ['superadmin'],
  },
  {
    name: 'Merge Duplicate Users',
    icon: 'Users',
    library: 'lucide',
    action: 'mergeUsers',
    roles: ['superadmin'],
  },
  {
    name: 'Global User Settings',
    icon: 'Settings',
    library: 'lucide',
    action: 'globalUserSettings',
    roles: ['superadmin'],
  },
]
