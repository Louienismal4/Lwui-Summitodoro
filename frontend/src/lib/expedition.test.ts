import test from 'node:test'
import assert from 'node:assert/strict'
import { createExpedition } from './expedition.ts'
import { EXPEDITION_MOUNTAINS } from '../data/expeditionMountains.ts'

test('summit captures the current mission at completion and stays frozen after edits', () => {
  let now = 0
  const mountain = { ...EXPEDITION_MOUNTAINS[0] }
  const context = {
    mountain, missionTitle: 'Starting mission', completedCheckpointsCount: 0,
    totalCheckpointsCount: 1, isGuest: true,
  }
  const expedition = createExpedition(1, () => now)
  expedition.setSummitContext(context)
  expedition.start()
  assert.equal(expedition.getState().summitOutcome, null)
  context.missionTitle = 'Finished mission'
  context.completedCheckpointsCount = 2
  context.totalCheckpointsCount = 3
  now = 60_000
  expedition.tick()
  const outcome = expedition.getState().summitOutcome
  assert.deepEqual(outcome, {
    mountain: {
      id: 'mt-pinatubo', name: 'Mt. Pinatubo', trailName: 'Route to Mount Pinatubo Crater',
      province: 'Zambales', elevationMasl: 1486,
    },
    missionTitle: 'Finished mission', completedCheckpointsCount: 2,
    totalCheckpointsCount: 3, isGuest: true, durationMinutes: 1,
    rewards: { exp: 5, coins: 1 }, completedAt: '1970-01-01T00:01:00.000Z',
  })
  context.missionTitle = 'Later mission'
  context.completedCheckpointsCount = 0
  context.totalCheckpointsCount = 0
  context.isGuest = false
  mountain.name = 'Later mountain'
  expedition.tick()
  expedition.pause()
  expedition.resume()
  expedition.setDurationMinutes(45)
  assert.strictEqual(expedition.getState().summitOutcome, outcome)
  assert.equal(outcome?.missionTitle, 'Finished mission')
  assert.equal(outcome?.completedCheckpointsCount, 2)
  assert.equal(outcome?.totalCheckpointsCount, 3)
  assert.equal(outcome?.mountain.name, 'Mt. Pinatubo')
  assert.equal(outcome?.isGuest, true)
  assert.ok(Object.isFrozen(outcome))
  assert.ok(Object.isFrozen(outcome?.mountain))
  assert.ok(Object.isFrozen(outcome?.rewards))
})

test('summit capture is separate from delivery and delivery occurs once per expedition', () => {
  let now = 0
  const expedition = createExpedition(45, () => now)
  expedition.setSummitContext({
    mountain: EXPEDITION_MOUNTAINS[0], missionTitle: 'Finish work',
    completedCheckpointsCount: 1, totalCheckpointsCount: 1, isGuest: false,
  })
  const delivered: unknown[] = []
  const deliver = () => expedition.deliverSummit((outcome) => {
    delivered.push(outcome)
    expedition.deliverSummit(() => assert.fail('reentrant delivery'))
  })
  deliver()
  expedition.start()
  deliver()
  now = 2_700_000
  expedition.tick()
  const first = expedition.getState().summitOutcome
  assert.deepEqual(first?.rewards, { exp: 225, coins: 23 })
  assert.deepEqual(delivered, [], 'capture must not invoke saving')
  deliver()
  expedition.tick()
  deliver()
  deliver()
  assert.deepEqual(delivered, [first])

  expedition.reset()
  assert.equal(expedition.getState().summitOutcome, null)
  deliver()
  expedition.setDurationMinutes(1)
  expedition.start()
  now += 60_000
  expedition.pause()
  const second = expedition.getState().summitOutcome
  assert.notStrictEqual(second, first)
  assert.equal(second?.durationMinutes, 1)
  deliver()
  deliver()
  assert.deepEqual(delivered, [first, second])
})

test('abandonment has no summit delivery and restarting captures a fresh completion', () => {
  let now = 0
  const expedition = createExpedition(1, () => now)
  expedition.setSummitContext({
    mountain: EXPEDITION_MOUNTAINS[0], missionTitle: 'Abandoned mission',
    completedCheckpointsCount: 0, totalCheckpointsCount: 1, isGuest: true,
  })
  expedition.start()
  now = 30_000
  expedition.pause()
  expedition.reset()
  now = 120_000
  expedition.tick()
  assert.equal(expedition.getState().summitOutcome, null)
  expedition.deliverSummit(() => assert.fail('abandoned summit delivery'))

  expedition.setDurationMinutes(1)
  expedition.start()
  expedition.setSummitContext({
    mountain: EXPEDITION_MOUNTAINS[1], missionTitle: 'Restarted mission',
    completedCheckpointsCount: 2, totalCheckpointsCount: 2, isGuest: false,
  })
  now += 60_000
  expedition.tick()
  const delivered: unknown[] = []
  expedition.deliverSummit((outcome) => delivered.push(outcome))
  assert.equal(delivered.length, 1)
  assert.equal(expedition.getState().summitOutcome?.missionTitle, 'Restarted mission')
  assert.equal(expedition.getState().summitOutcome?.mountain.name, 'Mt. Ulap')
})

