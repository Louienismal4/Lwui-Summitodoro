import { useState, useCallback, useMemo, useRef } from 'react'
import {
  Pause,
  Play,
  Compass,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRemainingTime } from '@/lib/formatTime'
import {
  formatMiniTrackerMission,
  getMiniTrackerDisplayState,
  shouldTriggerSheetCollapse,
} from '@/lib/responsiveTracker'
import type { FocusSession } from '@/hooks/useFocusSession'

export type MobileMiniTrackerProps = {
  mountainName: string
  missionTitle: string
  session: FocusSession
  onAbandon: () => void
  onExpandChange?: (isExpanded: boolean) => void
}

export function MobileMiniTracker({
  mountainName,
  missionTitle,
  session,
  onAbandon,
  onExpandChange,
}: MobileMiniTrackerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isConfirmingAbandon, setIsConfirmingAbandon] = useState(false)

  const touchStartYRef = useRef<number | null>(null)
  const touchStartTimeRef = useRef<number>(0)

  const isRunning = session.status === 'running'
  const isPaused = session.status === 'paused'

  const trackerState = useMemo(
    () => getMiniTrackerDisplayState(session.remainingMs, session.durationMinutes),
    [session.remainingMs, session.durationMinutes],
  )

  const displayMission = useMemo(
    () => formatMiniTrackerMission(missionTitle, mountainName),
    [missionTitle, mountainName],
  )

  const handleSetExpanded = useCallback(
    (expanded: boolean) => {
      setIsExpanded(expanded)
      onExpandChange?.(expanded)
      if (!expanded) {
        setIsConfirmingAbandon(false)
      }
    },
    [onExpandChange],
  )

  const handleTogglePlayPause = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation()
      if (isRunning) {
        session.pause()
      } else if (isPaused) {
        session.resume()
      }
    },
    [isRunning, isPaused, session],
  )

  const handleConfirmAbandon = useCallback(() => {
    setIsConfirmingAbandon(false)
    handleSetExpanded(false)
    onAbandon()
  }, [handleSetExpanded, onAbandon])

  // Touch handlers for swiping down to collapse expanded sheet
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY
    touchStartTimeRef.current = Date.now()
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartYRef.current === null) return
      const deltaY = e.changedTouches[0].clientY - touchStartYRef.current
      const deltaTime = Math.max(1, Date.now() - touchStartTimeRef.current)
      const velocityY = deltaY / deltaTime

      if (shouldTriggerSheetCollapse(deltaY, velocityY, 40)) {
        handleSetExpanded(false)
      }
      touchStartYRef.current = null
    },
    [handleSetExpanded],
  )

  return (
    <>
      {/* Semi-transparent backdrop when expanded */}
      {isExpanded && (
        <button
          type="button"
          className="fixed inset-0 z-35 bg-black/50 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200 border-0 cursor-default"
          onClick={() => handleSetExpanded(false)}
          aria-label="Dismiss sheet overlay"
        />
      )}

      {/* 1. DOCKED MINI-TRACKER (Anchored at bottom during active session) */}
      {!isExpanded && (
        <aside
          className="fixed bottom-2.5 left-2.5 right-2.5 z-30 pointer-events-auto max-w-md mx-auto"
          aria-label="Mobile hike mini-tracker"
        >
          <div className="w-full rounded-2xl bg-[#111712]/95 border border-[#27372c] text-[#f5f0e4] shadow-[0_10px_35px_rgba(0,0,0,0.65)] backdrop-blur-md px-3.5 py-2.5 flex items-center justify-between gap-3 hover:border-[#38503e] transition-all">
            {/* Left/Center: Timer + Mission summary (semantic button trigger) */}
            <button
              type="button"
              onClick={() => handleSetExpanded(true)}
              className="flex items-center gap-3 min-w-0 flex-1 text-left bg-transparent border-0 p-0 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#0aa256] group"
              aria-label={`Open hike manager for ${mountainName}. Remaining: ${trackerState.compactRemaining}`}
            >
              {/* Running Status Dot + Time */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="relative flex size-2.5">
                  {isRunning && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#0aa256] opacity-75 animate-ping" />
                  )}
                  <span
                    className={cn(
                      'relative inline-flex size-2.5 rounded-full',
                      isRunning ? 'bg-[#0aa256]' : 'bg-[#f39c12]',
                    )}
                  />
                </span>

                <div className="flex flex-col">
                  <span
                    className="font-mono text-base font-bold text-white tracking-tight leading-none"
                    aria-label={`Remaining time: ${trackerState.compactRemaining}`}
                  >
                    {trackerState.compactRemaining}
                  </span>
                  <span className="text-[9px] text-[#869489] font-medium leading-tight mt-0.5">
                    {trackerState.progressPercentage}% done
                  </span>
                </div>
              </div>

              {/* Subtle vertical divider */}
              <div className="h-7 w-[1px] bg-[#223326] shrink-0" aria-hidden="true" />

              {/* Mission label */}
              <div className="min-w-0 flex-1 flex flex-col justify-center">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#7e8c81] truncate">
                  {mountainName}
                </span>
                <span className="text-xs font-semibold text-[#e0e7e2] truncate group-hover:text-white transition-colors">
                  {displayMission}
                </span>
              </div>
            </button>

            {/* Right: Pause toggle + Expand chevron */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleTogglePlayPause}
                aria-label={isRunning ? 'Pause session' : 'Resume session'}
                className={cn(
                  'size-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95',
                  isRunning
                    ? 'bg-[#1b261e] hover:bg-[#25362a] text-[#2ecc71] border border-[#2f4233]'
                    : 'bg-[#0aa256] hover:bg-[#0bb560] text-[#04150b] shadow-[0_0_12px_rgba(10,162,86,0.4)]',
                )}
              >
                {isRunning ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSetExpanded(true)}
                aria-label="Expand hike manager"
                className="size-8 rounded-lg flex items-center justify-center text-[#7e8c81] hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
              >
                <ChevronUp className="size-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 2. EXPANDED LIGHTWEIGHT SHEET (Timer controls or abandon) */}
      {isExpanded && (
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Expedition timer manager"
          className="fixed inset-x-0 bottom-0 z-40 max-h-[82dvh] rounded-t-3xl bg-[#111712]/98 border-t border-[#27372c] text-[#f5f0e4] shadow-[0_-16px_50px_rgba(0,0,0,0.8)] backdrop-blur-lg flex flex-col animate-in slide-in-from-bottom duration-250"
        >
          {/* Grab Handle Header for swiping down */}
          <button
            type="button"
            className="w-full flex flex-col items-center pt-3 pb-1 cursor-grab active:cursor-grabbing select-none bg-transparent border-0 outline-none focus-visible:ring-1 focus-visible:ring-[#0aa256]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => handleSetExpanded(false)}
            aria-label="Collapse timer manager"
          >
            <span className="w-12 h-1.5 rounded-full bg-[#394a3d] hover:bg-[#506856] transition-colors" />
          </button>

          {/* Sheet Header Row */}
          <header
            className="px-4 pb-2.5 pt-1 flex items-center justify-between border-b border-[#213025]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Compass className="size-4 text-[#0aa256] shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7e8c81] block">
                  {mountainName} Ascent
                </span>
                <h3 className="text-sm font-bold text-white truncate">
                  {displayMission}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSetExpanded(false)}
              aria-label="Close timer manager"
              className="size-8 rounded-full bg-[#1b261f] border border-[#27372c] text-[#869489] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <ChevronDown className="size-4" />
            </button>
          </header>


          {/* Scrollable Sheet Body */}
          <div className="px-4 py-3.5 flex flex-col gap-4 overflow-y-auto max-h-[calc(82dvh-120px)]">
            {/* Timer & Controls Console */}
            <div className="rounded-xl bg-[#17221b] border border-[#243427] p-3.5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex size-2">
                    {isRunning && (
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[#0aa256] opacity-75 animate-ping" />
                    )}
                    <span
                      className={cn(
                        'relative inline-flex size-2 rounded-full',
                        isRunning ? 'bg-[#0aa256]' : 'bg-[#f39c12]',
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-extrabold uppercase tracking-wider',
                      isRunning ? 'text-[#2ecc71]' : 'text-[#f39c12]',
                    )}
                  >
                    {isRunning ? 'On Trail' : 'Paused'}
                  </span>
                </div>

                <span className="text-xs font-mono font-bold text-white">
                  {formatRemainingTime(session.remainingMs)}
                </span>
              </div>

              {/* Progress Bar */}
              <div
                className="h-1.5 w-full bg-[#111913] rounded-full overflow-hidden border border-[#26372b]"
                aria-hidden="true"
              >
                <div
                  className={cn(
                    'h-full transition-all duration-300 rounded-full',
                    isRunning ? 'bg-[#0aa256]' : 'bg-[#f39c12]',
                  )}
                  style={{ width: `${trackerState.progressPercentage}%` }}
                />
              </div>

              {/* Action Buttons: Pause/Resume + Abandon */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTogglePlayPause}
                  aria-label={isRunning ? 'Pause session' : 'Resume session'}

                  className={cn(
                    'flex-1 h-9 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95',
                    isRunning
                      ? 'bg-[#202d24] hover:bg-[#28382d] text-white border border-[#2f4233]'
                      : 'bg-[#0aa256] hover:bg-[#0bb560] text-[#04150b] shadow-[0_0_12px_rgba(10,162,86,0.35)]',
                  )}
                >
                  {isRunning ? (
                    <>
                      <Pause className="size-3.5" />
                      <span>Pause Ascent</span>
                    </>
                  ) : (
                    <>
                      <Play className="size-3.5 fill-current" />
                      <span>Resume Ascent</span>
                    </>
                  )}
                </button>

                {isConfirmingAbandon ? (
                  <div className="flex items-center gap-1.5 bg-[#231515] border border-[#4a2222] px-2.5 py-1 rounded-xl">
                    <AlertTriangle className="size-3 text-[#e74c3c]" />
                    <span className="text-[10px] text-[#e74c3c] font-bold">Abandon?</span>
                    <button
                      type="button"
                      onClick={handleConfirmAbandon}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#e74c3c] text-white font-bold hover:bg-[#c0392b] cursor-pointer"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmingAbandon(false)}
                      className="text-[10px] px-1 text-[#8c988e] hover:text-white cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingAbandon(true)}
                    className="text-[11px] text-[#717e74] hover:text-[#e74c3c] transition-colors px-2 py-1 cursor-pointer font-medium"
                    title="Abandon trek and return to Camp"
                  >
                    Abandon Trek
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  )
}
