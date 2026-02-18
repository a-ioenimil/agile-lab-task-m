"""Shared SQLModel base for ORM models."""

from sqlmodel import SQLModel


class Base(SQLModel):
    """Base class for all SQLModel ORM models."""
