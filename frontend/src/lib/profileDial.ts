/**
 * Mathematical calculations and formatting helpers for the Corner Profile Dial.
 */

export type LevelProgress = {
  level: number
  currentLevelExp: number
  nextLevelExp: number
  progressPercent: number
  isGuest: boolean
}

export type ProfileDialSource = {
  displayName?: string | null
  level?: number
  exp?: number
  isGuest: boolean
  avatarUrl?: string | null
}

export type VisibleArcDash = {
  circumference: number
  visibleArcLength: number
  progressLength: number
  strokeDasharray: string
  strokeDashoffset: number
}

export type ProfileDialTooltip = {
  displayName: string
  rankText: string
  expText: string
  progressPercent: number
  isGuest: boolean
}

/**
 * Calculates modulo Exp progress toward the next mountaineer level and derives rank.
 * Level progression is 1,000 Exp per level.
 */
export function calculateLevelProgress(
  exp: number = 0,
  level?: number,
  isGuest: boolean = false,
): LevelProgress {
  if (isGuest) {
    return {
      level: 1,
      currentLevelExp: 0,
      nextLevelExp: 1000,
      progressPercent: 0,
      isGuest: true,
    }
  }

  const safeExp = Math.max(0, Math.floor(exp))
  const derivedLevel = Math.max(1, Math.floor(safeExp / 1000) + 1)
  const finalLevel = Math.max(derivedLevel, Math.floor(level ?? 1))
  const currentLevelExp = safeExp % 1000
  const nextLevelExp = 1000
  const progressPercent =
    currentLevelExp === 0
      ? 0
      : Math.min(99, Math.floor((currentLevelExp / nextLevelExp) * 100))

  return {
    level: finalLevel,
    currentLevelExp,
    nextLevelExp,
    progressPercent,
    isGuest: false,
  }
}

/**
 * Formats the badge text attached to the dial rim (e.g. "Lv. 3" or "Guest").
 */
export function formatProfileDialBadge(
  source: Pick<ProfileDialSource, 'isGuest' | 'level' | 'exp'>,
): string {
  const progress = calculateLevelProgress(source.exp ?? 0, source.level, source.isGuest)
  if (progress.isGuest) {
    return 'Guest'
  }
  return `Lv. ${progress.level}`
}

/**
 * Generates descriptive accessibility label for screen readers.
 */
export function formatProfileDialAriaLabel(source: ProfileDialSource): string {
  const name = source.displayName?.trim() || 'Hiker'
  const progress = calculateLevelProgress(source.exp ?? 0, source.level, source.isGuest)
  if (progress.isGuest) {
    return `${name} - Guest Hiker. Click to open Hiker settings and profile.`
  }

  return `${name} - Level ${progress.level}, ${progress.currentLevelExp} of ${progress.nextLevelExp} Exp (${progress.progressPercent}%). Click to open Hiker settings and profile.`
}

/**
 * Determines if an avatar URL is an image source (HTTP, relative path, or data URI).
 */
export function isImageAvatar(url: string | null | undefined): boolean {
  if (!url) return false
  const trimmed = url.trim()
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:image/')
  )
}

/**
 * Resolves the avatar emoji or returns the mountaineer fallback '🥾'.
 */
export function getAvatarEmoji(url: string | null | undefined): string {
  if (!url || !url.trim()) return '🥾'
  return url.trim()
}

/**
 * Calculates SVG stroke dasharray and offset for the visible perimeter arc (default 270° / 75%).
 * When progress is 0%, strokeDashoffset equals visibleArcLength (empty stroke).
 * When progress is 100%, strokeDashoffset is 0 (full stroke covering visible arc).
 */
export function calculateVisibleArcDash(
  radius: number,
  progressPercent: number,
  arcAngle: number = 270,
): VisibleArcDash {
  const safeRadius = Math.max(0, radius)
  const clampedProgress = Math.min(100, Math.max(0, progressPercent))
  const circumference = 2 * Math.PI * safeRadius
  const visibleArcLength = circumference * (arcAngle / 360)
  const progressLength = visibleArcLength * (clampedProgress / 100)
  const strokeDashoffset = visibleArcLength - progressLength

  return {
    circumference,
    visibleArcLength,
    progressLength,
    strokeDasharray: `${visibleArcLength} ${circumference}`,
    strokeDashoffset,
  }
}

/**
 * Generates an SVG path 'd' string sweeping along the visible 75% arc
 * from the bottom viewport cut-off around to the left viewport cut-off.
 */
export function calculateVisibleArcPath(
  radius: number = 44,
  center: number = 48,
): string {
  const startX = center
  const startY = center + radius
  const endX = center - radius
  const endY = center
  return `M ${startX} ${startY} A ${radius} ${radius} 0 1 0 ${endX} ${endY}`
}

/**
 * Formats structured tooltip metrics for the interactive hover HUD.
 */
export function formatProfileDialTooltip(
  source: ProfileDialSource,
): ProfileDialTooltip {
  const name = source.displayName?.trim() || 'Hiker'
  const rankText = formatProfileDialBadge(source)
  const progress = calculateLevelProgress(source.exp ?? 0, source.level, source.isGuest)

  if (progress.isGuest) {
    return {
      displayName: name,
      rankText,
      expText: '0 / 1000 Exp (0%)',
      progressPercent: 0,
      isGuest: true,
    }
  }

  return {
    displayName: name,
    rankText,
    expText: `${progress.currentLevelExp} / ${progress.nextLevelExp} Exp (${progress.progressPercent}%)`,
    progressPercent: progress.progressPercent,
    isGuest: false,
  }
}
