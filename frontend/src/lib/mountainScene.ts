// Coordinates follow the trail in /images/mountains/focus-voxel.svg.
export const MOUNTAIN_TRAIL = [[269, 334.0], [354, 325.5], [337, 249.0], [286, 223.5], [303, 147.0], [337, 147.0], [320, 104.5]] as const

const HIKER_DIRECTIONS = ['east', 'southeast', 'south', 'southwest', 'west', 'northwest', 'north', 'northeast'] as const

export const HIKER_WALK_CYCLES = {
  east: { frames: [1, 2], mirrored: false },
  southeast: { frames: [3, 4, 5], mirrored: false },
  south: { frames: [3, 4, 5], mirrored: false },
  southwest: { frames: [3, 4, 5], mirrored: true },
  west: { frames: [7, 8, 9], mirrored: false },
  northwest: { frames: [6, 10], mirrored: false },
  // shortcut: use the rear diagonal until a straight rear walking cycle is supplied.
  north: { frames: [6, 10], mirrored: false },
  northeast: { frames: [6, 10], mirrored: true },
} as const

export function getMountainPosition(progress: number) {
  const step = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0)) * (MOUNTAIN_TRAIL.length - 1)
  const index = Math.min(Math.floor(step), MOUNTAIN_TRAIL.length - 2)
  const fraction = step - index
  const start = MOUNTAIN_TRAIL[index]
  const end = MOUNTAIN_TRAIL[index + 1]
  const angle = Math.atan2(end[1] - start[1], end[0] - start[0])
  const direction = HIKER_DIRECTIONS[(Math.round(angle / (Math.PI / 4)) + 8) % 8]
  return {
    x: start[0] + (end[0] - start[0]) * fraction,
    y: start[1] + (end[1] - start[1]) * fraction,
    direction,
  }
}