const REST_STOPS = [
  { id: 'pine-ridge', name: 'Pine Ridge', description: 'Canopy opens', progress: 0.3 },
  { id: 'grassland', name: 'Grassland View', progress: 0.7 },
]

test('expiry takes precedence over every missed rest stop during ticks and manual pauses', () => {
  for (const elapsedMs of [600_000, 720_000]) {
    for (const observe of ['tick', 'pause'] as const) {
      let now = 0
      const expedition = createExpedition(10, () => now)
      expedition.setRestStops(REST_STOPS)
      expedition.start()
      now = elapsedMs
      expedition[observe]()
      assert.equal(expedition.getState().status, 'completed')
      assert.equal(expedition.getState().remainingMs, 0)
      assert.equal(expedition.getState().progress, 1)
      assert.equal(expedition.getState().activeRestStop, null)
      expedition.resume()
      expedition.tick()
      assert.equal(expedition.getState().status, 'completed')
      assert.equal(expedition.getState().activeRestStop, null)
    }
  }
})

test('abandonment and return to camp clear all rest state and allow stops to prompt again', () => {
  let now = 0
  const expedition = createExpedition(10, () => now)
  expedition.setRestStops(REST_STOPS)
  const staleTick = expedition.tick
  for (const resetFrom of ['rest', 'running', 'manual pause', 'completed']) {
    expedition.setDurationMinutes(10)
    expedition.start()
    now += 180_000
    expedition.tick()
    assert.deepEqual(expedition.getState().activeRestStop, REST_STOPS[0])
    if (resetFrom !== 'rest') expedition.resume()
    if (resetFrom === 'manual pause') expedition.pause()
    if (resetFrom === 'completed') {
      now += 600_000
      expedition.tick()
      assert.equal(expedition.getState().status, 'completed')
    }
    expedition.reset()
    now += 600_000
    staleTick()
    expedition.resume()
    assert.equal(expedition.getState().status, 'idle')
    assert.equal(expedition.getState().durationMinutes, 0)
    assert.equal(expedition.getState().remainingMs, 0)
    assert.equal(expedition.getState().progress, 0)
    assert.equal(expedition.getState().activeRestStop, null)
    expedition.setDurationMinutes(10)
    expedition.start()
    staleTick()
    assert.equal(expedition.getState().status, 'running')
    assert.equal(expedition.getState().remainingMs, 600_000)
    assert.equal(expedition.getState().activeRestStop, null)
    expedition.reset()
  }
})

test('preparation selects the new route while active and completed expeditions retain their rest stops', () => {
  let now = 0
  const expedition = createExpedition(10, () => now)
  const otherStops = [{ id: 'other-route', name: 'Other route stop', progress: 0.2 }]
  expedition.setRestStops(REST_STOPS)
  expedition.setRestStops(otherStops)
  expedition.start()
  expedition.setRestStops(REST_STOPS)
  now = 120_000
  expedition.tick()
  assert.deepEqual(expedition.getState().activeRestStop, otherStops[0])
  expedition.setRestStops(REST_STOPS)
  expedition.resume()
  now = 480_000
  expedition.tick()
  assert.equal(expedition.getState().status, 'running')
  assert.equal(expedition.getState().activeRestStop, null)
  now = 600_000
  expedition.tick()
  expedition.setRestStops(REST_STOPS)
  expedition.reset()
  expedition.setDurationMinutes(10)
  expedition.start()
  now = 720_000
  expedition.tick()
  assert.deepEqual(expedition.getState().activeRestStop, otherStops[0])
  expedition.reset()
  expedition.setRestStops(REST_STOPS)
  expedition.setDurationMinutes(10)
  expedition.start()
  now = 900_000
  expedition.tick()
  assert.deepEqual(expedition.getState().activeRestStop, REST_STOPS[0])
})

