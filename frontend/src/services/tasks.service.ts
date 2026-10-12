import { api } from './api'
import type { TaskList } from '@/lib/trailMission'

export const tasksService = {
  async load(token: string): Promise<TaskList> {
    const response = await api.get<TaskList>('/tasks', { headers: { Authorization: `Bearer ${token}` } })
    return response.data
  },
  async save(list: TaskList, token: string): Promise<void> {
    await api.put('/tasks', list, { headers: { Authorization: `Bearer ${token}` } })
  },
}
