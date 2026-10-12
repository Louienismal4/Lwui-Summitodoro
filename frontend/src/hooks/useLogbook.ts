import { useState, useCallback, useEffect } from 'react'
import {
  type LogbookEntry,
  type CreateLogbookEntryInput,
  createLogbookEntry,
  loadLogbookEntries,
  saveLogbookEntries,
  addLogbookEntry,
  calculateLogbookStats,
} from '@/lib/logbook'

export function useLogbook() {
  const [entries, setEntries] = useState<LogbookEntry[]>(() => loadLogbookEntries())

  // Keep storage synchronized whenever entries state updates
  useEffect(() => {
    saveLogbookEntries(entries)
  }, [entries])

  const recordSummit = useCallback((input: CreateLogbookEntryInput): LogbookEntry => {
    const newEntry = createLogbookEntry({
      ...input,
      status: 'summited',
    })
    setEntries((prev) => addLogbookEntry(prev, newEntry))
    return newEntry
  }, [])

  const stats = calculateLogbookStats(entries)

  return {
    entries,
    stats,
    recordSummit,
  }
}
