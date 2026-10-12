import test from 'node:test'
import assert from 'node:assert/strict'
import {
  calculateLevelProgress,
  formatProfileDialBadge,
  formatProfileDialAriaLabel,
  isImageAvatar,
  getAvatarEmoji,
  calculateVisibleArcDash,
  calculateVisibleArcPath,
  formatProfileDialTooltip,
} from './profileDial.ts'

test('calculateLevelProgress returns baseline metrics for Guest Hikers', () => {
  const result = calculateLevelProgress(500, 5, true)
  assert.deepEqual(result, {
    level: 1,
    currentLevelExp: 0,
    nextLevelExp: 1000,
    progressPercent: 0,
    isGuest: true,
  })
})

test('calculateLevelProgress derives rank and modulo Exp for authenticated hikers', () => {
  // Baseline 0 Exp -> Level 1, 0%
  assert.deepEqual(calculateLevelProgress(0, 1, false), {
    level: 1,
    currentLevelExp: 0,
    nextLevelExp: 1000,
    progressPercent: 0,
    isGuest: false,
  })

  // Mid-level 350 Exp -> Level 1, 35%
  assert.deepEqual(calculateLevelProgress(350, 1, false), {
    level: 1,
    currentLevelExp: 350,
    nextLevelExp: 1000,
    progressPercent: 35,
    isGuest: false,
  })

  // 999 Exp boundary: percentage is 99% (not prematurely rounded to 100%)
  assert.deepEqual(calculateLevelProgress(999, 1, false), {
    level: 1,
    currentLevelExp: 999,
    nextLevelExp: 1000,
    progressPercent: 99,
    isGuest: false,
  })

  // Rollover at 1000 Exp -> derived level is 2, 0% progress
  assert.deepEqual(calculateLevelProgress(1000, 1, false), {
    level: 2,
    currentLevelExp: 0,
    nextLevelExp: 1000,
    progressPercent: 0,
    isGuest: false,
  })

  // 2500 Exp -> derived level is 3, 50% progress
  assert.deepEqual(calculateLevelProgress(2500, undefined, false), {
    level: 3,
    currentLevelExp: 500,
    nextLevelExp: 1000,
    progressPercent: 50,
    isGuest: false,
  })

  // Negative Exp clamped to 0
  assert.deepEqual(calculateLevelProgress(-50, 1, false), {
    level: 1,
    currentLevelExp: 0,
    nextLevelExp: 1000,
    progressPercent: 0,
    isGuest: false,
  })
})

test('formatProfileDialBadge formats rank badge deriving from Exp and profile state', () => {
  assert.equal(formatProfileDialBadge({ isGuest: true, level: 1 }), 'Guest')
  assert.equal(formatProfileDialBadge({ isGuest: true, exp: 2500 }), 'Guest')
  assert.equal(formatProfileDialBadge({ isGuest: false, exp: 0 }), 'Lv. 1')
  assert.equal(formatProfileDialBadge({ isGuest: false, exp: 2500 }), 'Lv. 3')
  assert.equal(formatProfileDialBadge({ isGuest: false, level: 8, exp: 0 }), 'Lv. 8')
})

test('formatProfileDialAriaLabel formats accessible text for screen readers', () => {
  // Guest hiker
  const guestLabel = formatProfileDialAriaLabel({
    displayName: 'AlpineGuest',
    level: 1,
    exp: 0,
    isGuest: true,
  })
  assert.equal(
    guestLabel,
    'AlpineGuest - Guest Hiker. Click to open Hiker settings and profile.',
  )

  // Authenticated hiker
  const authLabel = formatProfileDialAriaLabel({
    displayName: 'SummitClimber',
    level: 1,
    exp: 2350,
    isGuest: false,
  })
  assert.equal(
    authLabel,
    'SummitClimber - Level 3, 350 of 1000 Exp (35%). Click to open Hiker settings and profile.',
  )

  // Fallback name when empty string or whitespace
  const fallbackLabel = formatProfileDialAriaLabel({
    displayName: '   ',
    level: 1,
    exp: 0,
    isGuest: false,
  })
  assert.equal(
    fallbackLabel,
    'Hiker - Level 1, 0 of 1000 Exp (0%). Click to open Hiker settings and profile.',
  )
})

