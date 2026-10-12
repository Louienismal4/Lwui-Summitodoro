import type { HikerSettings, PresetAvatar } from '../types/settings.ts'

export const SETTINGS_STORAGE_KEY = 'summitodoro:settings'

export const DEFAULT_HIKER_SETTINGS: HikerSettings = {
  defaultDurationMinutes: 30,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  autoStartBreaks: true,
  autoResumeAscent: false,
  soundEffectsEnabled: true,
  soundEffectsVolume: 70,
  ambientSound: 'nature',
  defaultStreamIndex: 0,
  mapStyle: 'liberty',
  terrain3DPitch: 'angled',
  autoFollowHiker: true,
  batterySaver: false,
  browserNotifications: false,
}

export const PRESET_AVATARS: PresetAvatar[] = [
  { id: 'boots', emoji: '🥾', title: 'Trail Boots', description: 'Classic summit trekker' },
  { id: 'peak', emoji: '🏔️', title: 'Alpine Peak', description: 'High altitude mountaineer' },
  { id: 'camp', emoji: '⛺', title: 'Basecamp', description: 'Expedition camp master' },
  { id: 'compass', emoji: '🧭', title: 'Brass Compass', description: 'Trail pathfinder & navigator' },
  { id: 'pack', emoji: '🎒', title: 'Expedition Pack', description: 'Long distance endurance hiker' },
  { id: 'pine', emoji: '🌲', title: 'Mountain Pine', description: 'Forest canopy seeker' },
  { id: 'eagle', emoji: '🦅', title: 'Highland Eagle', description: 'Ridge soarer & visionary' },
  { id: 'climber', emoji: '🧗', title: 'Rock Climber', description: 'Vertical face specialist' },
  { id: 'lantern', emoji: '🔦', title: 'Night Trekker', description: 'Dawn ascent lanternbearer' },
  { id: 'fox', emoji: '🦊', title: 'Trail Fox', description: 'Agile & swift peak bagger' },
]

export function validateSettings(input: Partial<HikerSettings>): HikerSettings {
  const defaultDuration =
    typeof input.defaultDurationMinutes === 'number'
      ? Math.max(10, Math.min(180, Math.round(input.defaultDurationMinutes)))
      : DEFAULT_HIKER_SETTINGS.defaultDurationMinutes

  const shortBreak =
    typeof input.shortBreakMinutes === 'number'
      ? Math.max(2, Math.min(30, Math.round(input.shortBreakMinutes)))
      : DEFAULT_HIKER_SETTINGS.shortBreakMinutes

  const longBreak =
    typeof input.longBreakMinutes === 'number'
      ? Math.max(5, Math.min(60, Math.round(input.longBreakMinutes)))
      : DEFAULT_HIKER_SETTINGS.longBreakMinutes

  const sfxVolume =
    typeof input.soundEffectsVolume === 'number'
      ? Math.max(0, Math.min(100, Math.round(input.soundEffectsVolume)))
      : DEFAULT_HIKER_SETTINGS.soundEffectsVolume

  return {
    ...DEFAULT_HIKER_SETTINGS,
    ...input,
    defaultDurationMinutes: defaultDuration,
    shortBreakMinutes: shortBreak,
    longBreakMinutes: longBreak,
    soundEffectsVolume: sfxVolume,
  }
}

export function loadSettingsFromStorage(storage?: Storage): HikerSettings {
  const target = storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined)
  if (!target) return DEFAULT_HIKER_SETTINGS

  try {
    const raw = target.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return DEFAULT_HIKER_SETTINGS
    const parsed = JSON.parse(raw) as Partial<HikerSettings>
    return validateSettings(parsed)
  } catch {
    return DEFAULT_HIKER_SETTINGS
  }
}

export function saveSettingsToStorage(settings: HikerSettings, storage?: Storage): void {
  const target = storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined)
  if (!target) return

  try {
    target.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Ignore quota issues
  }
}
