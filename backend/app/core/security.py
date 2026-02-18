"""Security utilities for password hashing and JWT operations."""

from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a plaintext password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plaintext password against hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
    """Create a signed JWT access token for a subject identifier."""
    expiration = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    )
    payload = {"sub": subject, "exp": expiration, "type": "access"}
    return jwt.encode(payload, settings.jwt_access_secret_key, algorithm=settings.jwt_algorithm)


def create_refresh_token(subject: str, expires_delta: timedelta | None = None) -> str:
    """Create a signed JWT refresh token for a subject identifier."""
    expiration = datetime.now(timezone.utc) + (
        expires_delta or timedelta(days=settings.refresh_token_expire_days)
    )
    payload = {"sub": subject, "exp": expiration, "type": "refresh"}
    return jwt.encode(payload, settings.jwt_refresh_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode and validate an access token payload."""
    try:
        payload = jwt.decode(
            token,
            settings.jwt_access_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
    except JWTError as exc:
        raise ValueError("Invalid access token") from exc

    if payload.get("type") != "access":
        raise ValueError("Invalid access token type")

    return payload


def decode_refresh_token(token: str) -> dict[str, Any]:
    """Decode and validate a refresh token payload."""
    try:
        payload = jwt.decode(
            token,
            settings.jwt_refresh_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
    except JWTError as exc:
        raise ValueError("Invalid refresh token") from exc

    if payload.get("type") != "refresh":
        raise ValueError("Invalid refresh token type")

    return payload
