import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DEFAULT_HIKER_SETTINGS,
  loadSettingsFromStorage,
  saveSettingsToStorage,
  validateSettings,
  PRESET_AVATARS,
} from './settings.ts'

// Mock minimal localStorage
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

test('DEFAULT_HIKER_SETTINGS has expected baseline values', () => {
  assert.equal(DEFAULT_HIKER_SETTINGS.defaultDurationMinutes, 30)
  assert.equal(DEFAULT_HIKER_SETTINGS.shortBreakMinutes, 5)
  assert.equal(DEFAULT_HIKER_SETTINGS.longBreakMinutes, 15)
  assert.equal(DEFAULT_HIKER_SETTINGS.autoStartBreaks, true)
  assert.equal(DEFAULT_HIKER_SETTINGS.soundEffectsEnabled, true)
  assert.equal(DEFAULT_HIKER_SETTINGS.autoFollowHiker, true)
  assert.equal(DEFAULT_HIKER_SETTINGS.mapStyle, 'liberty')
})

test('PRESET_AVATARS contains mountaineering badges', () => {
  assert.ok(PRESET_AVATARS.length >= 6)
  assert.ok(PRESET_AVATARS.some((a) => a.emoji === '🥾'))
  assert.ok(PRESET_AVATARS.some((a) => a.emoji === '🏔️'))
})

test('loadSettingsFromStorage falls back to default settings when empty or invalid', () => {
  const storage = createMockStorage()
  const settings = loadSettingsFromStorage(storage)
  assert.deepEqual(settings, DEFAULT_HIKER_SETTINGS)

  storage.setItem('summitodoro:settings', 'invalid-json')
  const fallbackSettings = loadSettingsFromStorage(storage)
  assert.deepEqual(fallbackSettings, DEFAULT_HIKER_SETTINGS)
})

test('saveSettingsToStorage persists updated settings and load retrieves them', () => {
  const storage = createMockStorage()
  const custom = {
    ...DEFAULT_HIKER_SETTINGS,
    defaultDurationMinutes: 50,
    soundEffectsVolume: 40,
    mapStyle: 'outdoors' as const,
  }

  saveSettingsToStorage(custom, storage)
  const loaded = loadSettingsFromStorage(storage)
  assert.equal(loaded.defaultDurationMinutes, 50)
  assert.equal(loaded.soundEffectsVolume, 40)
  assert.equal(loaded.mapStyle, 'outdoors')
})

test('validateSettings clamps numeric ranges and defaults missing fields', () => {
  const validated = validateSettings({
    defaultDurationMinutes: 999, // Should clamp to max 180
    soundEffectsVolume: -10, // Should clamp to min 0
    shortBreakMinutes: 1, // Should clamp to min 2
  })

  assert.equal(validated.defaultDurationMinutes, 180)
  assert.equal(validated.soundEffectsVolume, 0)
  assert.equal(validated.shortBreakMinutes, 2)
  assert.equal(validated.autoStartBreaks, DEFAULT_HIKER_SETTINGS.autoStartBreaks)
})
