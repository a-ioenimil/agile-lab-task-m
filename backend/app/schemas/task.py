"""Pydantic schemas for task resources."""

from pydantic import BaseModel, ConfigDict, Field

from app.models.task import TaskPriority, TaskStatus


class TaskCreate(BaseModel):
    """Payload for creating a task."""

    title: str = Field(
        min_length=1,
        max_length=255,
        title="Title",
        description="Short human-readable task title",
    )
    description: str | None = Field(
        default=None,
        title="Description",
        description="Optional long-form details for the task",
    )
    priority: TaskPriority = Field(
        default=TaskPriority.MEDIUM,
        title="Priority",
        description="Task urgency level",
    )
    assignee_id: int | None = Field(
        default=None,
        title="Assignee Id",
        description="User id of the assigned collaborator",
    )


class TaskUpdate(BaseModel):
    """Payload for updating task details."""

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
        title="Title",
        description="Updated task title",
    )
    description: str | None = Field(
        default=None,
        title="Description",
        description="Updated task description",
    )
    status: TaskStatus | None = Field(
        default=None,
        title="Status",
        description="Workflow status for Kanban progression",
    )
    priority: TaskPriority | None = Field(
        default=None,
        title="Priority",
        description="Updated task urgency level",
    )
    assignee_id: int | None = Field(
        default=None,
        title="Assignee Id",
        description="Updated assigned user id",
    )


class TaskRead(BaseModel):
    """Public task representation returned by API."""

    id: int = Field(title="Id", description="Unique task identifier")
    title: str = Field(title="Title", description="Task title")
    description: str | None = Field(title="Description", description="Task details")
    status: TaskStatus = Field(title="Status", description="Current workflow status")
    priority: TaskPriority = Field(title="Priority", description="Current priority level")
    creator_id: int = Field(title="Creator Id", description="User id of task creator")
    assignee_id: int | None = Field(
        title="Assignee Id",
        description="User id of current assignee",
    )

    model_config = ConfigDict(from_attributes=True)
