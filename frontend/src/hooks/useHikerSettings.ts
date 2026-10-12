import { useState, useEffect, useCallback } from 'react'
import type { HikerSettings } from '@/types/settings'
import {
  loadSettingsFromStorage,
  saveSettingsToStorage,
  validateSettings,
} from '@/lib/settings'

const SETTINGS_CHANGE_EVENT = 'summitodoro:settings-changed'

export function useHikerSettings() {
  const [settings, setSettings] = useState<HikerSettings>(() => loadSettingsFromStorage())

  // Broadcast settings change to other components and tabs
  const broadcastChange = useCallback((updated: HikerSettings) => {
    saveSettingsToStorage(updated)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(SETTINGS_CHANGE_EVENT, { detail: updated }),
      )
    }
  }, [])

  // Listen to external or cross-tab settings updates
  useEffect(() => {
    const handleCustomChange = (e: Event) => {
      const custom = e as CustomEvent<HikerSettings>
      if (custom.detail) {
        setSettings(custom.detail)
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'summitodoro:settings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as Partial<HikerSettings>
          setSettings(validateSettings(parsed))
        } catch {
          // Ignore invalid parse
        }
      }
    }

    window.addEventListener(SETTINGS_CHANGE_EVENT, handleCustomChange)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener(SETTINGS_CHANGE_EVENT, handleCustomChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const updateSetting = useCallback(
    <K extends keyof HikerSettings>(key: K, value: HikerSettings[K]) => {
      setSettings((prev) => {
        const next = validateSettings({ ...prev, [key]: value })
        broadcastChange(next)
        return next
      })
    },
    [broadcastChange],
  )

  return {
    settings,
    updateSetting,
  }
}
