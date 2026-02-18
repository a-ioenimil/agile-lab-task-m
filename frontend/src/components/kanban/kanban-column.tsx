import { Droppable } from '@hello-pangea/dnd'
import { AnimatePresence } from 'framer-motion'

import { TaskCard } from '@/components/kanban/task-card'
import type { TaskRecord, TaskStatus } from '@/lib/tasks'

interface KanbanColumnProps {
  status: TaskStatus
  title: string
  tasks: TaskRecord[]
  assigneeNameById: Map<number, string>
}

export function KanbanColumn({ status, title, tasks, assigneeNameById }: KanbanColumnProps) {
  return (
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <section
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={[
            'rounded-xl border border-white/10 bg-black/30 p-3',
            snapshot.isDraggingOver ? 'bg-black/45' : '',
          ].join(' ')}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide text-amber-100">{title}</h3>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-amber-100/80">
              {tasks.length}
            </span>
          </div>

          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  assigneeName={
                    task.assignee_id === null
                      ? 'Unassigned'
                      : (assigneeNameById.get(task.assignee_id) ?? 'Unknown')
                  }
                />
              ))}
            </AnimatePresence>
            {tasks.length === 0 ? (
              <p className="rounded-md border border-dashed border-white/10 px-3 py-5 text-center text-xs text-amber-100/65">
                No tasks found
              </p>
            ) : null}
            {provided.placeholder}
          </div>
        </section>
      )}
    </Droppable>
  )
}
