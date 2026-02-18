"""Task ORM model for workflow items."""

import enum

from sqlalchemy import Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

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


class Task(Base):
    """Task entity representing work items in Dispatch."""

    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text(), nullable=True)
    status: Mapped[TaskStatus] = mapped_column(
        Enum(TaskStatus, name="task_status"),
        default=TaskStatus.TODO,
        nullable=False,
    )
    priority: Mapped[TaskPriority] = mapped_column(
        Enum(TaskPriority, name="task_priority"),
        default=TaskPriority.MEDIUM,
        nullable=False,
    )
    creator_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    assignee_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
