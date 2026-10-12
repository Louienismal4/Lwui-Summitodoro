export type MapStyleOption = 'liberty' | 'outdoors' | 'bright'
export type TerrainTiltOption = 'flat' | 'angled' | 'dramatic'
export type SoundscapeOption = 'nature' | 'lofi' | 'silent'

export type HikerSettings = {
  // Focus & Expedition Defaults
  defaultDurationMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  autoStartBreaks: boolean
  autoResumeAscent: boolean

  // Audio & Soundscape
  soundEffectsEnabled: boolean
  soundEffectsVolume: number // 0 - 100
  ambientSound: SoundscapeOption
  defaultStreamIndex: number

  // Map & Webpage Display
  mapStyle: MapStyleOption
  terrain3DPitch: TerrainTiltOption
  autoFollowHiker: boolean
  batterySaver: boolean

  // Notifications
  browserNotifications: boolean
}

export type PresetAvatar = {
  id: string
  emoji: string
  title: string
  description: string
}
