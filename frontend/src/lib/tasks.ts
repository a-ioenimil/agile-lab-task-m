import { apiClient } from '@/lib/api'
import type { AuthUser } from '@/lib/auth'

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

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

export async function getTasks(): Promise<TaskRecord[]> {
  const response = await apiClient.get<TaskRecord[]>('/tasks')
  return response.data
}

export async function createTask(payload: TaskCreatePayload): Promise<TaskRecord> {
  const response = await apiClient.post<TaskRecord>('/tasks', payload)
  return response.data
}

export async function getUsers(): Promise<AuthUser[]> {
  const response = await apiClient.get<AuthUser[]>('/users')
  return response.data
}
