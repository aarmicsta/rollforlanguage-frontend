import type { AdminDashboardTool } from '../../dashboard/config/dashboardTools'

export const adminPlayableDashboardTools: AdminDashboardTool[] = [
  {
    name: 'Create',
    icon: 'lucide:plus-square',
    library: 'iconify',
    children: [
      {
        name: 'Playable Class',
        icon: 'mdi:shield-sword',
        library: 'iconify',
        action: 'createClass',
      },
      {
        name: 'Playable Species',
        icon: 'mdi:dna',
        library: 'iconify',
        action: 'createSpecies',
      },
      {
        name: 'Playable Stats',
        icon: 'mdi:chart-timeline-variant',
        library: 'iconify',
        action: 'createStats',
      },
      {
        name: 'Stat Modifiers',
        icon: 'mdi:tune-variant',
        library: 'iconify',
        action: 'createStatModifiers',
      },
      {
        name: 'Playable Passives',
        icon: 'lucide:brain',
        library: 'iconify',
        action: 'createPassives',
      },
    ],
  },
  {
    name: 'Edit',
    icon: 'lucide:list',
    library: 'iconify',
    children: [
      {
        name: 'Class Table',
        icon: 'mdi:table-large',
        library: 'iconify',
        action: 'editClasses',
      },
      {
        name: 'Species Table',
        icon: 'mdi:table-large-plus',
        library: 'iconify',
        action: 'editSpecies',
      },
      {
        name: 'Stats Table',
        icon: 'mdi:table',
        library: 'iconify',
        action: 'editStats',
      },
      {
        name: 'Stat Modifiers Table',
        icon: 'mdi:table-cog',
        library: 'iconify',
        action: 'editStatModifiers',
      },
      {
        name: 'Passives Table',
        icon: 'mdi:table-eye',
        library: 'iconify',
        action: 'editPassives',
      },
    ],
  },
  {
    name: 'Refresh Classes',
    icon: 'lucide:refresh-ccw',
    action: 'refreshClasses',
  },
  {
    name: 'Export Data',
    icon: 'lucide:download',
    action: 'exportClasses',
  },
]