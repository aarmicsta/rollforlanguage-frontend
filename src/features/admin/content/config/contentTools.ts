/**
 * =========================================================
 * Content Tools Config
 * =========================================================
 *
 * Declarative sidebar tool definitions for the Content admin
 * domain.
 *
 * Notes
 * - This first-pass config is intentionally small
 * - Tools are grouped by active content domain
 * - Actions remain stub-friendly for now
 * =========================================================
 */

import type { ContentDomain } from '@/features/admin/content/stores/contentStore'

export interface ContentTool {
  name: string
  action: string
}

export const contentTools: Record<ContentDomain, ContentTool[]> = {
  creatures: [
    {
      name: 'Create Creature',
      action: 'createCreature',
    },
    {
      name: 'Creature Table',
      action: 'editCreatures',
    },
  ],
  items: [
    {
      name: 'Create Item',
      action: 'createItem',
    },
    {
      name: 'Item Table',
      action: 'editItems',
    },
  ],
}