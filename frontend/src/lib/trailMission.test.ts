import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createCheckpoint,
  addCheckpoint,
  toggleCheckpoint,
  removeCheckpoint,
  calculateMissionProgress,
  loadMissionCheckpoints,
  saveMissionCheckpoints,
  MISSION_CHECKPOINTS_STORAGE_KEY,
  editCheckpoint,
  continueTaskBullet,
  parseTaskText,
  loadGuestTasks,
  saveGuestTasks,
  MAX_TASKS,
  MAX_TASK_LENGTH,
} from './trailMission.ts'

// In-memory localStorage mock for node:test environment
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

test('createCheckpoint trims title and generates unique id with timestamp', () => {
  const cp = createCheckpoint('  Review trail map  ')
  assert.equal(cp.title, 'Review trail map')
  assert.equal(cp.completed, false)
  assert.ok(cp.id.startsWith('chk-'))
  assert.ok(typeof cp.createdAt === 'number')
})

test('addCheckpoint appends new checkpoint when title is valid and ignores empty string', () => {
  const initial = [createCheckpoint('Task 1')]
  const next = addCheckpoint(initial, 'Task 2')
  assert.equal(next.length, 2)
  assert.equal(next[1].title, 'Task 2')

  const unchanged = addCheckpoint(next, '   ')
  assert.equal(unchanged.length, 2)
})

test('toggleCheckpoint flips completed state for matching id', () => {
  const c1 = createCheckpoint('Task 1')
  const c2 = createCheckpoint('Task 2')
  const list = [c1, c2]

  const toggled = toggleCheckpoint(list, c1.id)
  assert.equal(toggled[0].completed, true)
  assert.equal(toggled[1].completed, false)

  const toggledBack = toggleCheckpoint(toggled, c1.id)
  assert.equal(toggledBack[0].completed, false)
})

test('removeCheckpoint filters out checkpoint by id', () => {
  const c1 = createCheckpoint('Task 1')
  const c2 = createCheckpoint('Task 2')
  const list = [c1, c2]

  const removed = removeCheckpoint(list, c1.id)
  assert.equal(removed.length, 1)
  assert.equal(removed[0].id, c2.id)
})

test('calculateMissionProgress computes completed count, total, and percentage', () => {
  assert.deepEqual(calculateMissionProgress([]), { completed: 0, total: 0, percent: 0 })

  const c1 = { ...createCheckpoint('A'), completed: true }
  const c2 = { ...createCheckpoint('B'), completed: false }
  const c3 = { ...createCheckpoint('C'), completed: true }
  const c4 = { ...createCheckpoint('D'), completed: false }

  assert.deepEqual(calculateMissionProgress([c1, c2, c3, c4]), {
    completed: 2,
    total: 4,
    percent: 50,
  })
})

test('loadMissionCheckpoints and saveMissionCheckpoints persist and recover data', () => {
  const mockStorage = new MockLocalStorage()
  const checkpoints = [
    { ...createCheckpoint('Alpha'), completed: true },
    createCheckpoint('Beta'),
  ]

  saveMissionCheckpoints(checkpoints, mockStorage as unknown as Storage)
  const loaded = loadMissionCheckpoints(mockStorage as unknown as Storage)

  assert.equal(loaded.length, 2)
  assert.equal(loaded[0].title, 'Alpha')
  assert.equal(loaded[0].completed, true)
  assert.equal(loaded[1].title, 'Beta')
  assert.equal(loaded[1].completed, false)
})

test('loadMissionCheckpoints handles corrupted storage gracefully', () => {
  const mockStorage = new MockLocalStorage()
  mockStorage.setItem(MISSION_CHECKPOINTS_STORAGE_KEY, 'invalid-json{{{')

  const loaded = loadMissionCheckpoints(mockStorage as unknown as Storage)
  assert.deepEqual(loaded, [])
})

test('task limit includes completed tasks and editing preserves identity and completion', () => {
  const tasks = Array.from({ length: MAX_TASKS }, (_, index) => ({ ...createCheckpoint(`Task ${index}`), completed: true }))
  assert.equal(addCheckpoint(tasks, 'Extra'), tasks)
  const edited = editCheckpoint(tasks, tasks[0].id, '  Review math\n• Calculus\n• Algebra  ')
  assert.equal(edited[0].title, 'Review math\n• Calculus\n• Algebra')
  assert.equal(edited[0].id, tasks[0].id)
  assert.equal(edited[0].completed, true)
  assert.equal(editCheckpoint(tasks, tasks[0].id, '  '), tasks)
  assert.equal(addCheckpoint([], 'a'.repeat(MAX_TASK_LENGTH + 1)).length, 0)
})

test('Enter continues bullets, ends an empty bullet, and leaves plain text alone', () => {
  const text = 'Review math\n• Calculus'
  assert.deepEqual(continueTaskBullet(text, text.length), { value: `${text}\n• `, caret: text.length + 3 })
  const emptyBullet = `${text}\n• `
  assert.deepEqual(continueTaskBullet(emptyBullet, emptyBullet.length), { value: `${text}\n`, caret: text.length + 1 })
  assert.equal(continueTaskBullet('Plain text', 10), null)
  assert.equal(continueTaskBullet(text, 12, 15), null)
  assert.equal(continueTaskBullet('• Calculus', 0), null)
  assert.deepEqual(continueTaskBullet('- Calculus', 10), { value: '- Calculus\n• ', caret: 13 })
  assert.deepEqual(continueTaskBullet('• AlphaBeta', 7), { value: '• Alpha\n• Beta', caret: 10 })
})

test('task display groups bullets and preserves plain notes and literal hyphens', () => {
  assert.deepEqual(parseTaskText('Review math\n- Calculus\n• Algebra\nPlain note\n-'), [
    { type: 'text', lines: ['Review math'] },
    { type: 'list', lines: ['Calculus', 'Algebra'] },
    { type: 'text', lines: ['Plain note', '-'] },
  ])
})

test('guest lists preserve their name and an empty list without importing account data', () => {
  const storage = new MockLocalStorage() as unknown as Storage
  const oldTasks = [createCheckpoint('Guest task')]
  saveMissionCheckpoints(oldTasks, storage)
  assert.deepEqual(loadGuestTasks(storage), { title: '', tasks: oldTasks })
  assert.equal(saveGuestTasks({ title: 'Guest list', tasks: [] }, storage), true)
  assert.deepEqual(loadGuestTasks(storage), { title: 'Guest list', tasks: [] })
  const failingStorage = { setItem() { throw new Error('Quota exceeded') } } as unknown as Storage
  assert.equal(saveGuestTasks({ title: '', tasks: [] }, failingStorage), false)
})
