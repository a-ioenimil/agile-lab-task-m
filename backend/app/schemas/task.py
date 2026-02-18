"""Pydantic schemas for task resources."""

from pydantic import BaseModel, ConfigDict, Field

from app.models.task import TaskPriority, TaskStatus


class TaskCreate(BaseModel):
    """Payload for creating a task."""

    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    priority: TaskPriority = TaskPriority.MEDIUM
    assignee_id: int | None = None


class TaskUpdate(BaseModel):
    """Payload for updating task details."""

    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    assignee_id: int | None = None


class TaskRead(BaseModel):
    """Public task representation returned by API."""

    id: int
    title: str
    description: str | None
    status: TaskStatus
    priority: TaskPriority
    creator_id: int
    assignee_id: int | None

    model_config = ConfigDict(from_attributes=True)
