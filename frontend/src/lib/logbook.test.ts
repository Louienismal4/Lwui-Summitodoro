import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createLogbookEntry,
  addLogbookEntry,
  calculateLogbookStats,
  loadLogbookEntries,
  saveLogbookEntries,
  formatLogbookDate,
  LOGBOOK_STORAGE_KEY,
  type LogbookEntry,
} from './logbook.ts'

class MockLocalStorage {
  private store = new Map<string, string>()

  getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value))
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }
}

test('createLogbookEntry creates valid entry with generated id and timestamp', () => {
  const entry = createLogbookEntry({
    mountainId: 'batulao',
    mountainName: 'Mt. Batulao',
    elevation: 811,
    durationMinutes: 30,
    expEarned: 150,
    coinsEarned: 15,
    missionTitle: 'Finish quarterly review',
    completedCheckpointsCount: 2,
    totalCheckpointsCount: 3,
    status: 'summited',
  })

  assert.ok(entry.id.startsWith('log-'))
  assert.equal(entry.mountainName, 'Mt. Batulao')
  assert.equal(entry.elevation, 811)
  assert.equal(entry.durationMinutes, 30)
  assert.equal(entry.expEarned, 150)
  assert.equal(entry.coinsEarned, 15)
  assert.equal(entry.missionTitle, 'Finish quarterly review')
  assert.equal(entry.status, 'summited')
  assert.ok(entry.completedAt.length > 0)
})

test('addLogbookEntry prepends new entry to the list and updates storage', () => {
  const mockStorage = new MockLocalStorage()
  const existing: LogbookEntry[] = [
    createLogbookEntry({
      mountainId: 'apo',
      mountainName: 'Mt. Apo',
      elevation: 2954,
      durationMinutes: 60,
      expEarned: 300,
      coinsEarned: 30,
      completedCheckpointsCount: 3,
      totalCheckpointsCount: 3,
      status: 'summited',
    }),
  ]

  const newEntry = createLogbookEntry({
    mountainId: 'pulag',
    mountainName: 'Mt. Pulag',
    elevation: 2928,
    durationMinutes: 45,
    expEarned: 225,
    coinsEarned: 23,
    completedCheckpointsCount: 3,
    totalCheckpointsCount: 3,
    status: 'summited',
  })

  const updated = addLogbookEntry(existing, newEntry, mockStorage as unknown as Storage)
  assert.equal(updated.length, 2)
  assert.equal(updated[0].mountainId, 'pulag')
  assert.equal(updated[1].mountainId, 'apo')

  const stored = JSON.parse(mockStorage.getItem(LOGBOOK_STORAGE_KEY) || '[]')
  assert.equal(stored.length, 2)
  assert.equal(stored[0].mountainId, 'pulag')
})

test('calculateLogbookStats computes aggregates correctly for summited hikes', () => {
  const entries: LogbookEntry[] = [
    createLogbookEntry({
      mountainId: 'batulao',
      mountainName: 'Mt. Batulao',
      elevation: 811,
      durationMinutes: 30,
      expEarned: 150,
      coinsEarned: 15,
      completedCheckpointsCount: 2,
      totalCheckpointsCount: 2,
      status: 'summited',
    }),
    createLogbookEntry({
      mountainId: 'pinatubo',
      mountainName: 'Mt. Pinatubo',
      elevation: 1486,
      durationMinutes: 60,
      expEarned: 300,
      coinsEarned: 30,
      completedCheckpointsCount: 1,
      totalCheckpointsCount: 3,
      status: 'summited',
    }),
    createLogbookEntry({
      mountainId: 'makiling',
      mountainName: 'Mt. Makiling',
      elevation: 1090,
      durationMinutes: 15,
      expEarned: 0,
      coinsEarned: 0,
      completedCheckpointsCount: 0,
      totalCheckpointsCount: 2,
      status: 'abandoned',
    }),
  ]

  const stats = calculateLogbookStats(entries)
  assert.equal(stats.totalSummits, 2)
  assert.equal(stats.totalElevationMasl, 811 + 1486)
  assert.equal(stats.totalFocusMinutes, 90)
  assert.equal(stats.totalExpEarned, 450)
  assert.equal(stats.totalCoinsEarned, 45)
})

test('loadLogbookEntries and saveLogbookEntries handle valid and corrupt data', () => {
  const mockStorage = new MockLocalStorage()
  assert.deepEqual(loadLogbookEntries(mockStorage as unknown as Storage), [])

  mockStorage.setItem(LOGBOOK_STORAGE_KEY, 'invalid json!')
  assert.deepEqual(loadLogbookEntries(mockStorage as unknown as Storage), [])

  const sample: LogbookEntry[] = [
    createLogbookEntry({
      mountainId: 'batulao',
      mountainName: 'Mt. Batulao',
      elevation: 811,
      durationMinutes: 30,
      expEarned: 150,
      coinsEarned: 15,
      completedCheckpointsCount: 1,
      totalCheckpointsCount: 1,
      status: 'summited',
    }),
  ]

  saveLogbookEntries(sample, mockStorage as unknown as Storage)
  const loaded = loadLogbookEntries(mockStorage as unknown as Storage)
  assert.equal(loaded.length, 1)
  assert.equal(loaded[0].mountainName, 'Mt. Batulao')
})

test('formatLogbookDate formats ISO string and handles invalid dates gracefully', () => {
  const formatted = formatLogbookDate('2026-10-03T14:30:00.000Z')
  assert.ok(formatted.includes('2026') || formatted.includes('Oct'))

  const invalid = formatLogbookDate('not-a-date')
  assert.equal(invalid, 'Recently')
})
