import { formatRemainingTime } from './formatTime.ts'

export interface MiniTrackerDisplayState {
  remainingFormatted: string
  compactRemaining: string
  progressPercentage: number
}

/**
 * Validates whether a viewport width qualifies as a mobile device.
 *
 * @param width Viewport width in pixels
 * @param breakpoint Mobile threshold in pixels (defaults to 768)
 */
export function isMobileViewport(width: number, breakpoint = 768): boolean {
  return width < breakpoint
}

/**
 * Returns compact time string for mobile screens (MM:SS, or H:MM:SS if >= 1hr).
 */
export function formatMiniTrackerTime(remainingMs: number): string {
  const totalSeconds = Math.ceil(Math.max(0, remainingMs) / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const mm = minutes.toString().padStart(2, '0')
  const ss = seconds.toString().padStart(2, '0')

  if (hours > 0) {
    return `${hours}:${mm}:${ss}`
  }
  return `${mm}:${ss}`
}

/**
 * Returns formatted mission title for display in the mobile mini-tracker,
 * defaulting to the mountain ascent if no mission was set.
 */
export function formatMiniTrackerMission(
  missionTitle?: string,
  mountainName?: string,
): string {
  const trimmed = missionTitle?.trim()
  if (trimmed) return trimmed
  if (mountainName) return `${mountainName} Ascent`
  return 'Expedition Ascent'
}

/**
 * Derives display stats for the mobile mini-tracker.
 */
export function getMiniTrackerDisplayState(
  remainingMs: number,
  durationMinutes: number,
): MiniTrackerDisplayState {
  const totalMs = Math.max(1, durationMinutes * 60_000)
  const safeRemainingMs = Math.max(0, remainingMs)
  const elapsedMs = Math.max(0, totalMs - safeRemainingMs)
  const rawProgress = Math.min(1, elapsedMs / totalMs)
  const progressPercentage = Math.min(100, Math.max(0, Math.round(rawProgress * 100)))

  return {
    remainingFormatted: formatRemainingTime(safeRemainingMs),
    compactRemaining: formatMiniTrackerTime(safeRemainingMs),
    progressPercentage,
  }
}



/**
 * Evaluates whether a downward swipe should trigger collapsing a bottom sheet.
 *
 * @param deltaY Vertical touch translation in pixels (positive = down)
 * @param velocityY Optional vertical velocity (positive = down)
 * @param threshold Pixels threshold (defaults to 50px)
 */
export function shouldTriggerSheetCollapse(
  deltaY: number,
  velocityY = 0,
  threshold = 50,
): boolean {
  if (velocityY > 0.5) return true
  return deltaY > threshold
}

/**
 * Evaluates whether an upward swipe should trigger expanding a bottom sheet.
 *
 * @param deltaY Vertical touch translation in pixels (negative = up)
 * @param velocityY Optional vertical velocity (negative = up)
 * @param threshold Pixels threshold (defaults to 50px)
 */
export function shouldTriggerSheetExpand(
  deltaY: number,
  velocityY = 0,
  threshold = 50,
): boolean {
  if (velocityY < -0.5) return true
  return deltaY < -threshold
}
