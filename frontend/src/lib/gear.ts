import type { GearItem, EquippedGearSlots, HikerGearData, GearCategory } from '../types/gear.ts'
import type { HikerProfile } from '../hooks/useHikerProfile.ts'

export type { GearItem, EquippedGearSlots, HikerGearData, GearCategory }

export const GEAR_CATALOG: GearItem[] = [
  // 1. Footwear
  {
    id: 'boots-basic',
    name: 'Trail Runners',
    category: 'footwear',
    icon: '🥾',
    levelRequired: 1,
    coinsCost: 0,
    perk: 'Basic grip on dry trail slopes',
    description: 'Lightweight trail running shoes suitable for beginner day-hikes.',
  },
  {
    id: 'boots-alpine',
    name: 'Cordillera Trekkers',
    category: 'footwear',
    icon: '🥾',
    levelRequired: 1,
    coinsCost: 75,
    perk: '+10% Coins on rocky ridges',
    description: 'High-cut leather boots built for jagged ridges and loose scree.',
  },
  {
    id: 'boots-summit',
    name: 'Gore-Tex Summit Boots',
    category: 'footwear',
    icon: '🏔️',
    levelRequired: 3,
    coinsCost: 180,
    perk: '+20% Coins & mud grip',
    description: 'Waterproof alpine boots engineered for high-altitude ascents.',
  },

  // 2. Backpacks
  {
    id: 'pack-basic',
    name: '15L Summit Daypack',
    category: 'pack',
    icon: '🎒',
    levelRequired: 1,
    coinsCost: 0,
    perk: 'Carries trail water & basic survival kit',
    description: 'Compact daypack for short 25-minute focus climbs.',
  },
  {
    id: 'pack-guide',
    name: '35L Guide Rucksack',
    category: 'pack',
    icon: '🎒',
    levelRequired: 2,
    coinsCost: 120,
    perk: '+15% Exp from focus climbs',
    description: 'Durable multi-pocket pack with hydration bladder support.',
  },
  {
    id: 'pack-expedition',
    name: '55L Expedition Hauler',
    category: 'pack',
    icon: '🧳',
    levelRequired: 4,
    coinsCost: 250,
    perk: '+25% Exp & extended focus stamina',
    description: 'Heavy-duty technical pack fitted for major multi-day summits.',
  },

  // 3. Trekking Poles
  {
    id: 'poles-basic',
    name: 'Bamboo Walking Staff',
    category: 'poles',
    icon: '🦯',
    levelRequired: 1,
    coinsCost: 0,
    perk: 'Traditional Filipino trail support',
    description: 'Sturdy native bamboo staff harvested from Philippine highlands.',
  },
  {
    id: 'poles-aluminum',
    name: 'Telescopic Alloy Poles',
    category: 'poles',
    icon: '🦯',
    levelRequired: 1,
    coinsCost: 60,
    perk: 'Steady rhythm on steep ascents',
    description: 'Twist-lock aluminum poles providing stability on muddy ascents.',
  },
  {
    id: 'poles-carbon',
    name: 'Ultralight Carbon Poles',
    category: 'poles',
    icon: '⚡',
    levelRequired: 3,
    coinsCost: 160,
    perk: 'Pace conservation & endurance boost',
    description: 'Aerospace-grade carbon fiber poles with ergonomic cork grips.',
  },

  // 4. Apparel / Shells
  {
    id: 'apparel-basic',
    name: 'Trail Windbreaker',
    category: 'apparel',
    icon: '🧥',
    levelRequired: 1,
    coinsCost: 0,
    perk: 'Shields against mountain breeze',
    description: 'Packable wind-resistant shell for brisk summit mornings.',
  },
  {
    id: 'apparel-poncho',
    name: 'Ripstop Storm Poncho',
    category: 'apparel',
    icon: '🌧️',
    levelRequired: 2,
    coinsCost: 90,
    perk: 'Shields against sudden tropical downpours',
    description: 'Full-coverage waterproof poncho that fits over hiker and pack.',
  },
  {
    id: 'apparel-summit',
    name: '3-Layer GORE-TEX Shell',
    category: 'apparel',
    icon: '🛡️',
    levelRequired: 4,
    coinsCost: 220,
    perk: 'Maximum protection against gale-force winds',
    description: 'Pro-grade mountaineering hardshell for severe alpine conditions.',
  },

  // 5. Illumination / Headlamps
  {
    id: 'lamp-basic',
    name: 'Pocket Penlight',
    category: 'lamp',
    icon: '🔦',
    levelRequired: 1,
    coinsCost: 0,
    perk: 'Handy for sunset descents',
    description: 'Compact emergency light for finding trail markers in the dusk.',
  },
  {
    id: 'lamp-headlamp',
    name: '350lm Night Headlamp',
    category: 'lamp',
    icon: '💡',
    levelRequired: 2,
    coinsCost: 110,
    perk: 'Hands-free night ascent clarity',
    description: 'Multi-mode rechargeable headlamp with red night-vision LED.',
  },
  {
    id: 'lamp-search',
    name: 'High-Beam Alpine Torch',
    category: 'lamp',
    icon: '🔆',
    levelRequired: 3,
    coinsCost: 200,
    perk: 'Pierces dense ridge fog and clouds',
    description: '1000-lumen tactical beam illuminating up to 200 meters of trail.',
  },

  // 6. Navigation
  {
    id: 'nav-basic',
    name: 'Sun & Landmark Compass',
    category: 'nav',
    icon: '🧭',
    levelRequired: 1,
    coinsCost: 0,
    perk: 'Basic orienting at trail junctions',
    description: 'Analog magnetic compass for landmark navigation.',
  },
  {
    id: 'nav-topo',
    name: 'Baseplate Map Compass',
    category: 'nav',
    icon: '🧭',
    levelRequired: 2,
    coinsCost: 85,
    perk: '+10% Batulao checkpoint tracking',
    description: 'Clear baseplate tool with magnifying lens and roamer scales.',
  },
  {
    id: 'nav-gps',
    name: 'Altimeter Baro-GPS',
    category: 'nav',
    icon: '🛰️',
    levelRequired: 4,
    coinsCost: 240,
    perk: 'Real-time telemetry and contour tracking',
    description: 'Rugged satellite navigator with barometric altimeter.',
  },
]

