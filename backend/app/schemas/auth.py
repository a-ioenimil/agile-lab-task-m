"""Pydantic schemas for authentication workflows."""

from pydantic import BaseModel, EmailStr, Field

from app.schemas.user import UserRead


class RegisterRequest(BaseModel):
    """Request payload for user registration."""

    email: EmailStr = Field(
        title="Email",
        description="Unique email address for the new user account",
    )
    password: str = Field(
        min_length=8,
        max_length=72,
        title="Password",
        description="Raw password that will be hashed before persistence",
    )
    full_name: str = Field(
        min_length=1,
        max_length=255,
        title="Full Name",
        description="Display name for the account owner",
    )


class LoginRequest(BaseModel):
    """Request payload for user login."""

    email: EmailStr = Field(title="Email", description="Email used to identify the account")
    password: str = Field(
        min_length=8,
        max_length=72,
        title="Password",
        description="Raw password used for credential verification",
    )


class TokenPayload(BaseModel):
    """Token details returned after successful authentication."""

    access_token: str = Field(
        title="Access Token",
        description="JWT access token used in Authorization headers",
    )
    refresh_token: str = Field(
        title="Refresh Token",
        description="JWT refresh token for issuing future access tokens",
    )
    token_type: str = Field(
        default="bearer",
        title="Token Type",
        description="Authentication scheme for token usage",
    )


class AuthResponse(BaseModel):
    """Authentication response containing tokens and user profile."""

    tokens: TokenPayload = Field(title="Tokens", description="Issued token pair for the session")
    user: UserRead = Field(title="User", description="Authenticated user profile")
