import test from 'node:test'
import assert from 'node:assert/strict'
import { prepareTrail, getCoordinateAtProgress } from './trailEngine.ts'
import { formatRemainingTime } from './formatTime.ts'
import { getTimedMilestones } from './milestones.ts'
import type { TrailFeature } from '../types/trail.ts'

const mockTrail: TrailFeature = {
  type: 'Feature',
  properties: { id: 'test-trail', name: 'Test Mountain' },
  geometry: {
    type: 'LineString',
    coordinates: [
      [120.0, 15.0],
      [120.1, 15.1],
      [120.2, 15.2],
    ],
  },
}

test('formatTime formats remaining milliseconds correctly', () => {
  assert.equal(formatRemainingTime(0), '00:00:00')
  assert.equal(formatRemainingTime(65_000), '00:01:05')
  assert.equal(formatRemainingTime(3_665_000), '01:01:05')
})

test('prepareTrail calculates distance and uniform samples', () => {
  const prepared = prepareTrail(mockTrail, 10)
  assert.ok(prepared.totalDistanceKm > 0)
  assert.equal(prepared.samples.length, 10)
  assert.deepEqual(prepared.samples[0], [120.0, 15.0])
})

test('prepareTrail rejects geometry with fewer than 2 coordinates', () => {
  const invalidTrail: TrailFeature = {
    type: 'Feature',
    properties: { id: 'invalid', name: 'Invalid' },
    geometry: { type: 'LineString', coordinates: [[120.0, 15.0]] },
  }
  assert.throws(() => prepareTrail(invalidTrail), /at least 2 points/)
})

test('getCoordinateAtProgress clamps and interpolates coordinates accurately', () => {
  const prepared = prepareTrail(mockTrail, 11)
  const start = getCoordinateAtProgress(prepared, 0)
  const end = getCoordinateAtProgress(prepared, 1)
  assert.deepEqual(start, [120.0, 15.0])
  assert.equal(Math.round(end[0] * 10) / 10, 120.2)
  assert.equal(Math.round(end[1] * 10) / 10, 15.2)
})

test('getTimedMilestones calculates proportional milestone times', () => {
  const checkpoints = [
    { id: 'cp1', name: 'Camp 1', progress: 0.25 },
    { id: 'cp2', name: 'Summit', progress: 1.0 },
  ] as const
  const milestones = getTimedMilestones(checkpoints, 60_000)
  assert.equal(milestones[0].elapsedMs, 15_000)
  assert.equal(milestones[0].remainingMs, 45_000)
  assert.equal(milestones[1].elapsedMs, 60_000)
  assert.equal(milestones[1].remainingMs, 0)
})
