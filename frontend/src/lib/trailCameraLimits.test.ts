import test from 'node:test'
import assert from 'node:assert/strict'
import { LngLat, LngLatBounds, type Map } from 'maplibre-gl'
import { applyTrailCameraLimits, fitTrailOverview, getTrailFitPadding } from './trailCameraLimits.ts'

test('full-trail overview clears follow padding and resets rotation and tilt', () => {
  const bounds = new LngLatBounds([120, 15], [120.1, 15.2])
  let clearedPadding = false
  let fitted = false
  let fitPadding: ReturnType<typeof getTrailFitPadding> = 80
  const map: Parameters<typeof fitTrailOverview>[0] = {
    getMaxZoom: () => 16,
    setPadding: (padding) => {
      assert.deepEqual(padding, { top: 0, bottom: 0, left: 0, right: 0 })
      clearedPadding = true
      return map as Map
    },
    fitBounds: (trail, options) => {
      assert.ok(clearedPadding)
      assert.equal(trail, bounds)
      assert.deepEqual(options, { padding: fitPadding, maxZoom: 16, bearing: 0, pitch: 0, duration: 650 })
      fitted = true
      return map as Map
    },
  }
  fitTrailOverview(map, bounds)
  assert.ok(fitted)
  fitPadding = getTrailFitPadding({ top: 56, bottom: 400 })
  fitTrailOverview(map, bounds, 650, fitPadding)
})

test('trail camera limits pad the whole route by 10 km and refresh overview zoom', () => {
  let padding: ReturnType<Map['getPadding']> = { top: 400, bottom: 0, left: 0, right: 0 }
  let overviewZoom = 12
  let minZoom = 0
  let constrain: Parameters<Map['setTransformConstrain']>[0]
  let panBounds = new LngLatBounds()
  let fitPadding: ReturnType<typeof getTrailFitPadding> = 80
  const map: Parameters<typeof applyTrailCameraLimits>[0] = {
    getMaxZoom: () => 16,
    getMinZoom: () => minZoom,
    setTransformConstrain: (callback) => { constrain = callback; return map as Map },
    getPadding: () => padding,
    setPadding: (value) => {
      padding = typeof value === 'number'
        ? { top: value, bottom: value, left: value, right: value }
        : { ...padding, ...value }
      return map as Map
    },
    cameraForBounds: (_, options) => {
      assert.deepEqual(padding, { top: 0, bottom: 0, left: 0, right: 0 })
      assert.deepEqual(options, { padding: fitPadding, maxZoom: 16, bearing: 0 })
      return { center: [120, 15], zoom: overviewZoom, bearing: 0 }
    },
    setMinZoom: (zoom) => { minZoom = zoom!; return map as Map },
    setMaxBounds: (bounds) => { panBounds = LngLatBounds.convert(bounds!); return map as Map },
  }
  const trail = new LngLatBounds([120, 15], [120.1, 15.2])
  applyTrailCameraLimits(map, trail)
  assert.equal(minZoom, 11)
  assert.equal(padding.top, 400)
  const southwest = LngLatBounds.fromLngLat(trail.getSouthWest(), 10_000)
  const northeast = LngLatBounds.fromLngLat(trail.getNorthEast(), 10_000)
  assert.equal(panBounds.getWest(), Math.min(southwest.getWest(), northeast.getWest()))
  assert.equal(panBounds.getSouth(), southwest.getSouth())
  assert.equal(panBounds.getEast(), northeast.getEast())
  assert.equal(panBounds.getNorth(), northeast.getNorth())
  assert.ok(constrain)
  const inside = trail.getCenter()
  assert.deepEqual(constrain(inside, 11), { center: inside, zoom: 11 })
  assert.equal(constrain(inside, 0).zoom, 11)
  assert.equal(constrain(inside, 30).zoom, 16)
  assert.deepEqual(constrain(new LngLat(0, 0), 11).center, panBounds.getSouthWest())
  assert.deepEqual(constrain(new LngLat(170, 80), 11).center, panBounds.getNorthEast())

  overviewZoom = 10
  applyTrailCameraLimits(map, new LngLatBounds([121, 16], [121.2, 16.3]))
  assert.equal(minZoom, 9)
  assert.ok(panBounds.getWest() > 120.8)
  fitPadding = getTrailFitPadding({ top: 56, bottom: 400 })
  overviewZoom = 9
  applyTrailCameraLimits(map, trail, fitPadding)
  assert.equal(minZoom, 8)
  assert.equal(padding.top, 400)
})

test('trail fit padding reserves the mobile sheet and keeps desktop framing', () => {
  assert.equal(getTrailFitPadding(), 80)
  assert.equal(getTrailFitPadding({ top: 400 }), 80)
  assert.deepEqual(getTrailFitPadding({ top: 56, bottom: 400 }), {
    top: 72, bottom: 424, left: 24, right: 24,
  })
  assert.deepEqual(getTrailFitPadding({ top: 56, bottom: 80 }), {
    top: 72, bottom: 104, left: 24, right: 24,
  })
})
