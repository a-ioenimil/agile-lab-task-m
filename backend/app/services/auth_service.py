"""Service layer for authentication business logic."""

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import TokenPayload


class EmailAlreadyExistsError(Exception):
    """Raised when attempting to register an email that already exists."""


class InvalidCredentialsError(Exception):
    """Raised when provided login credentials are invalid."""


class UnauthorizedError(Exception):
    """Raised when authentication token is missing or invalid."""


class AuthService:
    """Authentication orchestration for user registration and login."""

    def __init__(self, user_repository: UserRepository) -> None:
        """Initialize service with repository dependencies."""
        self.user_repository = user_repository

    async def register_user(self, email: str, password: str, full_name: str) -> User:
        """Register a new user after enforcing unique email constraint."""
        existing_user = await self.user_repository.get_by_email(email)
        if existing_user is not None:
            raise EmailAlreadyExistsError("Email is already registered")

        hashed_password = hash_password(password)
        return await self.user_repository.create(
            email=email,
            hashed_password=hashed_password,
            full_name=full_name,
        )

    async def authenticate_user(self, email: str, password: str) -> User:
        """Validate user credentials and return the authenticated user."""
        user = await self.user_repository.get_by_email(email)
        if user is None or not verify_password(password, user.hashed_password):
            raise InvalidCredentialsError("Invalid email or password")
        return user

    def create_tokens_for_user(self, user: User) -> TokenPayload:
        """Generate access and refresh tokens for the authenticated user."""
        subject = str(user.id)
        return TokenPayload(
            access_token=create_access_token(subject),
            refresh_token=create_refresh_token(subject),
        )

    async def get_current_user(self, access_token: str) -> User:
        """Resolve and validate current user from access token."""
        try:
            payload = decode_access_token(access_token)
        except ValueError as exc:
            raise UnauthorizedError("Invalid access token") from exc

        subject = payload.get("sub")
        if subject is None:
            raise UnauthorizedError("Token subject is missing")

        user = await self.user_repository.get_by_id(int(subject))
        if user is None:
            raise UnauthorizedError("User not found")

        return user
