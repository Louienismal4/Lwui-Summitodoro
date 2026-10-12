import { DURATION_TIERS, type DurationTier } from './rewards.ts'

export function isValidHikeDuration(minutes: number): boolean {
  return Number.isInteger(minutes) && minutes >= 1 && minutes <= 240
}

/**
 * Formats mountain elevation in MASL (Meters Above Sea Level).
 */
export function formatElevation(masl: number): string {
  return `${masl.toLocaleString()} MASL`
}

/**
 * Validates whether a given duration matches a supported Duration Tier.
 */
export function isValidDurationTier(duration: number): duration is DurationTier {
  return (DURATION_TIERS as readonly number[]).includes(duration)
}

/**
 * Maps mountain difficulty to badge variant colors.
 */
export function getDifficultyBadgeVariant(
  difficulty: 'easy' | 'moderate' | 'hard',
): 'easy' | 'moderate' | 'hard' {
  return difficulty
}
