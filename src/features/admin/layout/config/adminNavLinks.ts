import { AppRouteNames, AppRoutePaths } from '@/router/routes'

export interface AdminNavLink {
  name: string       // Display label
  routeName: string  // From AppRouteNames
  path: string       // From AppRoutePaths
  icon: string       // Icon name (Lucide, Heroicons, Iconify name)
  library?: 'lucide' | 'heroicons' | 'iconify'  // Optional: icon library (defaults to lucide)
}

export const adminNavLinks: AdminNavLink[] = [
  {
    name: 'Dashboard',
    routeName: AppRouteNames.AdminDashboard,
    path: AppRoutePaths.AdminDashboard,
    icon: 'LayoutDashboard',
    library: 'lucide',
  },
  {
    name: 'Users',
    routeName: AppRouteNames.AdminUsers,
    path: AppRoutePaths.AdminUsers,
    icon: 'Users',
    library: 'lucide',
  },
  {
    name: 'Campaigns',
    routeName: AppRouteNames.AdminCampaigns,
    path: AppRoutePaths.AdminCampaigns,
    icon: 'mdi:sword-cross',
    library: 'iconify',
  },
  {
    name: 'Playables',
    routeName: AppRouteNames.AdminPlayables,
    path: AppRoutePaths.AdminPlayables,
    icon: 'lucide:shield-plus',
    library: 'iconify',
  },
  {
    name: 'Content',
    routeName: AppRouteNames.AdminContent,
    path: AppRoutePaths.AdminContent,
    icon: 'BookOpenIcon',
    library: 'heroicons',
  },
  {
    name: 'System',
    routeName: AppRouteNames.AdminSystem,
    path: AppRoutePaths.AdminSystem,
    icon: 'ServerCog',
    library: 'lucide',
  },
]
