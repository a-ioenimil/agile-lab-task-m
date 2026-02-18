import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createTask, getTasks, getUsers, type TaskCreatePayload } from '@/lib/tasks'

const TASKS_QUERY_KEY = ['tasks']
const USERS_QUERY_KEY = ['users']

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

  return {
    tasksQuery,
    usersQuery,
    createTaskMutation,
  }
}
