export type GearCategory = 'footwear' | 'pack' | 'poles' | 'apparel' | 'lamp' | 'nav'

export type GearItem = {
  id: string
  name: string
  category: GearCategory
  icon: string
  levelRequired: number
  coinsCost: number
  perk: string
  description: string
}

export type EquippedGearSlots = {
  footwear: string
  pack: string
  poles: string
  apparel: string
  lamp: string
  nav: string
}

export type HikerGearData = {
  unlockedGears: string[]
  equippedGears: EquippedGearSlots
}
