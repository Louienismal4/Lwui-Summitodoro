import { Coffee, Play, CheckCircle2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { TrailCheckpoint } from '@/types/trail'

export type RestBreakPromptProps = {
  checkpoint: TrailCheckpoint
  onResume: () => void
}

export function RestBreakPrompt({
  checkpoint,
  onResume,
}: RestBreakPromptProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onResume()
    }
  }

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-[390px] rounded-2xl bg-[#111712]/95 border-[#2e4333] shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-6 text-center flex flex-col items-center gap-4 text-[#f5f0e4] sm:max-w-[390px]"
      >
        {/* Header Icon */}
        <div className="size-12 rounded-2xl bg-[#1a261e] border border-[#2b3e30] flex items-center justify-center text-[#0aa256] shadow-inner">
          <Coffee className="size-6" />
        </div>

        {/* Milestone Kicker & Title */}
        <DialogHeader className="flex flex-col items-center gap-1.5 w-full">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#0aa256]/20 text-[#2ecc71] border border-[#0aa256]/30">
            <CheckCircle2 className="size-3" /> Checkpoint Reached
          </span>
          <DialogTitle className="text-xl font-bold tracking-tight text-white">
            {checkpoint.name}
          </DialogTitle>
          {checkpoint.description && (
            <p className="text-xs text-[#9eb0a2] px-2 italic">
              “{checkpoint.description}”
            </p>
          )}
        </DialogHeader>

        {/* Rest Break Advice */}
        <DialogDescription className="rounded-xl bg-[#17221b] border border-[#26372b] p-3 text-xs text-[#c2cbc4] leading-relaxed">
          Take a deep breath, drink some water, and stretch your legs. Your focus
          progress and hiker marker are securely paused on the trail.
        </DialogDescription>

        {/* Resume Action CTA */}
        <Button
          type="button"
          onClick={onResume}
          autoFocus
          className="w-full h-11 bg-[#0aa256] hover:bg-[#0cb561] text-[#04150b] text-sm font-extrabold tracking-wide uppercase rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] hover:shadow-[0_0_20px_rgba(10,162,86,0.4)]"
        >
          <Play className="size-4 fill-current" />
          <span>Resume Ascent</span>
        </Button>
      </DialogContent>
    </Dialog>
  )
}
