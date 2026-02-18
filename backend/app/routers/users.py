"""User directory routes."""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.user import UserRead

router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "",
    response_model=list[UserRead],
    summary="List users",
    description="Return users available for task assignment.",
    responses={200: {"description": "Users returned successfully."}},
)
async def get_users(
    _: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> list[UserRead]:
    """Return available users for assignment."""
    result = await session.execute(select(User).order_by(User.full_name.asc()))
    users = result.scalars().all()
    return [UserRead.model_validate(user) for user in users]
