import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

import { KanbanColumn } from '@/components/kanban/kanban-column'
import { taskStatusLabelMap, taskStatusOrder, type TaskRecord, type TaskStatus } from '@/lib/tasks'

interface KanbanBoardProps {
  tasks: TaskRecord[]
  assigneeNameById: Map<number, string>
  onTaskStatusChange: (taskId: number, nextStatus: TaskStatus) => Promise<void>
}

function groupTasksByStatus(tasks: TaskRecord[]): Record<TaskStatus, TaskRecord[]> {
  return {
    todo: tasks.filter((task) => task.status === 'todo'),
    in_progress: tasks.filter((task) => task.status === 'in_progress'),
    done: tasks.filter((task) => task.status === 'done'),
  }
}

export function KanbanBoard({ tasks, assigneeNameById, onTaskStatusChange }: KanbanBoardProps) {
  const [boardTasks, setBoardTasks] = useState<TaskRecord[]>(tasks)

  useEffect(() => {
    setBoardTasks(tasks)
  }, [tasks])

  const groupedTasks = useMemo(() => groupTasksByStatus(boardTasks), [boardTasks])

  async function handleDragEnd(result: DropResult): Promise<void> {
    const destination = result.destination
    if (destination === null) {
      return
    }

    const sourceStatus = result.source.droppableId as TaskStatus
    const destinationStatus = destination.droppableId as TaskStatus

    if (sourceStatus === destinationStatus && result.source.index === destination.index) {
      return
    }

    const sourceTasks = [...groupedTasks[sourceStatus]]
    const movedTask = sourceTasks[result.source.index]
    if (movedTask === undefined) {
      return
    }

    sourceTasks.splice(result.source.index, 1)

    const destinationTasks =
      sourceStatus === destinationStatus ? sourceTasks : [...groupedTasks[destinationStatus]]

    const updatedMovedTask: TaskRecord =
      sourceStatus === destinationStatus
        ? movedTask
        : {
            ...movedTask,
            status: destinationStatus,
          }

    destinationTasks.splice(destination.index, 0, updatedMovedTask)

    const nextGroupedTasks: Record<TaskStatus, TaskRecord[]> = {
      ...groupedTasks,
      [sourceStatus]: sourceTasks,
      [destinationStatus]: destinationTasks,
    }

    const nextBoardTasks = taskStatusOrder.flatMap((status) => nextGroupedTasks[status])
    setBoardTasks(nextBoardTasks)

    if (sourceStatus !== destinationStatus) {
      try {
        await onTaskStatusChange(updatedMovedTask.id, destinationStatus)
      } catch {
        setBoardTasks(tasks)
      }
    }
  }

  return (
    <DragDropContext
      onDragEnd={(result) => {
        void handleDragEnd(result)
      }}
    >
      <motion.div layout className="grid gap-4 lg:grid-cols-3">
        {taskStatusOrder.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            title={taskStatusLabelMap[status]}
            tasks={groupedTasks[status]}
            assigneeNameById={assigneeNameById}
          />
        ))}
      </motion.div>
    </DragDropContext>
  )
}
