import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createTask,
  getTasks,
  getUsers,
  updateTask,
  type TaskCreatePayload,
  type TaskRecord,
  type TaskStatus,
} from '@/lib/tasks'

export const TASKS_QUERY_KEY = ['tasks']
export const USERS_QUERY_KEY = ['users']

interface UpdateTaskStatusPayload {
  taskId: number
  status: TaskStatus
}

interface UpdateTaskStatusContext {
  previousTasks: TaskRecord[] | undefined
}

export function useTasks() {
  const queryClient = useQueryClient()

  const tasksQuery = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: getTasks,
  })

  const usersQuery = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: getUsers,
  })

  const createTaskMutation = useMutation({
    mutationFn: (payload: TaskCreatePayload) => createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    },
  })

  const updateTaskStatusMutation = useMutation<
    TaskRecord,
    Error,
    UpdateTaskStatusPayload,
    UpdateTaskStatusContext
  >({
    mutationFn: ({ taskId, status }) => updateTask(taskId, { status }),
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY })
      const previousTasks = queryClient.getQueryData<TaskRecord[]>(TASKS_QUERY_KEY)

      queryClient.setQueryData<TaskRecord[]>(TASKS_QUERY_KEY, (cachedTasks) => {
        if (cachedTasks === undefined) {
          return cachedTasks
        }

        return cachedTasks.map((task) => {
          if (task.id !== taskId) {
            return task
          }
          return { ...task, status }
        })
      })

      return { previousTasks }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTasks !== undefined) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    },
  })

  return {
    tasksQuery,
    usersQuery,
    createTaskMutation,
    updateTaskStatusMutation,
  }
}
