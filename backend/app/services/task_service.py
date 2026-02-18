"""Service layer for task management workflows."""

from app.models.task import Task
from app.repositories.task_repository import TaskRepository
from app.schemas.task import TaskCreate, TaskUpdate


class TaskNotFoundError(Exception):
    """Raised when task record is missing."""


class TaskForbiddenError(Exception):
    """Raised when task operation is not allowed for the user."""


class TaskService:
    """Task orchestration service for CRUD operations."""

    def __init__(self, task_repository: TaskRepository) -> None:
        """Initialize service with repository dependency."""
        self.task_repository = task_repository

    async def get_tasks_for_user(self, user_id: int) -> list[Task]:
        """Get all visible tasks for a user."""
        return await self.task_repository.get_multi(user_id)

    async def create_task(self, creator_id: int, payload: TaskCreate) -> Task:
        """Create task owned by authenticated user."""
        return await self.task_repository.create_with_owner(
            owner_id=creator_id,
            title=payload.title,
            description=payload.description,
            priority=payload.priority,
            assignee_id=payload.assignee_id,
        )

    async def update_task(self, user_id: int, task_id: int, payload: TaskUpdate) -> Task:
        """Update editable fields for a task if user has access."""
        task = await self.task_repository.get_by_id(task_id)
        if task is None:
            raise TaskNotFoundError("Task not found")

        if user_id not in (task.creator_id, task.assignee_id):
            raise TaskForbiddenError("Not allowed to update this task")

        updates = payload.model_dump(exclude_unset=True)
        return await self.task_repository.update(task, updates)

    async def delete_task(self, user_id: int, task_id: int) -> None:
        """Delete a task if user is task creator."""
        task = await self.task_repository.get_by_id(task_id)
        if task is None:
            raise TaskNotFoundError("Task not found")

        if user_id != task.creator_id:
            raise TaskForbiddenError("Only creator can delete task")

        await self.task_repository.remove(task)
