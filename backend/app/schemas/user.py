"""Pydantic schemas for user resources."""

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRead(BaseModel):
    """Public user representation for API responses."""

    id: int
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=255)

    model_config = ConfigDict(from_attributes=True)
