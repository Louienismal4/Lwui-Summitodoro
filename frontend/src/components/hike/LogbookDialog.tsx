import {
  BookOpen,
  Mountain,
  Clock,
  Sparkles,
  Coins,
  CheckCircle2,
  Calendar,
  Flag,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatElevation } from '@/lib/expeditionPrep'
import { formatLogbookDate } from '@/lib/logbook'
import type { LogbookEntry, LogbookStats } from '@/lib/logbook'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  entries: LogbookEntry[]
  stats: LogbookStats
}

export function LogbookDialog({
  open,
  onOpenChange,
  entries,
  stats,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-xl w-full bg-[#111712]/95 border border-[#27382c] text-[#f5f0e4] shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-md p-5 sm:p-6 rounded-2xl flex flex-col gap-4">
        {/* Header */}
        <DialogHeader className="text-left flex flex-row items-center gap-3 border-b border-[#202e24] pb-3">
          <div className="size-10 rounded-xl bg-[#1b261f] border border-[#2e4334] flex items-center justify-center text-[#2ecc71] shrink-0">
            <BookOpen className="size-5" />
          </div>
          <div>
            <DialogTitle className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              Hiker Logbook
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#0aa256]/20 text-[#2ecc71] border border-[#0aa256]/30">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#869489] mt-0.5">
              Personal mountaineering journal archiving all conquered peaks and focus sessions.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Aggregate Stats Banner */}
        <div className="grid grid-cols-4 gap-2 bg-[#17221b] border border-[#243428] rounded-xl p-3 text-center">
          <div>
            <span className="text-[9px] uppercase font-bold text-[#869489] block">
              Summits
            </span>
            <strong className="text-sm font-bold text-[#2ecc71] flex items-center justify-center gap-1">
              <Flag className="size-3" />
              {stats.totalSummits}
            </strong>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-[#869489] block">
              Elevation
            </span>
            <strong className="text-xs sm:text-sm font-bold text-white truncate block">
              {stats.totalElevationMasl.toLocaleString()}m
            </strong>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-[#869489] block">
              Focus Time
            </span>
            <strong className="text-xs sm:text-sm font-bold text-white">
              {stats.totalFocusMinutes}m
            </strong>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-[#869489] block">
              Rewards
            </span>
            <strong className="text-xs sm:text-sm font-bold text-[#f1c40f] flex items-center justify-center gap-0.5">
              <Coins className="size-3" />
              {stats.totalCoinsEarned}
            </strong>
          </div>
        </div>

        {/* Scrollable Journal Records */}
        <div className="max-h-[340px] overflow-y-auto space-y-2.5 pr-1 focus-visible:outline-none">
          {entries.length === 0 ? (
            <div className="py-12 px-4 text-center rounded-xl bg-[#141d16]/50 border border-dashed border-[#233327] flex flex-col items-center gap-2">
              <Mountain className="size-8 text-[#4a5f50]" />
              <strong className="text-sm font-semibold text-[#a4b5a8]">
                No expeditions logged yet
              </strong>
              <p className="text-xs text-[#748577] max-w-xs">
                Deploy on the trail and conquer your first summit to record your focus achievements in this journal.
              </p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl bg-[#162019]/90 border border-[#26372b] p-3 flex flex-col gap-2 hover:border-[#344d3b] transition-colors text-left"
              >
                {/* Entry Top Row: Mountain Name, Elevation, Timestamp */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-bold text-white">
                        {entry.mountainName}
                      </strong>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#1e2d22] text-[#869489] border border-[#2b3e30]">
                        {formatElevation(entry.elevation)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#718274] mt-0.5">
                      <Calendar className="size-3" />
                      <span>{formatLogbookDate(entry.completedAt)}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="size-3" />
                        {entry.durationMinutes}m focus
                      </span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-[#0aa256]/20 text-[#2ecc71] border-[#0aa256]/30">
                    ★ Summited
                  </span>
                </div>

                {/* Mission Objective (if present) */}
                {entry.missionTitle && (
                  <div className="text-xs text-[#c9d6cc] bg-[#111813] border border-[#1f2b22] rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-[#2ecc71] shrink-0" />
                    <span className="truncate">{entry.missionTitle}</span>
                  </div>
                )}

                {/* Rewards Gained */}
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#1e2a21]">
                  <span className="text-[10px] text-[#869489] font-medium">
                    Earned
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[#2ecc71] font-semibold">
                      <Sparkles className="size-3" /> +{entry.expEarned} Exp
                    </span>
                    <span className="flex items-center gap-1 text-[#f1c40f] font-semibold">
                      <Coins className="size-3" /> +{entry.coinsEarned} Coins
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Close Button */}
        <div className="border-t border-[#202e24] pt-3 flex justify-end">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 text-xs font-bold bg-[#1d2b21] hover:bg-[#25372a] text-[#f5f0e4] border border-[#2e4334] rounded-xl cursor-pointer"
          >
            Close Journal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