test('manual pause observes focus time without creating or acknowledging a rest prompt', () => {
  let now = 0
  const expedition = createExpedition(10, () => now)
  expedition.setRestStops(REST_STOPS)
  expedition.start()
  now = 180_000
  expedition.pause()
  assert.equal(expedition.getState().status, 'paused')
  assert.equal(expedition.getState().activeRestStop, null)
  assert.equal(expedition.getState().remainingMs, 420_000)
  now = 900_000
  expedition.tick()
  expedition.pause()
  assert.equal(expedition.getState().remainingMs, 420_000)
  assert.equal(expedition.getState().activeRestStop, null)
  expedition.resume()
  assert.equal(expedition.getState().status, 'paused')
  assert.deepEqual(expedition.getState().activeRestStop, REST_STOPS[0])
  assert.equal(expedition.getState().remainingMs, 420_000)
  expedition.resume()
  assert.equal(expedition.getState().status, 'running')
  assert.equal(expedition.getState().activeRestStop, null)
})

test('a delayed observation retains eight elapsed minutes and presents unsorted missed stops in route order', () => {
  let now = 0
  const expedition = createExpedition(10, () => now)
  const unsortedStops = [REST_STOPS[1], REST_STOPS[0]]
  expedition.setRestStops(unsortedStops)
  expedition.start()
  now = 480_000
  expedition.tick()
  assert.equal(expedition.getState().status, 'paused')
  assert.deepEqual(expedition.getState().activeRestStop, REST_STOPS[0])
  assert.equal(expedition.getState().remainingMs, 120_000)
  assert.equal(expedition.getState().progress, 0.8)
  assert.deepEqual(unsortedStops, [REST_STOPS[1], REST_STOPS[0]])

  now = 1_080_000
  expedition.resume()
  assert.equal(expedition.getState().status, 'paused')
  assert.deepEqual(expedition.getState().activeRestStop, REST_STOPS[1])
  assert.equal(expedition.getState().remainingMs, 120_000)
  assert.equal(expedition.getState().progress, 0.8)
  now = 1_680_000
  expedition.resume()
  expedition.tick()
  assert.equal(expedition.getState().status, 'running')
  assert.equal(expedition.getState().activeRestStop, null)
  assert.equal(expedition.getState().remainingMs, 120_000)
  now = 1_740_000
  expedition.tick()
  assert.equal(expedition.getState().status, 'running')
  assert.equal(expedition.getState().activeRestStop, null)
  assert.equal(expedition.getState().remainingMs, 60_000)
})

test('reached rest stops pause once each and resuming clears the prompt without counting rest time', () => {
  let now = 0
  const expedition = createExpedition(10, () => now)
  expedition.setRestStops(REST_STOPS)
  expedition.start()
  now = 180_000
  expedition.tick()
  assert.equal(expedition.getState().status, 'paused')
  assert.deepEqual(expedition.getState().activeRestStop, REST_STOPS[0])
  assert.equal(expedition.getState().remainingMs, 420_000)

  now = 600_000
  expedition.tick()
  expedition.pause()
  assert.equal(expedition.getState().remainingMs, 420_000)
  assert.deepEqual(expedition.getState().activeRestStop, REST_STOPS[0])
  expedition.resume()
  expedition.resume()
  expedition.tick()
  assert.equal(expedition.getState().status, 'running')
  assert.equal(expedition.getState().activeRestStop, null)
  assert.equal(expedition.getState().remainingMs, 420_000)

  now = 840_000
  expedition.tick()
  assert.equal(expedition.getState().status, 'paused')
  assert.deepEqual(expedition.getState().activeRestStop, REST_STOPS[1])
  assert.equal(expedition.getState().remainingMs, 180_000)
  now = 1_200_000
  expedition.resume()
  expedition.tick()
  assert.equal(expedition.getState().status, 'running')
  assert.equal(expedition.getState().activeRestStop, null)
  now = 1_380_000
  expedition.tick()
  assert.equal(expedition.getState().status, 'completed')
  assert.equal(expedition.getState().activeRestStop, null)
})

test('preparation starts unselected and only valid whole-minute durations can start', () => {
  const expedition = createExpedition()
  assert.deepEqual(expedition.getState(), {
    status: 'idle', durationMinutes: 0, durationMs: 0, remainingMs: 0, progress: 0,
    activeRestStop: null, summitOutcome: null,
  })
  expedition.start()
  assert.equal(expedition.getState().status, 'idle')

  for (const minutes of [0, -1, 241, 1.5, NaN, Infinity, -Infinity]) {
    expedition.setDurationMinutes(30)
    expedition.setDurationMinutes(minutes)
    expedition.start()
    assert.equal(expedition.getState().status, 'idle', String(minutes))
    assert.equal(expedition.getState().durationMinutes, 0)
  }

  for (const minutes of [1, 37, 240]) {
    expedition.setDurationMinutes(minutes)
    expedition.start()
    assert.deepEqual(expedition.getState(), {
      status: 'running', durationMinutes: minutes, durationMs: minutes * 60_000,
      remainingMs: minutes * 60_000, progress: 0,
      activeRestStop: null, summitOutcome: null,
    })
    expedition.reset()
  }
})

