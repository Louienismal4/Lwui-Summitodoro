import test from 'node:test'
import assert from 'node:assert/strict'
import {
  getCurtainCenter,
  calculateCurtainCenterRadius,
  calculateCurtainMaxRadius,
  createCurtainClipPath,
  DEFAULT_CURTAIN_CONFIG,
} from './curtainTransition.ts'

test('getCurtainCenter calculates viewport center accurately', () => {
  const center = getCurtainCenter(1000, 800)
  assert.deepEqual(center, { x: 500, y: 400 })

  const centerHD = getCurtainCenter(1920, 1080)
  assert.deepEqual(centerHD, { x: 960, y: 540 })
})

test('calculateCurtainCenterRadius covers all four corners with buffer', () => {
  // Center of 1000x800: hypot(500, 400) = sqrt(250000 + 160000) = 640.31 -> plus buffer >= 670
  const radius = calculateCurtainCenterRadius(1000, 800)
  assert.ok(radius >= 670)

  // Mobile viewport: 375x667: hypot(187.5, 333.5) ~ 382.4 -> plus buffer >= 410
  const mobileRadius = calculateCurtainCenterRadius(375, 667)
  assert.ok(mobileRadius >= 410)
})

test('calculateCurtainMaxRadius handles arbitrary origins', () => {
  const radius = calculateCurtainMaxRadius({ x: 0, y: 0 }, 1000, 800)
  assert.ok(radius >= 1280)
})

test('createCurtainClipPath generates centered circle clip paths for smooth cover and shrink', () => {
  const radius = 1200

  // 1. Cover starts at middle with 0px
  assert.equal(createCurtainClipPath('cover-start'), 'circle(0px at 50% 50%)')

  // 2. Cover ends at middle with full radius
  assert.equal(createCurtainClipPath('cover-end', null, radius), 'circle(1200px at 50% 50%)')

  // 3. Reveal starts with full covered screen
  assert.equal(createCurtainClipPath('reveal-start', null, radius), 'circle(1200px at 50% 50%)')

  // 4. Reveal shrinks back down to middle (0px)
  assert.equal(createCurtainClipPath('reveal-end'), 'circle(0px at 50% 50%)')
})

test('DEFAULT_CURTAIN_CONFIG has smooth easing curve and balanced duration', () => {
  assert.ok(DEFAULT_CURTAIN_CONFIG.coverDurationSec >= 0.35)
  assert.ok(DEFAULT_CURTAIN_CONFIG.revealDurationSec >= 0.35)
  assert.deepEqual(DEFAULT_CURTAIN_CONFIG.easing, [0.65, 0, 0.35, 1])
})
