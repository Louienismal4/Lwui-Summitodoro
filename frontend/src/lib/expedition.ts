import { isValidHikeDuration } from './expeditionPrep.ts'
import { calculateExpeditionRewards, type ExpeditionRewards } from './rewards.ts'
import type { ExpeditionMountain } from '../data/expeditionMountains.ts'
import { shouldTriggerRestBreak } from './restBreak.ts'
import type { TrailCheckpoint } from '../types/trail.ts'

export type SessionStatus = 'idle' | 'running' | 'paused' | 'completed'

export type SummitContext = {
  mountain: Readonly<Pick<ExpeditionMountain, 'id' | 'name' | 'trailName' | 'province' | 'elevationMasl'>>
  missionTitle?: string
  completedCheckpointsCount: number
  totalCheckpointsCount: number
  isGuest: boolean
}

export type SummitOutcome = Readonly<SummitContext & {
  durationMinutes: number
  rewards: Readonly<ExpeditionRewards>
  completedAt: string
}>

export type ExpeditionState = {
  status: SessionStatus
  durationMinutes: number
  durationMs: number
  remainingMs: number
  progress: number
  activeRestStop: TrailCheckpoint | null
  summitOutcome: SummitOutcome | null
}

export function createExpedition(initialMinutes = 0, now = Date.now) {
  let state: ExpeditionState = {
    status: 'idle', durationMinutes: 0, durationMs: 0, remainingMs: 0, progress: 0,
    activeRestStop: null,
    summitOutcome: null,
  }
  let startedAt: number | null = null
  let remainingAtStart = 0
  let restStops: TrailCheckpoint[] = []
  const reachedRestStopIds = new Set<string>()
  let summitDelivered = false
  let summitContext: SummitContext | undefined

  function captureSummit(): SummitOutcome | null {
    const context = summitContext
    if (!context) return null
    const { id, name, trailName, province, elevationMasl } = context.mountain
    return Object.freeze({
      ...context,
      mountain: Object.freeze({ id, name, trailName, province, elevationMasl }),
      durationMinutes: state.durationMinutes,
      // The hike journey awards these rewards to guests too; preserve that policy.
      rewards: Object.freeze(calculateExpeditionRewards(state.durationMinutes, false)),
      completedAt: new Date(now()).toISOString(),
    })
  }

  function observeTime() {
    if (state.status !== 'running' || startedAt === null) return
    const remainingMs = Math.min(state.remainingMs, Math.max(0, remainingAtStart - (now() - startedAt)))
    state = {
      ...state,
      status: remainingMs === 0 ? 'completed' : 'running',
      remainingMs,
      progress: (state.durationMs - remainingMs) / state.durationMs,
      summitOutcome: remainingMs === 0 ? captureSummit() : null,
    }
  }

  function tick() {
    observeTime()
    if (state.status !== 'running') return
    const activeRestStop = shouldTriggerRestBreak(state.progress, restStops, reachedRestStopIds)
    if (activeRestStop) {
      reachedRestStopIds.add(activeRestStop.id)
      state = { ...state, status: 'paused', activeRestStop }
      startedAt = null
    }
  }

  function setDurationMinutes(minutes: number) {
    if (state.status !== 'idle') return
    const durationMinutes = isValidHikeDuration(minutes) ? minutes : 0
    const durationMs = durationMinutes * 60_000
    state = { status: 'idle', durationMinutes, durationMs, remainingMs: durationMs, progress: 0, activeRestStop: null, summitOutcome: null }
  }

  setDurationMinutes(initialMinutes)

  return {
    getState: () => state,
    setSummitContext(context: SummitContext | undefined) {
      summitContext = context
    },
    deliverSummit(deliver: (outcome: SummitOutcome) => void) {
      if (!state.summitOutcome || summitDelivered) return
      summitDelivered = true
      deliver(state.summitOutcome)
    },
    setDurationMinutes,
    setRestStops(stops: TrailCheckpoint[]) {
      if (state.status !== 'idle') return
      restStops = [...stops]
    },
    tick,
    start() {
      if (state.status !== 'idle' || !isValidHikeDuration(state.durationMinutes)) return
      startedAt = now()
      remainingAtStart = state.remainingMs
      state = { ...state, status: 'running' }
    },
    pause() {
      if (state.status !== 'running') return
      observeTime()
      if (state.remainingMs === 0) return
      state = { ...state, status: 'paused' }
      startedAt = null
    },
    resume() {
      if (state.status !== 'paused') return
      startedAt = now()
      remainingAtStart = state.remainingMs
      state = { ...state, status: 'running', activeRestStop: null }
      tick()
    },
    reset() {
      startedAt = null
      remainingAtStart = 0
      reachedRestStopIds.clear()
      summitDelivered = false
      state = { ...state, status: 'idle' }
      setDurationMinutes(0)
    },
  }
}
