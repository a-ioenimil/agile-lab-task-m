"""Repository layer for user persistence operations."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


class UserRepository:
    """Data access operations for users."""

    def __init__(self, session: AsyncSession) -> None:
        """Initialize repository with an async database session."""
        self.session = session

    async def get_by_email(self, email: str) -> User | None:
        """Find a user by unique email address."""
        statement = select(User).where(User.email == email)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_by_id(self, user_id: int) -> User | None:
        """Find a user by primary key."""
        statement = select(User).where(User.id == user_id)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def create(self, email: str, hashed_password: str, full_name: str) -> User:
        """Create and persist a new user record."""
        user = User(email=email, hashed_password=hashed_password, full_name=full_name)
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user
