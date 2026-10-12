import { useState, useCallback, useEffect } from 'react'
import type { GearItem, GearCategory } from '@/types/gear'
import {
  GEAR_CATALOG,
  canUnlockGear,
  unlockGear,
  equipGear,
  calculateLoadoutPerks,
  loadGearsFromStorage,
  saveGearsToStorage,
} from '@/lib/gear'
import type { HikerProfile } from './useHikerProfile'

export function useHikerGears(
  profile: HikerProfile,
  onUpdateProfile: (updates: Partial<Pick<HikerProfile, 'coins'>>) => void,
) {
  const [gearsData, setGearsData] = useState(() => loadGearsFromStorage())
  const [selectedGearId, setSelectedGearId] = useState<string>(
    () => gearsData.equippedGears.footwear || 'boots-basic',
  )
  const [activeCategory, setActiveCategory] = useState<GearCategory | 'all'>('all')

  useEffect(() => {
    saveGearsToStorage(localStorage, gearsData)
  }, [gearsData])

  const selectedGear = GEAR_CATALOG.find((g) => g.id === selectedGearId) || GEAR_CATALOG[0]

  const isUnlocked = useCallback(
    (gearId: string) => gearsData.unlockedGears.includes(gearId),
    [gearsData.unlockedGears],
  )

  const isEquipped = useCallback(
    (gear: GearItem) => gearsData.equippedGears[gear.category] === gear.id,
    [gearsData.equippedGears],
  )

  const checkCanUnlock = useCallback(
    (gear: GearItem) => canUnlockGear(gear, profile, gearsData.unlockedGears),
    [profile, gearsData.unlockedGears],
  )

  const handleUnlock = useCallback(
    (gear: GearItem) => {
      const check = canUnlockGear(gear, profile, gearsData.unlockedGears)
      if (!check.allowed) return false

      const result = unlockGear(gear, profile, gearsData.unlockedGears)
      onUpdateProfile({ coins: result.coins })

      const newEquipped = equipGear(gear, gearsData.equippedGears)
      setGearsData({
        unlockedGears: result.unlockedGears,
        equippedGears: newEquipped,
      })
      return true
    },
    [profile, gearsData, onUpdateProfile],
  )

  const handleEquip = useCallback(
    (gear: GearItem) => {
      if (!gearsData.unlockedGears.includes(gear.id)) return false

      setGearsData((prev) => ({
        ...prev,
        equippedGears: equipGear(gear, prev.equippedGears),
      }))
      return true
    },
    [gearsData.unlockedGears],
  )

  const activePerks = calculateLoadoutPerks(gearsData.equippedGears)

  const filteredCatalog = activeCategory === 'all'
    ? GEAR_CATALOG
    : GEAR_CATALOG.filter((g) => g.category === activeCategory)

  return {
    gearsData,
    selectedGear,
    setSelectedGearId,
    activeCategory,
    setActiveCategory,
    filteredCatalog,
    activePerks,
    isUnlocked,
    isEquipped,
    checkCanUnlock,
    handleUnlock,
    handleEquip,
  }
}
