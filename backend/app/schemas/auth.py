"""Pydantic schemas for authentication workflows."""

from pydantic import BaseModel, EmailStr, Field

from app.schemas.user import UserRead


class RegisterRequest(BaseModel):
    """Request payload for user registration."""

    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    full_name: str = Field(min_length=1, max_length=255)


class LoginRequest(BaseModel):
    """Request payload for user login."""

    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class TokenPayload(BaseModel):
    """Token details returned after successful authentication."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class AuthResponse(BaseModel):
    """Authentication response containing tokens and user profile."""

    tokens: TokenPayload
    user: UserRead
