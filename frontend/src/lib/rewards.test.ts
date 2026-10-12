import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateExpeditionRewards, DURATION_TIERS } from './rewards.ts'

test('DURATION_TIERS contains standard duration presets', () => {
  assert.deepEqual(DURATION_TIERS, [30, 45, 60, 120])
})

test('calculateExpeditionRewards returns scaled Exp and Coins for registered hikers', () => {
  // 30 min: 150 Exp, 15 Coins
  assert.deepEqual(calculateExpeditionRewards(30, false), { exp: 150, coins: 15 })

  // 45 min: 225 Exp, 23 Coins (round 22.5 -> 23)
  assert.deepEqual(calculateExpeditionRewards(45, false), { exp: 225, coins: 23 })

  // 60 min: 300 Exp, 30 Coins
  assert.deepEqual(calculateExpeditionRewards(60, false), { exp: 300, coins: 30 })

  // 90 min: 450 Exp, 45 Coins
  assert.deepEqual(calculateExpeditionRewards(90, false), { exp: 450, coins: 45 })

  // 120 min: 600 Exp, 60 Coins
  assert.deepEqual(calculateExpeditionRewards(120, false), { exp: 600, coins: 60 })
})

test('calculateExpeditionRewards returns 0 Exp and 0 Coins for guest hikers', () => {
  assert.deepEqual(calculateExpeditionRewards(30, true), { exp: 0, coins: 0 })
  assert.deepEqual(calculateExpeditionRewards(60, true), { exp: 0, coins: 0 })
})

test('custom minutes use the same reward formula and coin rounding', () => {
  assert.deepEqual(calculateExpeditionRewards(37, false), { exp: 185, coins: 19 })
  assert.deepEqual(calculateExpeditionRewards(1, false), { exp: 5, coins: 1 })
  assert.deepEqual(calculateExpeditionRewards(240, false), { exp: 1200, coins: 120 })
})

test('calculateExpeditionRewards handles 0 and negative durations gracefully', () => {
  assert.deepEqual(calculateExpeditionRewards(0, false), { exp: 0, coins: 0 })
  assert.deepEqual(calculateExpeditionRewards(-15, false), { exp: 0, coins: 0 })
})
