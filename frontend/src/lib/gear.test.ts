import test from 'node:test'
import assert from 'node:assert/strict'
import {
  GEAR_CATALOG,
  DEFAULT_UNLOCKED_GEAR_IDS,
  DEFAULT_EQUIPPED_GEAR,
  canUnlockGear,
  unlockGear,
  equipGear,
  getGearById,
  calculateLoadoutPerks,
  loadGearsFromStorage,
  saveGearsToStorage,
  type EquippedGearSlots,
} from './gear.ts'
import type { HikerProfile } from '../hooks/useHikerProfile.ts'

function createMockStorage(): Storage {
  const store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      for (const k of Object.keys(store)) delete store[k]
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
    length: 0,
  }
}

const mockProfile: HikerProfile = {
  displayName: 'Batulao Trekker',
  email: 'trekker@summitodoro.com',
  isGuest: false,
  level: 2,
  exp: 1400,
  coins: 150,
  avatarUrl: '🥾',
  onboardingComplete: true,
}

test('GEAR_CATALOG contains gear items across all categories', () => {
  assert.ok(GEAR_CATALOG.length >= 12)
  const categories = new Set(GEAR_CATALOG.map((g) => g.category))
  assert.ok(categories.has('footwear'))
  assert.ok(categories.has('pack'))
  assert.ok(categories.has('poles'))
  assert.ok(categories.has('apparel'))
  assert.ok(categories.has('lamp'))
  assert.ok(categories.has('nav'))
})

test('getGearById retrieves gear by unique identifier', () => {
  const boots = getGearById('boots-basic')
  assert.ok(boots)
  assert.equal(boots?.name, 'Trail Runners')
  assert.equal(getGearById('non-existent-id'), undefined)
})

test('canUnlockGear validates level and coin requirements', () => {
  const affordableLvl2Gear = GEAR_CATALOG.find((g) => g.levelRequired <= 2 && g.coinsCost <= 150 && g.coinsCost > 0)!
  const lockedHighLvlGear = GEAR_CATALOG.find((g) => g.levelRequired > 2)!
  const expensiveGear = GEAR_CATALOG.find((g) => g.levelRequired <= 2 && g.coinsCost > 50)!

  assert.ok(affordableLvl2Gear, 'Affordable level 2 gear should exist')
  assert.equal(canUnlockGear(affordableLvl2Gear, mockProfile, DEFAULT_UNLOCKED_GEAR_IDS).allowed, true)

  const highLvlCheck = canUnlockGear(lockedHighLvlGear, mockProfile, DEFAULT_UNLOCKED_GEAR_IDS)
  assert.equal(highLvlCheck.allowed, false)
  assert.match(highLvlCheck.reason || '', /level/i)

  const poorProfile = { ...mockProfile, coins: 10 }
  const coinsCheck = canUnlockGear(expensiveGear, poorProfile, DEFAULT_UNLOCKED_GEAR_IDS)
  assert.equal(coinsCheck.allowed, false)
  assert.match(coinsCheck.reason || '', /coins/i)
})

test('unlockGear deducts coins and adds gear ID to unlocked list', () => {
  const gearToUnlock = GEAR_CATALOG.find((g) => g.id === 'pack-guide')!
  const res = unlockGear(gearToUnlock, mockProfile, DEFAULT_UNLOCKED_GEAR_IDS)

  assert.equal(res.coins, mockProfile.coins - gearToUnlock.coinsCost)
  assert.ok(res.unlockedGears.includes(gearToUnlock.id))
})

test('equipGear updates active loadout slot', () => {
  const newPack = GEAR_CATALOG.find((g) => g.id === 'pack-guide')!
  const updated = equipGear(newPack, DEFAULT_EQUIPPED_GEAR)

  assert.equal(updated.pack, 'pack-guide')
  assert.equal(updated.footwear, DEFAULT_EQUIPPED_GEAR.footwear)
})

test('calculateLoadoutPerks returns perks for currently equipped items', () => {
  const perks = calculateLoadoutPerks(DEFAULT_EQUIPPED_GEAR)
  assert.ok(perks.length > 0)
  assert.ok(perks.every((p) => typeof p.perk === 'string' && p.perk.length > 0))
})

test('loadGearsFromStorage and saveGearsToStorage handle serialization gracefully', () => {
  const storage = createMockStorage()
  const initial = loadGearsFromStorage(storage)

  assert.deepEqual(initial.unlockedGears, DEFAULT_UNLOCKED_GEAR_IDS)
  assert.deepEqual(initial.equippedGears, DEFAULT_EQUIPPED_GEAR)

  const customLoadout: EquippedGearSlots = {
    ...DEFAULT_EQUIPPED_GEAR,
    footwear: 'boots-alpine',
  }
  const customUnlocked = [...DEFAULT_UNLOCKED_GEAR_IDS, 'boots-alpine']

  saveGearsToStorage(storage, {
    unlockedGears: customUnlocked,
    equippedGears: customLoadout,
  })

  const loaded = loadGearsFromStorage(storage)
  assert.deepEqual(loaded.equippedGears.footwear, 'boots-alpine')
  assert.ok(loaded.unlockedGears.includes('boots-alpine'))
})
