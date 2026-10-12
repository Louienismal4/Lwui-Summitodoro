export const DURATION_TIERS = [30, 45, 60, 120] as const

export type DurationTier = (typeof DURATION_TIERS)[number]

export type ExpeditionRewards = {
  exp: number
  coins: number
}

/**
 * Calculates projected Exp and Trail Coins rewards for an expedition.
 * Guest hikers do not accumulate persistent Exp or Coins.
 */
export function calculateExpeditionRewards(
  durationMinutes: number,
  isGuest: boolean,
): ExpeditionRewards {
  if (isGuest || durationMinutes <= 0) {
    return { exp: 0, coins: 0 }
  }

  return {
    exp: Math.round(durationMinutes * 5),
    coins: Math.round(durationMinutes * 0.5),
  }
}
