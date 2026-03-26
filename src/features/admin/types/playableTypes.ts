export interface PlayableClass {
  id: string
  name: string
  description?: string
  lore?: string
  iconUrl?: string
  isPlayable: boolean

  tags: string[]
  statBonuses: Record<string, number>
  passiveAbilities: string[]

  createdAt: string
  updatedAt: string
}

// full/detail/edit version
export interface PlayableSpecies {
  id: string
  name: string
  description?: string
  lore?: string
  iconUrl?: string
  isPlayable: boolean

  tags: string[]
  statBonuses: Record<string, number>
  passiveAbilities: string[]

  createdAt: string
  updatedAt: string
}

// list/table/lightweight version
export interface PlayableSpeciesBrowseItem {
  id: string
  name: string
  slug: string
  displayName: string
  description: string | null
  iconMediaAssetId: string | null
  isActive: boolean | null
  sortOrder: number | null
  createdAt: string | null
  updatedAt: string | null
}