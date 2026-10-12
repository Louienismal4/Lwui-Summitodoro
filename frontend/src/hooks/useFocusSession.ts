import { useState, useEffect, useRef, useCallback } from 'react'
import { createExpedition, type ExpeditionState, type SummitContext, type SummitOutcome } from '@/lib/expedition'
import type { TrailCheckpoint } from '@/types/trail'

export type { SessionStatus } from '@/lib/expedition'

export type FocusSession = ExpeditionState & {
  setDurationMinutes: (minutes: number) => void
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
}

export type FocusSessionOptions = {
  restStops?: TrailCheckpoint[]
  summitContext?: SummitContext
  onSummit?: (outcome: SummitOutcome) => void
}

export function useFocusSession(
  initialMinutes = 0,
  options?: FocusSessionOptions,
): FocusSession {
  const [expedition] = useState(() => createExpedition(initialMinutes))
  const [state, setState] = useState(expedition.getState)
  const optionsRef = useRef(options)
  useEffect(() => {
    optionsRef.current = options
    expedition.setSummitContext(options?.summitContext)
  })

  useEffect(() => {
    if (options?.onSummit) expedition.deliverSummit(options.onSummit)
  }, [expedition, state.summitOutcome, options?.onSummit])

  const setDurationMinutes = useCallback((minutes: number) => {
    expedition.setDurationMinutes(minutes)
    setState(expedition.getState())
  }, [expedition])

  const start = useCallback(() => {
    expedition.setRestStops(optionsRef.current?.restStops ?? [])
    expedition.start()
    setState(expedition.getState())
  }, [expedition])

  const pause = useCallback(() => {
    expedition.pause()
    setState(expedition.getState())
  }, [expedition])

  const resume = useCallback(() => {
    expedition.resume()
    setState(expedition.getState())
  }, [expedition])

  const reset = useCallback(() => {
    expedition.reset()
    setState(expedition.getState())
  }, [expedition])

  useEffect(() => {
    if (state.status !== 'running') return
    let active = true
    const timerId = window.setInterval(() => {
      if (!active || expedition.getState().status !== 'running') return
      expedition.tick()
      setState(expedition.getState())
      if (expedition.getState().status !== 'running') {
        active = false
        window.clearInterval(timerId)
      }
    }, 250)

    return () => {
      active = false
      window.clearInterval(timerId)
    }
  }, [expedition, state.status])

  return { ...state, setDurationMinutes, start, pause, resume, reset }
}
