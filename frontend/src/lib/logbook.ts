export type LogbookEntry = {
  id: string
  mountainId: string
  mountainName: string
  trailName?: string
  province?: string
  elevation: number
  durationMinutes: number
  expEarned: number
  coinsEarned: number
  missionTitle?: string
  completedCheckpointsCount: number
  totalCheckpointsCount: number
  completedAt: string
  status: 'summited' | 'abandoned'
}

export type CreateLogbookEntryInput = {
  id?: string
  mountainId: string
  mountainName: string
  trailName?: string
  province?: string
  elevation: number
  durationMinutes: number
  expEarned: number
  coinsEarned: number
  missionTitle?: string
  completedCheckpointsCount?: number
  totalCheckpointsCount?: number
  completedAt?: string
  status?: 'summited' | 'abandoned'
}

export type LogbookStats = {
  totalSummits: number
  totalElevationMasl: number
  totalFocusMinutes: number
  totalExpEarned: number
  totalCoinsEarned: number
}

export const LOGBOOK_STORAGE_KEY = 'summitodoro:logbook'

/**
 * Creates a validated Logbook entry with defaults.
 */
export function createLogbookEntry(input: CreateLogbookEntryInput): LogbookEntry {
  return {
    id: input.id || `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    mountainId: input.mountainId,
    mountainName: input.mountainName.trim(),
    trailName: input.trailName?.trim(),
    province: input.province?.trim(),
    elevation: Math.max(0, input.elevation),
    durationMinutes: Math.max(0, input.durationMinutes),
    expEarned: Math.max(0, input.expEarned),
    coinsEarned: Math.max(0, input.coinsEarned),
    missionTitle: input.missionTitle?.trim() || undefined,
    completedCheckpointsCount: Math.max(0, input.completedCheckpointsCount ?? 0),
    totalCheckpointsCount: Math.max(0, input.totalCheckpointsCount ?? 0),
    completedAt: input.completedAt || new Date().toISOString(),
    status: input.status || 'summited',
  }
}

/**
 * Safely loads logbook entries from local storage.
 */
export function loadLogbookEntries(storage: Storage = window.localStorage): LogbookEntry[] {
  try {
    const raw = storage.getItem(LOGBOOK_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

/**
 * Persists logbook entries to local storage.
 */
export function saveLogbookEntries(
  entries: LogbookEntry[],
  storage: Storage = window.localStorage,
): void {
  try {
    storage.setItem(LOGBOOK_STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // Ignore quota errors
  }
}

/**
 * Adds a new entry at the head of the list and persists it to storage.
 */
export function addLogbookEntry(
  entries: LogbookEntry[],
  newEntry: LogbookEntry,
  storage?: Storage,
): LogbookEntry[] {
  const updated = [newEntry, ...entries]
  if (storage) {
    saveLogbookEntries(updated, storage)
  }
  return updated
}

/**
 * Calculates aggregate stats across all summited logbook entries.
 */
export function calculateLogbookStats(entries: LogbookEntry[]): LogbookStats {
  const summited = entries.filter((e) => e.status === 'summited')

  return summited.reduce<LogbookStats>(
    (acc, curr) => ({
      totalSummits: acc.totalSummits + 1,
      totalElevationMasl: acc.totalElevationMasl + curr.elevation,
      totalFocusMinutes: acc.totalFocusMinutes + curr.durationMinutes,
      totalExpEarned: acc.totalExpEarned + curr.expEarned,
      totalCoinsEarned: acc.totalCoinsEarned + curr.coinsEarned,
    }),
    {
      totalSummits: 0,
      totalElevationMasl: 0,
      totalFocusMinutes: 0,
      totalExpEarned: 0,
      totalCoinsEarned: 0,
    },
  )
}

/**
 * Formats an ISO date string into human-readable mountaineering log timestamp.
 */
export function formatLogbookDate(isoDate: string): string {
  try {
    const date = new Date(isoDate)
    if (Number.isNaN(date.getTime())) return 'Recently'
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  } catch {
    return 'Recently'
  }
}
