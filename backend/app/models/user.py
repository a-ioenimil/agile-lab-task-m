"""User ORM model for authentication and ownership boundaries."""

from sqlalchemy import Column, String
from sqlmodel import Field

from app.db.base import Base


class User(Base, table=True):
    """Application user entity."""

    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True, index=True)
    email: str = Field(
        sa_column=Column(String(255), unique=True, index=True, nullable=False),
    )
    hashed_password: str = Field(sa_column=Column(String(255), nullable=False))
    full_name: str = Field(sa_column=Column(String(255), nullable=False))