export const DEFAULT_UNLOCKED_GEAR_IDS: string[] = [
  'boots-basic',
  'pack-basic',
  'poles-basic',
  'apparel-basic',
  'lamp-basic',
  'nav-basic',
]

export const DEFAULT_EQUIPPED_GEAR: EquippedGearSlots = {
  footwear: 'boots-basic',
  pack: 'pack-basic',
  poles: 'poles-basic',
  apparel: 'apparel-basic',
  lamp: 'lamp-basic',
  nav: 'nav-basic',
}

const GEARS_STORAGE_KEY = 'summitodoro:hiker-gears'

export function getGearById(id: string): GearItem | undefined {
  return GEAR_CATALOG.find((g) => g.id === id)
}

export function canUnlockGear(
  gear: GearItem,
  profile: Pick<HikerProfile, 'level' | 'coins'>,
  unlockedGears: string[],
): { allowed: boolean; reason?: string } {
  if (unlockedGears.includes(gear.id)) {
    return { allowed: false, reason: 'Already unlocked' }
  }
  if (profile.level < gear.levelRequired) {
    return {
      allowed: false,
      reason: `Requires Mountaineer Level ${gear.levelRequired}`,
    }
  }
  if (profile.coins < gear.coinsCost) {
    return {
      allowed: false,
      reason: `Requires ${gear.coinsCost} Trail Coins (You have ${profile.coins})`,
    }
  }
  return { allowed: true }
}

export function unlockGear(
  gear: GearItem,
  profile: Pick<HikerProfile, 'coins'>,
  unlockedGears: string[],
): { coins: number; unlockedGears: string[] } {
  return {
    coins: Math.max(0, profile.coins - gear.coinsCost),
    unlockedGears: [...unlockedGears, gear.id],
  }
}

export function equipGear(
  gear: GearItem,
  equipped: EquippedGearSlots,
): EquippedGearSlots {
  return {
    ...equipped,
    [gear.category]: gear.id,
  }
}

export function calculateLoadoutPerks(
  equipped: EquippedGearSlots,
): { category: GearCategory; name: string; perk: string; icon: string }[] {
  return (Object.keys(equipped) as GearCategory[])
    .map((category) => {
      const gearId = equipped[category]
      const item = getGearById(gearId)
      if (!item) return null
      return {
        category,
        name: item.name,
        perk: item.perk,
        icon: item.icon,
      }
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)
}

export function loadGearsFromStorage(storage: Storage = localStorage): HikerGearData {
  try {
    const raw = storage.getItem(GEARS_STORAGE_KEY)
    if (!raw) {
      return {
        unlockedGears: DEFAULT_UNLOCKED_GEAR_IDS,
        equippedGears: DEFAULT_EQUIPPED_GEAR,
      }
    }
    const parsed = JSON.parse(raw)
    return {
      unlockedGears: Array.isArray(parsed.unlockedGears)
        ? Array.from(new Set([...DEFAULT_UNLOCKED_GEAR_IDS, ...parsed.unlockedGears]))
        : DEFAULT_UNLOCKED_GEAR_IDS,
      equippedGears: {
        ...DEFAULT_EQUIPPED_GEAR,
        ...(typeof parsed.equippedGears === 'object' && parsed.equippedGears !== null
          ? parsed.equippedGears
          : {}),
      },
    }
  } catch {
    return {
      unlockedGears: DEFAULT_UNLOCKED_GEAR_IDS,
      equippedGears: DEFAULT_EQUIPPED_GEAR,
    }
  }
}

export function saveGearsToStorage(
  storage: Storage = localStorage,
  data: HikerGearData,
): void {
  try {
    storage.setItem(GEARS_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore storage quota errors
  }
}
