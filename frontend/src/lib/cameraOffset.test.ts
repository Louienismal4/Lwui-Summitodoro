import test from 'node:test'
import assert from 'node:assert/strict'
import { getCameraOffsetPadding, getMobileCameraOffsetPadding } from './cameraOffset.ts'

test('getCameraOffsetPadding calculates 50% vertical top padding accurately', () => {
  assert.deepEqual(getCameraOffsetPadding(1000), { top: 500 })
  assert.deepEqual(getCameraOffsetPadding(800), { top: 400 })
  assert.deepEqual(getCameraOffsetPadding(768), { top: 384 })
})

test('getCameraOffsetPadding clamps non-positive heights to 0', () => {
  assert.deepEqual(getCameraOffsetPadding(0), { top: 0 })
  assert.deepEqual(getCameraOffsetPadding(-200), { top: 0 })
})

test('getCameraOffsetPadding supports custom fraction', () => {
  assert.deepEqual(getCameraOffsetPadding(1000, 0.4), { top: 400 })
  assert.deepEqual(getCameraOffsetPadding(1000, 0.25), { top: 250 })
})

test('getCameraOffsetPadding rounds fractional pixels to integer', () => {
  assert.deepEqual(getCameraOffsetPadding(777, 0.5), { top: 389 })
})

test('getMobileCameraOffsetPadding calculates docked mini-tracker padding', () => {
  const padding = getMobileCameraOffsetPadding({
    viewportHeight: 844, // iPhone 12/13/14 height
    isSessionActive: true,
    isSheetExpanded: false,
  })
  assert.equal(padding.top, 56)
  assert.equal(padding.bottom, 80)
})

test('getMobileCameraOffsetPadding calculates expanded bottom sheet padding during active session', () => {
  const padding = getMobileCameraOffsetPadding({
    viewportHeight: 800,
    isSessionActive: true,
    isSheetExpanded: true,
  })
  assert.equal(padding.top, 56)
  assert.equal(padding.bottom, 440) // 55% of 800
})

test('getMobileCameraOffsetPadding calculates At Camp bottom sheet padding', () => {
  const expanded = getMobileCameraOffsetPadding({
    viewportHeight: 800,
    isSessionActive: false,
    isSheetExpanded: true,
  })
  assert.equal(expanded.top, 56)
  assert.equal(expanded.bottom, 400) // 50% of 800

  const peeked = getMobileCameraOffsetPadding({
    viewportHeight: 800,
    isSessionActive: false,
    isSheetExpanded: false,
  })
  assert.equal(peeked.top, 56)
  assert.equal(peeked.bottom, 96)
})

test('getMobileCameraOffsetPadding reclaims bottom space when Expedition Prep is hidden', () => {
  const padding = getMobileCameraOffsetPadding({
    viewportHeight: 800,
    isSessionActive: false,
    isSheetExpanded: false,
    isSheetVisible: false,
  })

  assert.deepEqual(padding, { top: 56 })
})

test('getMobileCameraOffsetPadding handles non-positive heights gracefully', () => {
  const padding = getMobileCameraOffsetPadding({
    viewportHeight: -100,
    isSessionActive: true,
    isSheetExpanded: false,
  })
  assert.equal(padding.top, 56)
  assert.equal(padding.bottom, 80)
})
