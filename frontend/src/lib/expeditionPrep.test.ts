import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { EXPEDITION_MOUNTAINS } from '../data/expeditionMountains.ts'
import { prepareTrail, getCoordinateAtProgress } from './trailEngine.ts'
import {
  formatElevation,
  isValidHikeDuration,
  isValidDurationTier,
  getDifficultyBadgeVariant,
} from './expeditionPrep.ts'

test('every mountain offered by the picker has a usable trail and image', () => {
  for (const mountain of EXPEDITION_MOUNTAINS) {
    const trailUrl = new URL(`../../public${mountain.trailAssetUrl}`, import.meta.url)
    const trail = prepareTrail(JSON.parse(readFileSync(trailUrl, 'utf8')))
    assert.ok(trail.totalDistanceKm > 0, mountain.name)
    for (const progress of [0, ...mountain.checkpoints.map((checkpoint) => checkpoint.progress), 1]) {
      assert.ok(getCoordinateAtProgress(trail, progress).every(Number.isFinite), mountain.name)
    }
    assert.ok(existsSync(new URL(`../../public${mountain.imagePath}`, import.meta.url)), mountain.name)
  }
})

test('formatElevation formats MASL numbers with commas and suffix', () => {
  assert.equal(formatElevation(1486), '1,486 MASL')
  assert.equal(formatElevation(2926), '2,926 MASL')
  assert.equal(formatElevation(800), '800 MASL')
})

test('isValidDurationTier validates standard duration tiers', () => {
  assert.equal(isValidDurationTier(30), true)
  assert.equal(isValidDurationTier(45), true)
  assert.equal(isValidDurationTier(60), true)
  assert.equal(isValidDurationTier(90), false)
  assert.equal(isValidDurationTier(120), true)
  assert.equal(isValidDurationTier(25), false)
  assert.equal(isValidDurationTier(0), false)
  assert.equal(isValidDurationTier(-30), false)
})

test('hike durations accept only whole minutes from 1 to 240', () => {
  for (const minutes of [1, 30, 37, 45, 60, 90, 120, 240]) {
    assert.equal(isValidHikeDuration(minutes), true, String(minutes))
  }
  for (const minutes of [0, -1, 241, 1.5, NaN, Infinity, -Infinity]) {
    assert.equal(isValidHikeDuration(minutes), false, String(minutes))
  }
})

test('getDifficultyBadgeVariant maps difficulty levels to badge styling keys', () => {
  assert.equal(getDifficultyBadgeVariant('easy'), 'easy')
  assert.equal(getDifficultyBadgeVariant('moderate'), 'moderate')
  assert.equal(getDifficultyBadgeVariant('hard'), 'hard')
})
