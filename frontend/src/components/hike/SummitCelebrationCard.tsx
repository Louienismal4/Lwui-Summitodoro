import {
  Flag,
  Mountain,
  Clock,
  Sparkles,
  Coins,
  Tent,
  BookOpen,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatElevation } from '@/lib/expeditionPrep'
import type { ExpeditionMountain } from '@/data/expeditionMountains'
import type { ExpeditionRewards } from '@/lib/rewards'

type Props = {
  mountain: Pick<ExpeditionMountain, 'name' | 'trailName' | 'elevationMasl'>
  durationMinutes: number
  rewards: ExpeditionRewards
  isGuest: boolean
  missionTitle?: string
  completedCheckpointsCount?: number
  totalCheckpointsCount?: number
  onReturnToCamp: () => void
  onViewLogbook: () => void
}

export function SummitCelebrationCard({
  mountain,
  durationMinutes,
  rewards,
  isGuest,
  missionTitle,
  completedCheckpointsCount = 0,
  totalCheckpointsCount = 0,
  onReturnToCamp,
  onViewLogbook,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-20 pointer-events-none flex items-center justify-center p-4 pt-16 pb-20 sm:p-6 sm:pt-20 sm:pb-24 animate-in fade-in-0 duration-300"
      aria-label="Summit Conquered Celebration"
    >
      <div
        className="pointer-events-auto w-full max-w-[440px] max-h-[calc(100vh-140px)] overflow-y-auto rounded-2xl bg-[#111712]/95 border border-[#2e4534] text-[#f5f0e4] shadow-[0_25px_60px_rgba(0,0,0,0.75)] backdrop-blur-md p-6 sm:p-7 flex flex-col gap-4.5 sm:gap-5 text-center animate-in fade-in-0 zoom-in-95 duration-300"
        role="region"
        aria-label="Summit Conquered Celebration Card"
      >
        {/* Summit Emblem with gold glowing ring */}
        <div className="relative mx-auto mt-1">
          <div className="size-16 sm:size-18 rounded-2xl bg-gradient-to-b from-[#1e2e23] to-[#121c15] border-2 border-[#f1c40f] ring-4 ring-[#f1c40f]/20 shadow-[0_0_25px_rgba(241,196,15,0.35)] flex items-center justify-center text-[#f1c40f]">
            <Flag className="size-8 sm:size-9" />
          </div>
          <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-[#f1c40f] text-[#0d1610] shadow-sm whitespace-nowrap">
            ★ Peak Conquered
          </span>
        </div>

        {/* Mountain Heading & Elevation */}
        <header className="flex flex-col gap-1 pt-1">
          <span className="text-[11px] font-bold text-[#869489] uppercase tracking-wider">
            Summit Victory
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {mountain.name}
          </h2>
          <div className="flex items-center justify-center gap-2 text-xs text-[#9eb0a2]">
            <span className="flex items-center gap-1 font-semibold text-[#2ecc71]">
              <Mountain className="size-3.5" />
              {formatElevation(mountain.elevationMasl)}
            </span>
            <span>·</span>
            <span>{mountain.trailName}</span>
          </div>
        </header>

        {/* Accomplishment Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 bg-[#17221b]/70 border border-[#27382d] rounded-xl p-3 text-left">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-[#203025] flex items-center justify-center text-[#0aa256] shrink-0">
              <Clock className="size-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#869489] uppercase font-bold block leading-none">
                Focus Time
              </span>
              <strong className="text-sm font-bold text-white leading-tight">
                {durationMinutes} mins
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-[#203025] flex items-center justify-center text-[#2ecc71] shrink-0">
              <Mountain className="size-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#869489] uppercase font-bold block leading-none">
                Altitude Gained
              </span>
              <strong className="text-sm font-bold text-white leading-tight truncate block">
                {formatElevation(mountain.elevationMasl)}
              </strong>
            </div>
          </div>
        </div>

        {/* Trail Mission Recap (if declared) */}
        {missionTitle && (
          <div className="bg-[#17221b]/70 border border-[#27382d] rounded-xl p-3 text-left flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#869489]">
              <span className="flex items-center gap-1 text-[#2ecc71]">
                <CheckCircle2 className="size-3.5" /> Trail Mission Accomplished
              </span>
              {totalCheckpointsCount > 0 && (
                <span className="text-[#a4b5a8]">
                  {completedCheckpointsCount}/{totalCheckpointsCount} checked
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-[#f0f5f1] line-clamp-2">
              {missionTitle}
            </p>
          </div>
        )}

        {/* Earned Rewards Box */}
        <div className="rounded-xl bg-gradient-to-r from-[#17261d] via-[#1a2c21] to-[#17261d] border border-[#2f4a36] p-3.5 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-[#869489] uppercase tracking-wider">
            Expedition Rewards
          </span>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-center gap-2 bg-[#121d15] border border-[#283e2e] rounded-lg py-2 px-3">
              <Sparkles className="size-4 text-[#2ecc71]" />
              <div className="text-left leading-tight">
                <span className="text-[10px] text-[#869489] block font-medium">Exp Earned</span>
                <strong className="text-sm font-bold text-[#2ecc71]">
                  +{rewards.exp} Exp
                </strong>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 bg-[#121d15] border border-[#283e2e] rounded-lg py-2 px-3">
              <Coins className="size-4 text-[#f1c40f]" />
              <div className="text-left leading-tight">
                <span className="text-[10px] text-[#869489] block font-medium">Trail Coins</span>
                <strong className="text-sm font-bold text-[#f1c40f]">
                  +{rewards.coins} Coins
                </strong>
              </div>
            </div>
          </div>

          {isGuest && (
            <p className="text-[10px] text-[#8ca090] italic pt-0.5">
              Guest Hiker progress is preserved in your device logbook.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <Button
            type="button"
            onClick={onReturnToCamp}
            className="w-full h-11 text-xs sm:text-sm font-bold bg-[#0aa256] hover:bg-[#088747] text-white rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <Tent className="size-4" />
            <span>Return to Camp</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onViewLogbook}
            className="w-full h-10 text-xs font-bold border-[#2f4334] bg-transparent text-[#d1ded5] hover:bg-[#1a251e] hover:text-white rounded-xl cursor-pointer flex items-center justify-center gap-2"
          >
            <BookOpen className="size-4 text-[#8ca090]" />
            <span>View Logbook</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
