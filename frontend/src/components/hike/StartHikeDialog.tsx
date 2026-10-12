import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { isValidHikeDuration } from '@/lib/expeditionPrep'
import { DURATION_TIERS, calculateExpeditionRewards } from '@/lib/rewards'

type StartHikeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  durationMinutes: number
  onSelectDuration: (minutes: number) => void
  onStart: () => void
}

export function StartHikeDialog({
  open,
  onOpenChange,
  durationMinutes,
  onSelectDuration,
  onStart,
}: StartHikeDialogProps) {
  const [isCustom, setIsCustom] = useState(false)
  const [customMinutes, setCustomMinutes] = useState('')
  const isValid = isValidHikeDuration(durationMinutes)
  const rewards = calculateExpeditionRewards(isValid ? durationMinutes : 0, false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 rounded-2xl bg-[var(--cream)] p-6 text-[var(--ink)] sm:max-w-sm sm:p-8">
        <div className="text-center">
          <DialogTitle className="text-lg font-semibold">Start Hike</DialogTitle>
          <DialogDescription className="mt-1 text-muted-foreground">
            Choose your focus duration.
          </DialogDescription>
        </div>

        <form
          className="grid gap-6"
          onSubmit={(event) => {
            event.preventDefault()
            if (isValid) onStart()
          }}
        >
          <output aria-label="Selected focus duration" aria-live="polite" className="text-center font-mono text-6xl tracking-tight tabular-nums">
            {String(isValid ? durationMinutes : 0).padStart(2, '0')}:00
          </output>

          <div>
            <div className="grid grid-cols-5 gap-2" role="group" aria-label="Focus duration in minutes">
              {DURATION_TIERS.map((minutes) => (
                <Button
                  key={minutes}
                  type="button"
                  variant={!isCustom && durationMinutes === minutes ? 'default' : 'outline'}
                  aria-pressed={!isCustom && durationMinutes === minutes}
                  aria-label={`${minutes} minutes`}
                  className="h-11 rounded-lg text-sm"
                  onClick={() => {
                    setIsCustom(false)
                    onSelectDuration(minutes)
                  }}
                >
                  {minutes}
                </Button>
              ))}
              <Button
                type="button"
                variant={isCustom ? 'default' : 'outline'}
                aria-label="Choose custom duration"
                aria-expanded={isCustom}
                aria-controls="custom-hike-duration"
                className="h-11 rounded-lg"
                onClick={() => {
                  setIsCustom(true)
                  setCustomMinutes('')
                  onSelectDuration(0)
                }}
              >
                <Plus aria-hidden="true" />
              </Button>
            </div>
            {isCustom && (
              <div className="mt-4 grid gap-2">
                <label htmlFor="custom-hike-duration" className="text-sm">Custom minutes</label>
                <Input
                  id="custom-hike-duration"
                  type="number"
                  min={1}
                  max={240}
                  step={1}
                  required
                  value={customMinutes}
                  aria-invalid={customMinutes !== '' && !isValid}
                  aria-describedby="custom-hike-duration-help"
                  className="h-11 bg-transparent text-base"
                  onChange={(event) => {
                    const value = event.target.value
                    setCustomMinutes(value)
                    const minutes = Number(value)
                    onSelectDuration(isValidHikeDuration(minutes) ? minutes : 0)
                  }}
                />
                <p id="custom-hike-duration-help" className="text-xs text-muted-foreground">
                  Enter a whole number from 1 to 240 minutes.
                </p>
              </div>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground" aria-live="polite">
            +{rewards.exp} EXP <span aria-hidden="true">·</span> +{rewards.coins} coins
          </p>
          <Button type="submit" disabled={!isValid} className="h-12 w-full rounded-xl text-sm font-semibold">
            Start Hike
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
