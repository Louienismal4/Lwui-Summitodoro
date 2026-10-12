import { useState, useCallback } from 'react'
import {
  Pause,
  Play,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRemainingTime } from '@/lib/formatTime'
import { MobileMiniTracker } from '@/components/hike/MobileMiniTracker'
import type { FocusSession } from '@/hooks/useFocusSession'

export type OnTrailFocusColumnProps = {
  mountainName: string
  missionTitle: string
  session: FocusSession
  onAbandon: () => void
  onExpandChange?: (isExpanded: boolean) => void
}

export function OnTrailFocusColumn({
  mountainName,
  missionTitle,
  session,
  onAbandon,
  onExpandChange,
}: OnTrailFocusColumnProps) {
  const [isConfirmingAbandon, setIsConfirmingAbandon] = useState(false)

  const isRunning = session.status === 'running'
  const isPaused = session.status === 'paused'

  const handleTogglePlayPause = useCallback(() => {
    if (isRunning) {
      session.pause()
    } else if (isPaused) {
      session.resume()
    }
  }, [isRunning, isPaused, session])

  const handleConfirmAbandon = useCallback(() => {
    setIsConfirmingAbandon(false)
    onAbandon()
  }, [onAbandon])

  return (
    <>
      {/* Mobile (< 768px): Anchored Docked Mini-Tracker with Expandable Sheet */}
      <div className="md:hidden">
        <MobileMiniTracker
          mountainName={mountainName}
          missionTitle={missionTitle}
          session={session}
          onAbandon={onAbandon}
          onExpandChange={onExpandChange}
        />
      </div>

      {/* Desktop (>= 768px): Centered Focus Column */}
      <div
        className="active-expedition-hud hidden md:flex absolute inset-x-0 top-20 bottom-0 z-20 pointer-events-none flex-col items-center justify-start px-3 sm:px-4"
        aria-label="Active expedition HUD"
      >

      <div className="w-full max-w-[420px] sm:max-w-[440px] flex flex-col gap-3 sm:gap-3.5">
        {/* Top 25%: Focus Session Timer Card */}
        <section
          className="pointer-events-auto w-full rounded-2xl bg-[#111712]/95 border border-[#27372c] text-[#f5f0e4] shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-md p-4 sm:p-5 flex flex-col gap-3"
          aria-label="Focus timer console"
        >
          {/* Header Row: Status badge & Mountain tag */}
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
                {isRunning ? 'On Trail' : 'Ascent Paused'}
              </span>
            </div>

            <span className="text-[11px] font-semibold text-[#8c988e] truncate max-w-[180px]">
              {mountainName}
            </span>
          </div>

          {/* Centered Countdown Timer Face */}
          <div className="flex flex-col items-center justify-center py-1">
            <span
              className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-white drop-shadow-sm select-none"
              aria-label={`Time remaining: ${formatRemainingTime(session.remainingMs)}`}
            >
              {formatRemainingTime(session.remainingMs)}
            </span>
            <span className="text-[11px] text-[#869489] font-medium mt-1">
              {Math.round(session.progress * 100)}% of ascent completed
            </span>
          </div>

          {/* Progress Bar */}
          <div
            className="h-1.5 w-full bg-[#1b261f] rounded-full overflow-hidden border border-[#26372b]"
            aria-hidden="true"
          >
            <div
              className={cn(
                'h-full transition-all duration-300 rounded-full',
                isRunning ? 'bg-[#0aa256]' : 'bg-[#f39c12]',
              )}
              style={{ width: `${Math.round(session.progress * 100)}%` }}
            />
          </div>

          {/* Controls: Play/Pause and Discreet Abandon Action */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleTogglePlayPause}
              aria-label={isRunning ? 'Pause focus timer' : 'Resume focus timer'}
              className={cn(
                'flex-1 h-9 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.99]',
                isRunning
                  ? 'bg-[#1b261e] hover:bg-[#233227] text-white border border-[#2f4233]'
                  : 'bg-[#0aa256] hover:bg-[#0bb560] text-[#04150b] shadow-[0_0_15px_rgba(10,162,86,0.35)]',
              )}
            >
              {isRunning ? (
                <>
                  <Pause className="size-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="size-3.5 fill-current" />
                  <span>Resume</span>
                </>
              )}
            </button>

            {/* Discreet Abandon Action with Safety Confirmation */}
            {isConfirmingAbandon ? (
              <div className="flex items-center gap-1.5 bg-[#231515] border border-[#4a2222] px-2.5 py-1 rounded-xl animate-in fade-in duration-150">
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
                title="Abandon expedition and return to Camp"
              >
                Abandon Trek
              </button>
            )}
          </div>
        </section>

        {/* Lower 50%: Unobstructed viewing window for Hiker Marker */}
        <div
          className="flex-1 w-full pointer-events-none min-h-[30vh] sm:min-h-[40vh]"
          aria-hidden="true"
        />
      </div>
    </div>
    </>
  )
}
