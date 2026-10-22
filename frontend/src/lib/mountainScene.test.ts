import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { getMountainPosition, HIKER_WALK_CYCLES, MOUNTAIN_TRAIL } from './mountainScene.ts'

test('mountain hiker follows the trail from trailhead to summit', () => {
  const first = MOUNTAIN_TRAIL[0]
  const last = MOUNTAIN_TRAIL[MOUNTAIN_TRAIL.length - 1]
  assert.deepEqual(getMountainPosition(0), { x: first[0], y: first[1], direction: 'east' })
  assert.deepEqual(getMountainPosition(1), { x: last[0], y: last[1], direction: 'north' })
  const halfway = getMountainPosition(1 / 12)
  assert.equal(halfway.x, (first[0] + MOUNTAIN_TRAIL[1][0]) / 2)
  assert.equal(halfway.y, (first[1] + MOUNTAIN_TRAIL[1][1]) / 2)
})

test('hiker faces the direction of each trail segment, including at turns', () => {
  const expectedDirections = ['east', 'north', 'northwest', 'north', 'east', 'north']
  expectedDirections.forEach((direction, index) => {
    assert.equal(getMountainPosition((index + 0.5) / 6).direction, direction)
    assert.equal(getMountainPosition(index / 6).direction, direction)
  })
})

test('all eight hiker views are scalable SVG assets without the original background', () => {
  for (const direction of ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest']) {
    const svg = readFileSync(new URL(`../../public/images/hiker/${direction}.svg`, import.meta.url), 'utf8')
    assert.match(svg, /viewBox="0 0 128 160"/)
    assert.doesNotMatch(svg, /#F6F6E[EF]/)
  }
})

test('walking cycles cover every trail direction with matching PNG frames', () => {
  assert.deepEqual(Object.keys(HIKER_WALK_CYCLES).sort(), ['east', 'north', 'northeast', 'northwest', 'south', 'southeast', 'southwest', 'west'])
  const usedFrames = new Set<number>()
  for (const { frames } of Object.values(HIKER_WALK_CYCLES)) {
    assert.ok(frames.length >= 2)
    for (const frame of frames) {
      usedFrames.add(frame)
      const png = readFileSync(new URL(`../../public/images/hiker/walking/walking-${String(frame).padStart(2, '0')}.png`, import.meta.url))
      assert.equal(png.subarray(1, 4).toString(), 'PNG')
      assert.equal(png.readUInt32BE(16), 128)
      assert.equal(png.readUInt32BE(20), 192)
    }
  }
  assert.equal(usedFrames.size, 10)
  assert.equal(HIKER_WALK_CYCLES.northeast.mirrored, true)
  assert.equal(HIKER_WALK_CYCLES.southwest.mirrored, true)
})

test('mountain hiker stays on the trail for out-of-range progress', () => {
  assert.deepEqual(getMountainPosition(-1), getMountainPosition(0))
  assert.deepEqual(getMountainPosition(2), getMountainPosition(1))
  assert.deepEqual(getMountainPosition(NaN), getMountainPosition(0))
})
