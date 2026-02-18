import { apiClient } from '@/lib/api'
import type { AuthUser } from '@/lib/auth'

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export const taskStatusOrder: TaskStatus[] = ['todo', 'in_progress', 'done']

export const taskStatusLabelMap: Record<TaskStatus, string> = {
  todo: 'OPEN',
  in_progress: 'IN_PROGRESS',
  done: 'DONE',
}

export interface TaskRecord {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  creator_id: number
  assignee_id: number | null
}

export interface TaskCreatePayload {
  title: string
  description?: string
  priority: TaskPriority
  assignee_id?: number
}

export interface TaskUpdatePayload {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assignee_id?: number
}

export async function getTasks(): Promise<TaskRecord[]> {
  const response = await apiClient.get<TaskRecord[]>('/tasks')
  return response.data
}

export async function createTask(payload: TaskCreatePayload): Promise<TaskRecord> {
  const response = await apiClient.post<TaskRecord>('/tasks', payload)
  return response.data
}

export async function updateTask(taskId: number, payload: TaskUpdatePayload): Promise<TaskRecord> {
  const response = await apiClient.put<TaskRecord>(`/tasks/${taskId}`, payload)
  return response.data
}

export async function getUsers(): Promise<AuthUser[]> {
  const response = await apiClient.get<AuthUser[]>('/users')
  return response.data
}