test('delayed ticks retain elapsed focus time and expiry completes the ascent', () => {
  let now = 0
  const expedition = createExpedition(0, () => now)
  expedition.setDurationMinutes(10)
  expedition.start()
  now = 480_000
  expedition.tick()
  assert.deepEqual(expedition.getState(), {
    status: 'running', durationMinutes: 10, durationMs: 600_000,
    remainingMs: 120_000, progress: 0.8,
    activeRestStop: null, summitOutcome: null,
  })
  now = 700_000
  expedition.tick()
  assert.deepEqual(expedition.getState(), {
    status: 'completed', durationMinutes: 10, durationMs: 600_000,
    remainingMs: 0, progress: 1,
    activeRestStop: null, summitOutcome: null,
  })
  expedition.tick()
  expedition.start()
  expedition.setDurationMinutes(30)
  assert.equal(expedition.getState().status, 'completed')
  assert.equal(expedition.getState().durationMinutes, 10)
})

test('manual pause observes time between ticks and resume excludes paused time', () => {
  let now = 0
  const expedition = createExpedition(0, () => now)
  expedition.pause()
  expedition.resume()
  assert.equal(expedition.getState().status, 'idle')
  expedition.setDurationMinutes(2)
  expedition.start()
  now = 30_000
  expedition.start()
  expedition.resume()
  expedition.setDurationMinutes(240)
  expedition.pause()
  assert.deepEqual(expedition.getState(), {
    status: 'paused', durationMinutes: 2, durationMs: 120_000,
    remainingMs: 90_000, progress: 0.25,
    activeRestStop: null, summitOutcome: null,
  })
  now = 300_000
  expedition.pause()
  expedition.tick()
  expedition.start()
  expedition.setDurationMinutes(0)
  assert.equal(expedition.getState().remainingMs, 90_000)
  assert.equal(expedition.getState().durationMinutes, 2)
  expedition.resume()
  now = 330_000
  expedition.resume()
  expedition.tick()
  assert.equal(expedition.getState().remainingMs, 60_000)
  assert.equal(expedition.getState().progress, 0.5)
  now = 390_000
  expedition.pause()
  expedition.resume()
  assert.equal(expedition.getState().status, 'completed')
  assert.equal(expedition.getState().remainingMs, 0)
  assert.equal(expedition.getState().progress, 1)
})

test('abandonment and return to camp clear timing and permit an independent expedition', () => {
  let now = 0
  const expedition = createExpedition(0, () => now)
  for (const resetFrom of ['running', 'paused', 'completed']) {
    expedition.setDurationMinutes(1)
    expedition.start()
    now += 15_000
    expedition.tick()
    if (resetFrom === 'paused') expedition.pause()
    if (resetFrom === 'completed') {
      now += 60_000
      expedition.tick()
    }
    assert.equal(expedition.getState().status, resetFrom)
    expedition.reset()
    now += 600_000
    expedition.tick()
    expedition.pause()
    expedition.resume()
    expedition.start()
    assert.deepEqual(expedition.getState(), {
      status: 'idle', durationMinutes: 0, durationMs: 0, remainingMs: 0, progress: 0,
      activeRestStop: null, summitOutcome: null,
    })
    expedition.reset()
  }
  expedition.setDurationMinutes(2)
  expedition.start()
  expedition.tick()
  assert.equal(expedition.getState().remainingMs, 120_000)
  now += 60_000
  expedition.tick()
  assert.equal(expedition.getState().remainingMs, 60_000)
  assert.equal(expedition.getState().progress, 0.5)
  now += 60_000
  expedition.tick()
  assert.equal(expedition.getState().status, 'completed')
})

test('a backward wall-clock adjustment cannot increase remaining time or rewind progress', () => {
  let now = 100_000
  const expedition = createExpedition(0, () => now)
  expedition.setDurationMinutes(1)
  expedition.start()
  now = 90_000
  expedition.tick()
  assert.equal(expedition.getState().remainingMs, 60_000)
  assert.equal(expedition.getState().progress, 0)
  now = 130_000
  expedition.tick()
  assert.equal(expedition.getState().remainingMs, 30_000)
  now = 110_000
  expedition.tick()
  assert.equal(expedition.getState().remainingMs, 30_000)
  assert.equal(expedition.getState().progress, 0.5)
})
