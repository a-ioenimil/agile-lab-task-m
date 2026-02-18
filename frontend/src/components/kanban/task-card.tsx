import { motion } from 'framer-motion'
import { Draggable } from '@hello-pangea/dnd'

import { cn } from '@/lib/utils'
import type { TaskPriority, TaskRecord } from '@/lib/tasks'

interface TaskCardProps {
  task: TaskRecord
  index: number
  assigneeName: string
}

const priorityBadgeClassMap: Record<TaskPriority, string> = {
  high: 'bg-red-400/15 text-red-200',
  medium: 'bg-amber-300/20 text-amber-100',
  low: 'bg-blue-400/20 text-blue-100',
}

function getInitials(name: string): string {
  const parts = name
    .split(' ')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)

  if (parts.length === 0) {
    return 'NA'
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

export function TaskCard({ task, index, assigneeName }: TaskCardProps) {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            'rounded-lg border border-white/10 bg-black/35 p-4',
            snapshot.isDragging ? 'ring-2 ring-amber-200/60' : 'ring-0',
          )}
        >
          <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-medium text-amber-50">{task.title}</h3>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                  priorityBadgeClassMap[task.priority],
                )}
              >
                {task.priority}
              </span>
            </div>

            <p className="mt-2 text-xs text-amber-100/70">{task.description ?? 'No description'}</p>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-200 text-xs font-semibold text-black">
                {getInitials(assigneeName)}
              </div>
              <span className="text-xs text-amber-100/80">{assigneeName}</span>
            </div>
          </motion.div>
        </article>
      )}
    </Draggable>
  )
}
