import test from 'node:test'
import assert from 'node:assert/strict'
import {
  shouldTriggerRestBreak,
  getMilestoneMarkers,
  isMilestoneReached,
  getTooltipAlignmentClass,
} from './restBreak.ts'
import type { TrailCheckpoint } from '../types/trail.ts'

const MOCK_CHECKPOINTS: TrailCheckpoint[] = [
  { id: 'cp-1', name: 'Pine Ridge', description: 'Canopy opens', progress: 0.35 },
  { id: 'cp-2', name: 'Grassland View', description: 'Ridge view', progress: 0.7 },
]

test('shouldTriggerRestBreak returns null when progress has not reached any checkpoint', () => {
  const result = shouldTriggerRestBreak(0.2, MOCK_CHECKPOINTS, [])
  assert.equal(result, null)
})

test('shouldTriggerRestBreak detects newly reached checkpoint', () => {
  const result = shouldTriggerRestBreak(0.36, MOCK_CHECKPOINTS, [])
  assert.notEqual(result, null)
  assert.equal(result?.id, 'cp-1')
})

test('shouldTriggerRestBreak ignores checkpoints already triggered', () => {
  const result = shouldTriggerRestBreak(0.4, MOCK_CHECKPOINTS, ['cp-1'])
  assert.equal(result, null)
})

test('shouldTriggerRestBreak detects second checkpoint when progress reaches 0.7', () => {
  const result = shouldTriggerRestBreak(0.72, MOCK_CHECKPOINTS, ['cp-1'])
  assert.notEqual(result, null)
  assert.equal(result?.id, 'cp-2')
})

test('shouldTriggerRestBreak returns null at summit (1.0) because summit has its own victory card', () => {
  const result = shouldTriggerRestBreak(1.0, MOCK_CHECKPOINTS, ['cp-1', 'cp-2'])
  assert.equal(result, null)
})

test('getMilestoneMarkers produces ordered sequence from Trailhead to Summit', () => {
  const markers = getMilestoneMarkers(MOCK_CHECKPOINTS)
  assert.equal(markers.length, 4) // Trailhead, cp-1, cp-2, Summit

  assert.equal(markers[0].id, 'trailhead')
  assert.equal(markers[0].name, 'Trailhead')
  assert.equal(markers[0].progress, 0)

  assert.equal(markers[1].id, 'cp-1')
  assert.equal(markers[1].progress, 0.35)

  assert.equal(markers[2].id, 'cp-2')
  assert.equal(markers[2].progress, 0.7)

  assert.equal(markers[3].id, 'summit')
  assert.equal(markers[3].name, 'Summit')
  assert.equal(markers[3].progress, 1)
})

test('isMilestoneReached verifies milestone completion based on session progress', () => {
  assert.equal(isMilestoneReached(0, 0), true)
  assert.equal(isMilestoneReached(0.35, 0.3), false)
  assert.equal(isMilestoneReached(0.35, 0.35), true)
  assert.equal(isMilestoneReached(0.35, 0.5), true)
  assert.equal(isMilestoneReached(1.0, 0.99), false)
  assert.equal(isMilestoneReached(1.0, 1.0), true)
})

test('shouldTriggerRestBreak evaluates checkpoints in chronological order even when array is unsorted', () => {
  const unsortedCheckpoints: TrailCheckpoint[] = [
    { id: 'cp-2', name: 'Grassland View', progress: 0.7 },
    { id: 'cp-1', name: 'Pine Ridge', progress: 0.35 },
  ]
  // Progress reached 0.8: should trigger the first chronological checkpoint (cp-1) first
  const result = shouldTriggerRestBreak(0.8, unsortedCheckpoints, [])
  assert.equal(result?.id, 'cp-1')
})

test('getTooltipAlignmentClass returns correct classes for edges and center', () => {
  assert.equal(getTooltipAlignmentClass(0), 'left-0 translate-x-0')
  assert.equal(getTooltipAlignmentClass(0.04), 'left-0 translate-x-0')
  assert.equal(getTooltipAlignmentClass(0.5), 'left-1/2 -translate-x-1/2')
  assert.equal(getTooltipAlignmentClass(0.96), 'right-0 translate-x-0')
  assert.equal(getTooltipAlignmentClass(1.0), 'right-0 translate-x-0')
})
