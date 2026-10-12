import { useState, useEffect, useCallback } from 'react'
import { authService, type AuthUser } from '@/services/auth.service'
import { getAuthToken, clearAuthToken } from '@/services/api'

export type HikerProfile = {
  displayName: string
  email: string | null
  isGuest: boolean
  level: number
  exp: number
  coins: number
  avatarUrl: string | null
  onboardingComplete: boolean
  motto?: string
}

const STORAGE_KEY = 'summitodoro:hiker-profile'

const DEFAULT_PROFILE: HikerProfile = {
  displayName: 'Trail Hiker',
  email: null,
  isGuest: true,
  level: 1,
  exp: 0,
  coins: 50,
  avatarUrl: null,
  onboardingComplete: false,
  motto: 'Focus one step at a time.',
}

export function useHikerProfile() {
  const [profile, setProfile] = useState<HikerProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored) as HikerProfile
      }
    } catch {
      // Fallback on parse error
    }
    return DEFAULT_PROFILE
  })
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(getAuthToken()))

  // Sync to localStorage whenever profile changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    } catch {
      // Ignore quota errors
    }
  }, [profile])

  const setAuthenticatedUser = useCallback((user: AuthUser) => {
    setProfile((prev) => ({
      ...prev,
      displayName: user.name,
      email: user.email,
      exp: typeof user.exp === 'number' ? user.exp : prev.exp,
      coins: typeof user.coins === 'number' ? user.coins : prev.coins,
      level: typeof user.level === 'number' ? user.level : prev.level,
      isGuest: false,
      onboardingComplete: true,
    }))
  }, [])

  // Try to restore user profile from Laravel API if token exists
  useEffect(() => {
    const token = getAuthToken()
    if (!token) return

    let isMounted = true
    authService
      .getProfile()
      .then((user: AuthUser) => {
        if (isMounted) setAuthenticatedUser(user)
      })
      .catch(() => clearAuthToken())
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [setAuthenticatedUser])

  const continueAsGuest = useCallback((guestName: string) => {
    const cleanName = guestName.trim() || 'Guest Hiker'
    setProfile((prev) => ({
      ...prev,
      displayName: cleanName,
      email: null,
      isGuest: true,
      onboardingComplete: true,
    }))
  }, [])

  const login = useCallback(async (email: string, pass: string) => {
    const res = await authService.login(email, pass)
    setAuthenticatedUser(res.user)
    return res
  }, [setAuthenticatedUser])

  const register = useCallback(async (name: string, email: string, pass: string) => {
    const res = await authService.register(name, email, pass)
    setAuthenticatedUser(res.user)
    return res
  }, [setAuthenticatedUser])

  const logout = useCallback(async () => {
    await authService.logout()
    setProfile({
      ...DEFAULT_PROFILE,
      displayName: 'Trail Hiker',
      isGuest: true,
      onboardingComplete: false,
    })
  }, [])

  const updateProfile = useCallback(
    (updates: Partial<Pick<HikerProfile, 'displayName' | 'avatarUrl' | 'motto' | 'coins' | 'exp' | 'level'>>) => {
      setProfile((prev) => ({ ...prev, ...updates }))

      if (!profile.isGuest && getAuthToken()) {
        const apiUpdates: Partial<Pick<AuthUser, 'name' | 'exp' | 'coins' | 'level'>> = {}
        if (typeof updates.displayName === 'string') apiUpdates.name = updates.displayName
        if (typeof updates.exp === 'number') apiUpdates.exp = updates.exp
        if (typeof updates.coins === 'number') apiUpdates.coins = updates.coins
        if (typeof updates.level === 'number') apiUpdates.level = updates.level

        if (Object.keys(apiUpdates).length > 0) {
          authService.updateProfile(apiUpdates).catch(() => {
            // Silently ignore or fallback to local storage
          })
        }
      }
    },
    [profile.isGuest],
  )

  return {
    profile,
    isLoading,
    isGuest: profile.isGuest,
    onboardingComplete: profile.onboardingComplete,
    continueAsGuest,
    login,
    register,
    logout,
    updateProfile,
  }
}
