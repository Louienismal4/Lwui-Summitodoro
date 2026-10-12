import { useMemo } from 'react'
import { Check, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRemainingTime } from '@/lib/formatTime'
import {
  getMilestoneMarkers,
  isMilestoneReached,
  getTooltipAlignmentClass,
  type MilestoneMarker,
} from '@/lib/restBreak'
import type { TrailCheckpoint } from '@/types/trail'
import type { SessionStatus } from '@/hooks/useFocusSession'

export type UltraThinCheckpointLineProps = {
  checkpoints: TrailCheckpoint[]
  progress: number
  durationMinutes: number
  sessionStatus: SessionStatus
}

function getNodePipClasses(isReached: boolean, isSummit: boolean): string {
  if (isSummit && isReached) {
    return 'bg-[#2ecc71] border-[#f1c40f] ring-2 ring-[#0c1810] shadow-[0_0_8px_rgba(46,204,113,0.8)]'
  }
  if (isReached) {
    return 'bg-[#0aa256] border-[#2ecc71] ring-2 ring-[#0c1810]'
  }
  return 'bg-[#1b261f] border-[#384e3e] group-hover:border-[#0aa256]'
}

function getMarkerIcon(isReached: boolean, isSummit: boolean) {
  if (isSummit) {
    return <Flag className="size-3 text-[#f1c40f]" />
  }
  if (isReached) {
    return <Check className="size-3 text-[#0aa256]" />
  }
  return <span className="size-1.5 rounded-full bg-[#0aa256]" />
}

export function UltraThinCheckpointLine({
  checkpoints,
  progress,
  durationMinutes,
  sessionStatus,
}: UltraThinCheckpointLineProps) {
  const totalDurationMs = durationMinutes * 60_000

  const markers = useMemo(
    () => getMilestoneMarkers(checkpoints),
    [checkpoints],
  )

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 h-1 bg-[#141d16] border-t border-[#233326]"
      aria-label="Expedition checkpoint progress line"
    >
      {/* 4px Filled Progress Bar */}
      <div
        className="h-full bg-[#0aa256] transition-all duration-300 shadow-[0_0_10px_rgba(10,162,86,0.65)]"
        style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Ascent progress"
      />

      {/* Segment Divider Ticks */}
      {markers.map((marker) => {
        if (marker.progress <= 0 || marker.progress >= 1) return null
        return (
          <div
            key={`tick-${marker.id}`}
            className="absolute top-0 bottom-0 w-[1px] bg-[#0c130d] z-10 pointer-events-none"
            style={{ left: `${marker.progress * 100}%` }}
          />
        )
      })}

      {/* Interactive Milestone Nodes with Hover Tooltips */}
      <div className="absolute inset-0 pointer-events-none">
        {markers.map((marker: MilestoneMarker) => {
          const isReached = marker.isSummit
            ? sessionStatus === 'completed'
            : isMilestoneReached(marker.progress, progress)
          const elapsedMs = totalDurationMs * marker.progress
          const remainingMs = Math.max(0, totalDurationMs - elapsedMs)
          const alignmentClass = getTooltipAlignmentClass(marker.progress)

          return (
            <div
              key={marker.id}
              className="absolute top-0 -translate-x-1/2 pointer-events-auto group"
              style={{ left: `${marker.progress * 100}%` }}
            >
              {/* Interactive Target Zone & Node Pip */}
              <button
                type="button"
                tabIndex={0}
                aria-label={`${marker.name}: ${
                  isReached
                    ? 'Reached'
                    : `Unlocks at ${formatRemainingTime(elapsedMs)} elapsed`
                }`}
                className="relative -top-2 flex flex-col items-center justify-center size-5 cursor-pointer outline-none"
              >
                <span
                  className={cn(
                    'size-2.5 rounded-full transition-all duration-200 border',
                    getNodePipClasses(isReached, !!marker.isSummit),
                  )}
                />
              </button>

              {/* Hover Tooltip - Positioned to stay within viewport bounds */}
              <div
                role="tooltip"
                className={cn(
                  'absolute bottom-6 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none transition-all duration-200 translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0 z-40',
                  alignmentClass,
                )}
              >
                <div className="rounded-xl bg-[#111712]/95 border border-[#2c3d30] shadow-2xl p-2.5 text-xs text-[#f5f0e4] backdrop-blur-md min-w-[170px] whitespace-nowrap flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2 border-b border-[#202e24] pb-1">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      {getMarkerIcon(isReached, !!marker.isSummit)}
                      {marker.name}
                    </span>
                    <span
                      className={cn(
                        'text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border',
                        isReached
                          ? 'bg-[#0aa256]/20 text-[#2ecc71] border-[#0aa256]/30'
                          : 'bg-[#1e2a21] text-[#869489] border-[#2c3d30]',
                      )}
                    >
                      {isReached
                        ? 'Reached'
                        : `${Math.round(marker.progress * 100)}%`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8c988e] pt-0.5">
                    <span>{formatRemainingTime(elapsedMs)} elapsed</span>
                    <span>{formatRemainingTime(remainingMs)} left</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
