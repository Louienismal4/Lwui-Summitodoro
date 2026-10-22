import { Compass, Tent, Flame, Map, Flag, Hourglass } from 'lucide-react'
import { TrailSketch } from '@/components/layout/TrailSketch'

const stickers = [
  { name: 'boots', art: <TrailSketch kind="boots" /> },
  { name: 'pack', art: <TrailSketch kind="pack" /> },
  { name: 'compass', art: <Compass /> },
  { name: 'tent', art: <Tent /> },
  { name: 'fire', art: <Flame /> },
  { name: 'bottle', art: <svg viewBox="0 0 48 80" fill="none"><path d="M17 3h14v10H17Z" fill="#183f35" /><path d="M17 13h14v8l8 10v39q0 6-6 6H15q-6 0-6-6V31l8-10Z" fill="#9eb49a" stroke="#183f35" strokeWidth="2" /><path d="M10 36h28v23H10Z" fill="#fffdf7" /><path d="m24 40-6 10a6 6 0 0 0 12 0Z" fill="#2f6150" /><path d="M15 30v38" stroke="#fffdf7" strokeOpacity=".4" strokeWidth="3" /></svg> },
  { name: 'map', art: <Map /> },
  { name: 'flag', art: <Flag /> },
  { name: 'hourglass', art: <Hourglass /> },
  { name: 'tomato', art: <svg viewBox="0 0 80 80" fill="none"><path d="M40 24C15 7 1 43 19 61c9 9 32 12 44-4 16-22-4-46-23-33Z" fill="#d66b4d" stroke="#a94730" strokeWidth="2" /><path d="m40 28-14-9 11 1 3-13 5 13 13-4-11 12Z" fill="#2f6150" /><path d="M22 35c-5 6-5 11-2 16" stroke="#f3b89d" strokeWidth="5" strokeLinecap="round" /><path d="M35 43h2m11 0h2m-11 9q4 4 8 0" stroke="#183f35" strokeWidth="2.5" strokeLinecap="round" /></svg> },
  { name: 'focus', art: <span>FOCUS<span>one step at a time</span></span> },
]

export function StickerLayer() {
  return <div className="sticker-layer" aria-hidden="true">{stickers.map(({ name, art }) => <div className={`focus-sticker sticker-${name}`} key={name}>{art}</div>)}</div>
}
