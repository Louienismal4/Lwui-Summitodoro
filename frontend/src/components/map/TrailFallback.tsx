import type { ExpeditionMountain } from '@/data/expeditionMountains'

type Props = {
  mountain: ExpeditionMountain
  progress: number
  reachedCheckpointIds?: string[]
  reason?: string
}

export function TrailFallback({
  mountain,
  progress,
  reachedCheckpointIds = [],
  reason,
}: Props) {
  const percentage = Math.round(progress * 100)
  const hikerLeft = Math.min(Math.max(progress * 100, 4), 96)

  return (
    <div
      className="w-full h-full min-h-[360px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#183f3508] to-[#183f3518] border border-[var(--line)] rounded-2xl relative overflow-hidden text-center"
      role="img"
      aria-label={`Virtual trail progress: ${percentage}%`}
    >
      {/* Background Mountain Silhouette */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none opacity-20">
        <svg
          viewBox="0 0 1000 300"
          className="w-full h-auto text-[var(--pine)] fill-current"
          preserveAspectRatio="none"
        >
          <path d="M0,300 L250,110 L450,220 L720,40 L1000,300 Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-lg w-full flex flex-col items-center space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[var(--coral)] bg-[var(--coral)]/10 px-2.5 py-1 rounded-full">
            Low-Data / VPC Trail View
          </span>
          <h2 className="font-serif text-2xl font-bold text-[var(--ink-deep)] pt-2">
            {mountain.name}
          </h2>
          <p className="text-xs text-[#637168]">
            {mountain.tagline} · {mountain.elevationMasl} MASL
          </p>
        </div>

        {/* Trail Progress Visualizer */}
        <div className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-[var(--ink)]">
            <span>Jump-off</span>
            <span className="text-[var(--coral)]">{percentage}% Complete</span>
            <span>Summit</span>
          </div>

          {/* Polyline progress track */}
          <div className="relative w-full h-3 bg-[var(--cream)] rounded-full overflow-visible border border-[var(--line)]">
            <div
              className="absolute left-0 top-0 bottom-0 bg-[var(--pine)] rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
            {/* Hiker indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-6 rounded-full bg-[var(--sun)] border-2 border-[var(--ink-deep)] flex items-center justify-center text-xs shadow-md transition-all duration-300"
              style={{ left: `${hikerLeft}%` }}
              title="Your hiker position"
            >
              🥾
            </div>

            {/* Checkpoints */}
            {mountain.checkpoints.map((cp) => {
              const cpPercent = Math.round(cp.progress * 100)
              return (
                <div
                  key={cp.id}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-2 rounded-full border border-[var(--ink-deep)] transition-colors"
                  style={{
                    left: `${cpPercent}%`,
                    backgroundColor:
                      reachedCheckpointIds.includes(cp.id) || progress * 100 >= cpPercent
                        ? 'var(--coral)'
                        : 'var(--paper)',
                  }}
                  title={`${cp.name} (${cpPercent}%)`}
                />
              )
            })}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-left">
            {mountain.checkpoints.slice(0, 4).map((cp) => {
              const cpPercent = Math.round(cp.progress * 100)
              return (
                <div
                  key={cp.id}
                  className={`p-2 rounded-lg text-[11px] border ${
                    progress * 100 >= cpPercent
                      ? 'border-[var(--pine)]/40 bg-[var(--pine)]/5 text-[var(--pine)] font-bold'
                      : 'border-[var(--line)] bg-transparent text-[#748078]'
                  }`}
                >
                  <div className="text-[9px] font-extrabold uppercase tracking-wider">
                    {cpPercent}% CP
                  </div>
                  <div className="truncate font-semibold">{cp.name}</div>
                </div>
              )
            })}
          </div>
        </div>

        {reason && (
          <p className="text-[11px] text-[#748078] max-w-sm">
            {reason} Your focus timer continues running normally.
          </p>
        )}
      </div>
    </div>
  )
}
