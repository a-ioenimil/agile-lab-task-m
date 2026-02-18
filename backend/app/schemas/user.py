"""Pydantic schemas for user resources."""

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRead(BaseModel):
    """Public user representation for API responses."""

    id: int = Field(title="Id", description="Unique user identifier")
    email: EmailStr = Field(title="Email", description="User email address")
    full_name: str = Field(
        min_length=1,
        max_length=255,
        title="Full Name",
        description="Display name of the user",
    )

    model_config = ConfigDict(from_attributes=True)
