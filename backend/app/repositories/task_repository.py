"""Repository layer for task persistence operations."""

from sqlalchemy import Select, delete, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task, TaskPriority


class TaskRepository:
    """Data access operations for task entities."""

    def __init__(self, session: AsyncSession) -> None:
        """Initialize repository with async session."""
        self.session = session

    async def get_multi(self, user_id: int) -> list[Task]:
        """Return all tasks where user is creator or assignee."""
        statement: Select[tuple[Task]] = (
            select(Task)
            .where(or_(Task.creator_id == user_id, Task.assignee_id == user_id))
            .order_by(Task.id.desc())
        )
        result = await self.session.execute(statement)
        return list(result.scalars().all())

    async def get_by_id(self, task_id: int) -> Task | None:
        """Find task by primary key."""
        statement: Select[tuple[Task]] = select(Task).where(Task.id == task_id)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def create_with_owner(
        self,
        owner_id: int,
        title: str,
        description: str | None,
        priority: TaskPriority,
        assignee_id: int | None,
    ) -> Task:
        """Create and persist a task owned by a given user."""
        task = Task(
            title=title,
            description=description,
            priority=priority,
            creator_id=owner_id,
            assignee_id=assignee_id,
        )
        self.session.add(task)
        await self.session.commit()
        await self.session.refresh(task)
        return task

    async def update(self, task: Task, updates: dict[str, object | None]) -> Task:
        """Apply updates to task and persist changes."""
        for field_name, field_value in updates.items():
            setattr(task, field_name, field_value)
        await self.session.commit()
        await self.session.refresh(task)
        return task

    async def remove(self, task: Task) -> None:
        """Hard-delete a task record."""
        await self.session.execute(delete(Task).where(Task.id == task.id))
        await self.session.commit()
