import test from 'node:test'
import assert from 'node:assert/strict'
import {

  formatMiniTrackerMission,
  formatMiniTrackerTime,
  getMiniTrackerDisplayState,
  isMobileViewport,
  shouldTriggerSheetCollapse,
  shouldTriggerSheetExpand,
} from './responsiveTracker.ts'

test('isMobileViewport detects viewports below breakpoint', () => {
  assert.equal(isMobileViewport(375), true) // iPhone SE
  assert.equal(isMobileViewport(390), true) // iPhone 13/14
  assert.equal(isMobileViewport(767), true)
  assert.equal(isMobileViewport(768), false) // tablet/desktop breakpoint
  assert.equal(isMobileViewport(1024), false)
})

test('formatMiniTrackerMission prioritizes custom mission title', () => {
  assert.equal(
    formatMiniTrackerMission('Finish quarterly budget review', 'Mt. Pulag'),
    'Finish quarterly budget review',
  )
  assert.equal(
    formatMiniTrackerMission('   Refactor auth controller   ', 'Mt. Apo'),
    'Refactor auth controller',
  )
})

test('formatMiniTrackerMission falls back to mountain ascent when title is empty', () => {
  assert.equal(formatMiniTrackerMission('', 'Mt. Batulao'), 'Mt. Batulao Ascent')
  assert.equal(formatMiniTrackerMission('   ', 'Mt. Apo'), 'Mt. Apo Ascent')
  assert.equal(formatMiniTrackerMission(undefined, 'Mt. Guiting-Guiting'), 'Mt. Guiting-Guiting Ascent')
  assert.equal(formatMiniTrackerMission(undefined, undefined), 'Expedition Ascent')
})

test('formatMiniTrackerTime formats time compactly', () => {
  assert.equal(formatMiniTrackerTime(1500000), '25:00')
  assert.equal(formatMiniTrackerTime(750000), '12:30')
  assert.equal(formatMiniTrackerTime(3665000), '1:01:05')
  assert.equal(formatMiniTrackerTime(0), '00:00')
})

test('getMiniTrackerDisplayState calculates remaining time and progress', () => {
  // 25 min total, 1500000ms
  const state = getMiniTrackerDisplayState(750000, 25)
  assert.equal(state.remainingFormatted, '00:12:30')
  assert.equal(state.compactRemaining, '12:30')
  assert.equal(state.progressPercentage, 50)

  // Near summit (<10% remaining / >=90% progress)
  const nearSummit = getMiniTrackerDisplayState(60000, 25)
  assert.equal(nearSummit.compactRemaining, '01:00')
  assert.equal(nearSummit.progressPercentage, 96)
})


test('getMiniTrackerDisplayState clamps progress between 0 and 100', () => {
  const overCompleted = getMiniTrackerDisplayState(-5000, 25)
  assert.equal(overCompleted.remainingFormatted, '00:00:00')
  assert.equal(overCompleted.compactRemaining, '00:00')
  assert.equal(overCompleted.progressPercentage, 100)

  const unstarted = getMiniTrackerDisplayState(1500000, 25)
  assert.equal(unstarted.remainingFormatted, '00:25:00')
  assert.equal(unstarted.compactRemaining, '25:00')
  assert.equal(unstarted.progressPercentage, 0)
})


test('shouldTriggerSheetCollapse detects downward swipe past threshold', () => {
  assert.equal(shouldTriggerSheetCollapse(60), true) // deltaY > 50
  assert.equal(shouldTriggerSheetCollapse(20), false) // deltaY <= 50
  assert.equal(shouldTriggerSheetCollapse(-30), false) // upward swipe
  assert.equal(shouldTriggerSheetCollapse(20, 0.8), true) // fast downward velocity
})

test('shouldTriggerSheetExpand detects upward swipe past threshold', () => {
  assert.equal(shouldTriggerSheetExpand(-60), true) // deltaY < -50
  assert.equal(shouldTriggerSheetExpand(-20), false) // deltaY >= -50
  assert.equal(shouldTriggerSheetExpand(30), false) // downward swipe
  assert.equal(shouldTriggerSheetExpand(-20, -0.8), true) // fast upward velocity
})
