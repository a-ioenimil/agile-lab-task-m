import { zodResolver } from '@hookform/resolvers/zod'
import { createRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Loader2, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { KanbanBoard } from '@/components/kanban/kanban-board'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { useTasks } from '@/hooks/use-tasks'
import { getAccessToken } from '@/lib/auth-session'
import type { TaskPriority, TaskStatus } from '@/lib/tasks'
import { rootRoute } from '@/routes/__root'

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  priority: z.enum(['low', 'medium', 'high']),
  assigneeId: z.string(),
})

type CreateTaskValues = z.infer<typeof createTaskSchema>

const priorityOptions: Array<{ label: string; value: TaskPriority }> = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]

function DashboardPage() {
  const navigate = useNavigate()
  const { signOut, user } = useAuth()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { tasksQuery, usersQuery, createTaskMutation, updateTaskStatusMutation } = useTasks()

  const form = useForm<CreateTaskValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      assigneeId: 'unassigned',
    },
  })

  const userNameById = useMemo(() => {
    const pairs = (usersQuery.data ?? []).map((member) => [member.id, member.full_name] as const)
    return new Map<number, string>(pairs)
  }, [usersQuery.data])

  function handleSignOut(): void {
    signOut()
    navigate({ to: '/login' })
  }

  function openCreateTaskDialog(): void {
    setIsCreateDialogOpen(true)
  }

  function closeCreateTaskDialog(): void {
    setIsCreateDialogOpen(false)
    form.reset({
      title: '',
      description: '',
      priority: 'medium',
      assigneeId: 'unassigned',
    })
  }

  async function onSubmit(values: CreateTaskValues): Promise<void> {
    const trimmedDescription = values.description?.trim()
    const parsedAssigneeId =
      values.assigneeId === 'unassigned' ? undefined : Number(values.assigneeId)

    await createTaskMutation.mutateAsync({
      title: values.title,
      description: trimmedDescription === '' ? undefined : trimmedDescription,
      priority: values.priority,
      assignee_id: parsedAssigneeId,
    })

    closeCreateTaskDialog()
  }

  async function onTaskStatusChange(taskId: number, nextStatus: TaskStatus): Promise<void> {
    await updateTaskStatusMutation.mutateAsync({ taskId, status: nextStatus })
  }

  const taskList = tasksQuery.data ?? []
  const isLoadingTasks = tasksQuery.isPending || usersQuery.isPending
  const hasTaskLoadError = tasksQuery.isError || usersQuery.isError

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b0d] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(252,211,77,0.2),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(245,158,11,0.2),transparent_45%)]" />
      <div className="relative z-10 mx-auto w-full max-w-6xl rounded-[24px] border border-white/10 bg-[#111114]/85 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-amber-50">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-200/70">Welcome, {user?.full_name ?? 'User'}.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="h-10 bg-amber-200 text-black hover:bg-amber-200"
              onClick={openCreateTaskDialog}
            >
              <Plus className="mr-2 h-4 w-4" />
              New task
            </Button>
            <Button
              className="h-10 bg-white/10 text-amber-100 hover:bg-white/15"
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          </div>
        </div>

        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-medium text-amber-50">Kanban board</h2>

          {updateTaskStatusMutation.isPending ? (
            <div className="flex items-center gap-2 text-sm text-amber-100/75">
              <Loader2 className="h-4 w-4 animate-spin" />
              Syncing board changes...
            </div>
          ) : null}

          {isLoadingTasks ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, columnIndex) => (
                <div
                  key={`skeleton-column-${columnIndex}`}
                  className="rounded-xl border border-white/10 bg-black/30 p-3"
                >
                  <div className="mb-3 h-4 w-24 animate-pulse rounded bg-white/10" />
                  <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, cardIndex) => (
                      <div
                        key={`skeleton-card-${columnIndex}-${cardIndex}`}
                        className="h-24 animate-pulse rounded-lg border border-white/10 bg-white/5"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {hasTaskLoadError ? (
            <p className="text-sm text-red-300">Unable to load tasks right now.</p>
          ) : null}

          {!isLoadingTasks && !hasTaskLoadError ? (
            <KanbanBoard
              tasks={taskList}
              assigneeNameById={userNameById}
              onTaskStatusChange={onTaskStatusChange}
            />
          ) : null}

          {updateTaskStatusMutation.isError ? (
            <p className="text-sm text-red-300">Task update failed. Board has been restored.</p>
          ) : null}
        </section>
      </div>

      {isCreateDialogOpen ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/65 p-4">
          <div className="w-full max-w-md rounded-[20px] border border-white/10 bg-[#111114] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <h2 className="text-xl font-semibold text-amber-50">Create task</h2>
            <p className="mt-1 text-sm text-amber-100/70">
              Add a task and assign it to a teammate.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-100/80">Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Task title"
                          className="h-11 border-white/10 bg-black/40 text-amber-50 placeholder:text-amber-100/30"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-100/80">Description</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={3}
                          placeholder="Optional details"
                          className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-amber-50 placeholder:text-amber-100/30 outline-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-100/80">Priority</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="h-11 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-amber-50 outline-none"
                        >
                          {priorityOptions.map((priorityOption) => (
                            <option key={priorityOption.value} value={priorityOption.value}>
                              {priorityOption.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assigneeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-100/80">Assignee</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="h-11 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-amber-50 outline-none"
                        >
                          <option value="unassigned">Unassigned</option>
                          {(usersQuery.data ?? []).map((member) => (
                            <option key={member.id} value={String(member.id)}>
                              {member.full_name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {createTaskMutation.isError ? (
                  <p className="text-sm text-red-300">Failed to create task. Try again.</p>
                ) : null}

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    className="h-10 bg-white/10 text-amber-100 hover:bg-white/15"
                    onClick={closeCreateTaskDialog}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createTaskMutation.isPending}
                    className="h-10 bg-amber-200 text-black hover:bg-amber-200"
                  >
                    {createTaskMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </span>
                    ) : (
                      'Create task'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: () => {
    if (getAccessToken() === null) {
      throw redirect({ to: '/login' })
    }
  },
  component: DashboardPage,
})