test('isImageAvatar identifies image URLs and rejects emojis and whitespace', () => {
  assert.equal(isImageAvatar('https://example.com/avatar.png'), true)
  assert.equal(isImageAvatar('http://example.com/avatar.jpg'), true)
  assert.equal(isImageAvatar('/avatars/climber.png'), true)
  assert.equal(isImageAvatar('data:image/png;base64,abc'), true)
  assert.equal(isImageAvatar('🥾'), false)
  assert.equal(isImageAvatar('🏔️'), false)
  assert.equal(isImageAvatar('   '), false)
  assert.equal(isImageAvatar(null), false)
  assert.equal(isImageAvatar(undefined), false)
})

test('getAvatarEmoji returns emoji or fallback to boots', () => {
  assert.equal(getAvatarEmoji('🏔️'), '🏔️')
  assert.equal(getAvatarEmoji('⛺'), '⛺')
  assert.equal(getAvatarEmoji(''), '🥾')
  assert.equal(getAvatarEmoji('   '), '🥾')
  assert.equal(getAvatarEmoji(null), '🥾')
  assert.equal(getAvatarEmoji(undefined), '🥾')
})

test('calculateVisibleArcDash calculates dasharray and offset for visible 75% arc', () => {
  const radius = 44
  const arcAngle = 270
  const circumference = 2 * Math.PI * radius
  const visibleArcLength = circumference * (arcAngle / 360)

  // 0% progress -> strokeDashoffset equals visibleArcLength, progressLength is 0
  const zero = calculateVisibleArcDash(radius, 0, arcAngle)
  assert.equal(zero.circumference, circumference)
  assert.equal(zero.visibleArcLength, visibleArcLength)
  assert.equal(zero.progressLength, 0)
  assert.equal(zero.strokeDashoffset, visibleArcLength)
  assert.equal(zero.strokeDasharray, `${visibleArcLength} ${circumference}`)

  // 50% progress -> strokeDashoffset is half visibleArcLength
  const half = calculateVisibleArcDash(radius, 50, arcAngle)
  assert.equal(half.progressLength, visibleArcLength * 0.5)
  assert.equal(half.strokeDashoffset, visibleArcLength * 0.5)

  // 100% progress -> strokeDashoffset is 0, progressLength covers entire visible arc
  const full = calculateVisibleArcDash(radius, 100, arcAngle)
  assert.equal(full.progressLength, visibleArcLength)
  assert.equal(full.strokeDashoffset, 0)

  // Clamping: negative progress clamped to 0, overflow clamped to 100
  const negative = calculateVisibleArcDash(radius, -20, arcAngle)
  assert.equal(negative.progressLength, 0)
  assert.equal(negative.strokeDashoffset, visibleArcLength)

  const overflow = calculateVisibleArcDash(radius, 150, arcAngle)
  assert.equal(overflow.progressLength, visibleArcLength)
  assert.equal(overflow.strokeDashoffset, 0)
})

test('calculateVisibleArcPath generates SVG path sweeping from bottom cut-off to left cut-off', () => {
  const path = calculateVisibleArcPath(44, 48)
  assert.equal(path, 'M 48 92 A 44 44 0 1 0 4 48')

  // Defaults to radius 44, center 48
  assert.equal(calculateVisibleArcPath(), 'M 48 92 A 44 44 0 1 0 4 48')
})

test('formatProfileDialTooltip formats structured tooltip metrics for hikers', () => {
  // Authenticated Hiker with mid-level progression
  const climber = formatProfileDialTooltip({
    displayName: 'SummitClimber',
    level: 1,
    exp: 2350,
    isGuest: false,
  })
  assert.deepEqual(climber, {
    displayName: 'SummitClimber',
    rankText: 'Lv. 3',
    expText: '350 / 1000 Exp (35%)',
    progressPercent: 35,
    isGuest: false,
  })

  // Guest Hiker
  const guest = formatProfileDialTooltip({
    displayName: 'GuestHiker',
    level: 1,
    exp: 0,
    isGuest: true,
  })
  assert.deepEqual(guest, {
    displayName: 'GuestHiker',
    rankText: 'Guest',
    expText: '0 / 1000 Exp (0%)',
    progressPercent: 0,
    isGuest: true,
  })

  // Empty or whitespace display name fallback
  const fallback = formatProfileDialTooltip({
    displayName: '   ',
    level: 1,
    exp: 1000,
    isGuest: false,
  })
  assert.equal(fallback.displayName, 'Hiker')
  assert.equal(fallback.rankText, 'Lv. 2')
  assert.equal(fallback.expText, '0 / 1000 Exp (0%)')
})
