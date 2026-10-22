import { useId, type CSSProperties } from 'react'
import { getMountainPosition, HIKER_WALK_CYCLES } from '@/lib/mountainScene'

export function PixelHiker({ className = '', meditating = false }: { className?: string; meditating?: boolean }) {
  return (
    <svg viewBox="0 0 32 40" className={className} fill="none" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M10 3h12v4h4v4H6V7h4Z" fill="#2f6150" />
      <path d="M12 11h10v9H12Z" fill="#e5b487" />
      <path d="M20 13h2v2h-2Z" fill="#183f35" />
      <path d="M10 20h12v12H10Z" fill="#d66b4d" />
      <path d="M5 19h6v13H5Z" fill="#f2bf52" />
      <path d={meditating ? 'M8 31h17v5H5v-3h3Z' : 'M10 32h5v8H7v-3h3Zm9 0h5v5h4v3h-9Z'} fill="#183f35" />
      <path d={meditating ? 'M10 24H6v6h7v-3h-3Zm12 0h4v6h-7v-3h3Z' : 'M22 21h4v6h4v3h-8Z'} fill="#e5b487" />
      {!meditating && <path d="M29 25h2v15h-2Z" fill="#526c51" />}
    </svg>
  )
}

export function WalkingHiker({ direction, walking, className, style }: {
  direction: keyof typeof HIKER_WALK_CYCLES
  walking: boolean
  className: string
  style?: CSSProperties
}) {
  const { frames, mirrored } = HIKER_WALK_CYCLES[direction]
  const cutoutId = useId()
  return (
    <svg
      viewBox="0 0 128 192"
      width="128"
      height="192"
      className={`walking-hiker ${className}`}
      data-walking={walking}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <filter id={cutoutId} colorInterpolationFilters="sRGB">
          {/* The supplied PNGs have a pale backdrop; mask it without changing their colors. */}
          <feColorMatrix in="SourceGraphic" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1 -1 -1 0 3" />
          <feComponentTransfer result="cutout"><feFuncA type="discrete" tableValues="0 1" /></feComponentTransfer>
          <feComposite in="SourceGraphic" in2="cutout" operator="in" />
        </filter>
      </defs>
      <g transform={mirrored ? 'translate(128 0) scale(-1 1)' : undefined}>
        <g
          key={direction}
          className="hiker-walk-strip"
          filter={`url(#${cutoutId})`}
          style={{ animationDuration: `${frames.length * 0.24}s`, animationTimingFunction: `steps(${frames.length})` }}
        >
          {frames.map((frame, index) => (
            <image key={frame} href={`/images/hiker/walking/walking-${String(frame).padStart(2, '0')}.png`} x={index * 128} width="128" height="192" />
          ))}
        </g>
      </g>
    </svg>
  )
}

export function MountainScene({ progress, walking }: { progress: number; walking: boolean }) {
  const { x, y, direction } = getMountainPosition(progress)
  return (
    <div className="mountain-scene" role="img" aria-label={`Pixel hiker ${Math.round(progress * 100)}% of the way up a snowy, pine-covered mountain`}>
      <img src="/images/mountains/focus-voxel.svg" alt="" width="640" height="480" fetchPriority="high" />
      <WalkingHiker
        direction={direction}
        walking={walking}
        className="mountain-hiker"
        style={{ left: `${x / 640 * 100}%`, top: `${y / 480 * 100}%` }}
      />
    </div>
  )
}
