export type TrailMissionCheckpoint = {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

export type MissionProgress = {
  completed: number
  total: number
  percent: number
}

export const MISSION_CHECKPOINTS_STORAGE_KEY = 'summitodoro:mission-checkpoints'
export const TASK_LIST_STORAGE_KEY = 'summitodoro:guest-tasks'
export const MAX_TASKS = 20
export const MAX_TASK_LENGTH = 2000

export type TaskList = {
  title: string
  tasks: TrailMissionCheckpoint[]
}

export function createCheckpoint(title: string): TrailMissionCheckpoint {
  return {
    id: `chk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: title.trim(),
    completed: false,
    createdAt: Date.now(),
  }
}

export function addCheckpoint(
  checkpoints: TrailMissionCheckpoint[],
  title: string,
): TrailMissionCheckpoint[] {
  const trimmed = title.trim()
  if (!trimmed || trimmed.length > MAX_TASK_LENGTH || checkpoints.length >= MAX_TASKS) return checkpoints
  return [...checkpoints, createCheckpoint(trimmed)]
}

export function toggleCheckpoint(
  checkpoints: TrailMissionCheckpoint[],
  id: string,
): TrailMissionCheckpoint[] {
  return checkpoints.map((cp) =>
    cp.id === id ? { ...cp, completed: !cp.completed } : cp,
  )
}

export function editCheckpoint(
  checkpoints: TrailMissionCheckpoint[],
  id: string,
  title: string,
): TrailMissionCheckpoint[] {
  const trimmed = title.trim()
  if (!trimmed || trimmed.length > MAX_TASK_LENGTH) return checkpoints
  return checkpoints.map((cp) => cp.id === id ? { ...cp, title: trimmed } : cp)
}

export function continueTaskBullet(value: string, start: number, end = start) {
  if (start !== end) return null
  const lineStart = value.slice(0, start).lastIndexOf('\n') + 1
  const lineEnd = value.indexOf('\n', start)
  const line = value.slice(lineStart, lineEnd < 0 ? value.length : lineEnd)
  const match = /^(\s*)[-•] (.*)$/.exec(line)
  if (!match || start < lineStart + match[1].length + 2) return null
  if (!match[2].trim()) {
    return { value: value.slice(0, lineStart) + value.slice(lineStart + line.length), caret: lineStart }
  }
  const insertion = `\n${match[1]}• `
  return { value: value.slice(0, start) + insertion + value.slice(end), caret: start + insertion.length }
}

export function parseTaskText(value: string) {
  const blocks: { type: 'text' | 'list'; lines: string[] }[] = []
  for (const line of value.split('\n')) {
    const bullet = /^\s*[-•] (.*)$/.exec(line)
    const type = bullet ? 'list' : 'text'
    const previous = blocks.at(-1)
    if (previous?.type === type) previous.lines.push(bullet ? bullet[1] : line)
    else blocks.push({ type, lines: [bullet ? bullet[1] : line] })
  }
  return blocks
}

export function removeCheckpoint(
  checkpoints: TrailMissionCheckpoint[],
  id: string,
): TrailMissionCheckpoint[] {
  return checkpoints.filter((cp) => cp.id !== id)
}

export function calculateMissionProgress(
  checkpoints: TrailMissionCheckpoint[],
): MissionProgress {
  const total = checkpoints.length
  if (total === 0) {
    return { completed: 0, total: 0, percent: 0 }
  }
  const completed = checkpoints.filter((cp) => cp.completed).length
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
  }
}

export function loadMissionCheckpoints(
  storage?: Storage,
): TrailMissionCheckpoint[] {
  try {
    const targetStorage =
      storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined)
    if (!targetStorage) return []
    const raw = targetStorage.getItem(MISSION_CHECKPOINTS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is TrailMissionCheckpoint =>
        Boolean(item) &&
        typeof item.id === 'string' &&
        typeof item.title === 'string' &&
        typeof item.completed === 'boolean',
    )
  } catch {
    return []
  }
}

export function saveMissionCheckpoints(
  checkpoints: TrailMissionCheckpoint[],
  storage?: Storage,
): void {
  const targetStorage =
    storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined)
  if (!targetStorage) return

  try {
    targetStorage.setItem(
      MISSION_CHECKPOINTS_STORAGE_KEY,
      JSON.stringify(checkpoints),
    )
  } catch {
    // Gracefully handle storage quota or access errors
  }
}

export function loadGuestTasks(storage?: Storage): TaskList {
  try {
    const target = storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined)
    const raw = target?.getItem(TASK_LIST_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (typeof parsed.title === 'string' && Array.isArray(parsed.tasks)) {
        return { title: parsed.title, tasks: parsed.tasks.filter((task: TrailMissionCheckpoint) =>
          task && typeof task.id === 'string' && typeof task.title === 'string' && typeof task.completed === 'boolean',
        ) }
      }
    }
  } catch {
    // Recover the previous guest list when storage is unavailable or invalid.
  }
  return { title: '', tasks: loadMissionCheckpoints(storage) }
}

export function saveGuestTasks(list: TaskList, storage?: Storage): boolean {
  try {
    const target = storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined)
    if (!target) return false
    target.setItem(TASK_LIST_STORAGE_KEY, JSON.stringify(list))
    return true
  } catch {
    return false
  }
}
