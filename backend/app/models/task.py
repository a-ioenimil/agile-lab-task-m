"""Task ORM model for workflow items."""

import enum

from sqlalchemy import Column, Enum, ForeignKey, String, Text
from sqlmodel import Field

from app.db.base import Base


class TaskStatus(str, enum.Enum):
    """Allowed task lifecycle states."""

    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TaskPriority(str, enum.Enum):
    """Allowed task priority levels."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Task(Base, table=True):
    """Task entity representing work items in Dispatch."""

    __tablename__ = "tasks"

    id: int | None = Field(default=None, primary_key=True, index=True)
    title: str = Field(sa_column=Column(String(255), nullable=False))
    description: str | None = Field(default=None, sa_column=Column(Text(), nullable=True))
    status: TaskStatus = Field(
        default=TaskStatus.TODO,
        sa_column=Column(Enum(TaskStatus, name="task_status"), nullable=False),
    )
    priority: TaskPriority = Field(
        default=TaskPriority.MEDIUM,
        sa_column=Column(Enum(TaskPriority, name="task_priority"), nullable=False),
    )
    creator_id: int = Field(
        sa_column=Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
    )
    assignee_id: int | None = Field(
        default=None,
        sa_column=Column(ForeignKey("users.id"), nullable=True),
    )
