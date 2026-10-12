import type { TrailCheckpoint } from '@/types/trail'

export type MilestoneMarker = {
  id: string
  name: string
  description?: string
  progress: number
  isSummit?: boolean
}

/**
 * Checks if a session progress milestone has been reached or passed.
 */
export function isMilestoneReached(
  milestoneProgress: number,
  sessionProgress: number,
): boolean {
  return sessionProgress >= milestoneProgress
}

/**
 * Returns the appropriate CSS alignment class for milestone tooltips to prevent
 * bleeding off viewport edges at the start and end of the progress line.
 */
export function getTooltipAlignmentClass(progress: number): string {
  if (progress <= 0.05) {
    return 'left-0 translate-x-0'
  }
  if (progress >= 0.95) {
    return 'right-0 translate-x-0'
  }
  return 'left-1/2 -translate-x-1/2'
}

/**
 * Returns an ordered array of milestones from Trailhead (0.0) through intermediate
 * Checkpoints to Summit (1.0).
 */
export function getMilestoneMarkers(
  checkpoints: TrailCheckpoint[],
): MilestoneMarker[] {
  const sortedCheckpoints = [...checkpoints].sort(
    (a, b) => a.progress - b.progress,
  )

  return [
    {
      id: 'trailhead',
      name: 'Trailhead',
      description: 'Expedition starting point',
      progress: 0,
    },
    ...sortedCheckpoints.map((cp) => ({
      id: cp.id,
      name: cp.name,
      description: cp.description,
      progress: cp.progress,
    })),
    {
      id: 'summit',
      name: 'Summit',
      description: 'Expedition summit reached',
      progress: 1,
      isSummit: true,
    },
  ]
}

/**
 * Determines whether a newly reached intermediate Checkpoint should trigger
 * a Rest Break. Summit (1.0) is handled separately by the celebration card.
 * Evaluates checkpoints in chronological progress order.
 */
export function shouldTriggerRestBreak(
  currentProgress: number,
  checkpoints: TrailCheckpoint[],
  triggeredCheckpointIds: Iterable<string>,
): TrailCheckpoint | null {
  // Summit (1.0) is not an intermediate rest break
  if (currentProgress >= 1) return null

  const triggeredSet = new Set(triggeredCheckpointIds)

  // Sort checkpoints ascending by progress to ensure chronological evaluation
  const sortedCheckpoints = [...checkpoints].sort(
    (a, b) => a.progress - b.progress,
  )

  // Find the first checkpoint whose progress is reached/exceeded and hasn't been triggered yet
  const reached = sortedCheckpoints.find(
    (cp) => currentProgress >= cp.progress && !triggeredSet.has(cp.id),
  )

  return reached ?? null
}
