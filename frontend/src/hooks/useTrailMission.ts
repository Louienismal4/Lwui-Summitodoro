import { useState, useEffect } from 'react'
import {
  addCheckpoint, editCheckpoint, toggleCheckpoint, removeCheckpoint,
  loadGuestTasks, saveGuestTasks, type TaskList,
} from '@/lib/trailMission'
import { tasksService } from '@/services/tasks.service'

type TaskState = TaskList & {
  owner: string | null | undefined
  ready: boolean
  revision: number
  dirty: boolean
  status: 'loading' | 'saved' | 'pending' | 'saving' | 'error'
}

function initialState(owner: TaskState['owner']): TaskState {
  return {
    ...(owner === null ? loadGuestTasks() : { title: '', tasks: [] }),
    owner, ready: owner === null, revision: 0, dirty: false,
    status: owner === null ? 'saved' : 'loading',
  }
}

export function useTrailMission(owner: TaskState['owner']) {
  const [state, setState] = useState(() => initialState(owner))
  // Reset before rendering another account's data or scheduling any saves.
  if (state.owner !== owner) setState(initialState(owner))

  useEffect(() => {
    if (!owner || state.ready || state.status !== 'loading') return
    let active = true
    tasksService.load(owner).then((list) => {
      if (active) setState((prev) => prev.owner === owner
        ? { ...prev, ...list, ready: true, status: 'saved' } : prev)
    }).catch(() => {
      if (active) setState((prev) => prev.owner === owner ? { ...prev, status: 'error' } : prev)
    })
    return () => { active = false }
  }, [owner, state.ready, state.status])

  useEffect(() => {
    if (state.owner !== owner || !state.ready || !state.dirty || state.status !== 'pending') return
    const list = { title: state.title, tasks: state.tasks }
    const timer = window.setTimeout(() => {
      if (owner === null) {
        const saved = saveGuestTasks(list)
        setState((prev) => prev.owner === owner && prev.revision === state.revision
          ? { ...prev, dirty: !saved, status: saved ? 'saved' : 'error' } : prev)
        return
      }
      if (!owner) return
      setState((prev) => ({ ...prev, status: 'saving' }))
      tasksService.save(list, owner).then(() => {
        setState((prev) => prev.owner !== owner ? prev : {
          ...prev, dirty: prev.revision !== state.revision,
          status: prev.revision === state.revision ? 'saved' : 'pending',
        })
      }).catch(() => {
        setState((prev) => prev.owner === owner ? { ...prev, status: 'error' } : prev)
      })
    }, owner === null ? 0 : 400)
    return () => window.clearTimeout(timer)
  }, [owner, state])

  const change = (update: (list: TaskList) => TaskList) => {
    setState((prev) => {
      if (!prev.ready || prev.owner !== owner) return prev
      return { ...prev, ...update(prev), revision: prev.revision + 1, dirty: true,
        status: prev.status === 'saving' ? 'saving' : 'pending' }
    })
  }

  return {
    missionTitle: state.owner === owner ? state.title : '',
    checkpoints: state.owner === owner ? state.tasks : [],
    isReady: state.owner === owner && state.ready,
    saveStatus: state.owner === owner ? state.status : 'loading',
    retrySave: () => setState((prev) => ({ ...prev, status: prev.ready ? 'pending' : 'loading' })),
    setMissionTitle: (title: string) => change((list) => ({ ...list, title })),
    addCheckpoint: (title: string) => change((list) => ({ ...list, tasks: addCheckpoint(list.tasks, title) })),
    editCheckpoint: (id: string, title: string) => change((list) => ({ ...list, tasks: editCheckpoint(list.tasks, id, title) })),
    toggleCheckpoint: (id: string) => change((list) => ({ ...list, tasks: toggleCheckpoint(list.tasks, id) })),
    removeCheckpoint: (id: string) => change((list) => ({ ...list, tasks: removeCheckpoint(list.tasks, id) })),
  }
}
