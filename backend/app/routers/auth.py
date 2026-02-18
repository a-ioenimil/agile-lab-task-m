"""Authentication routes for user registration and login."""

from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest
from app.schemas.user import UserRead
from app.services.auth_service import (
    AuthService,
    EmailAlreadyExistsError,
    InvalidCredentialsError,
    UnauthorizedError,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def get_auth_service(session: Annotated[AsyncSession, Depends(get_db_session)]) -> AuthService:
    """Build an auth service instance for request-scoped operations."""
    return AuthService(UserRepository(session))


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(
    payload: RegisterRequest,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> AuthResponse:
    """Register a user and return issued tokens."""
    try:
        user = await auth_service.register_user(
            email=payload.email,
            password=payload.password,
            full_name=payload.full_name,
        )
    except EmailAlreadyExistsError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    tokens = auth_service.create_tokens_for_user(user)
    return AuthResponse(tokens=tokens, user=UserRead.model_validate(user))


@router.post("/login", response_model=AuthResponse)
async def login(
    payload: LoginRequest,
    auth_service: Annotated[AuthService, Depends(get_auth_service)],
) -> AuthResponse:
    """Authenticate a user and return issued tokens."""
    try:
        user = await auth_service.authenticate_user(payload.email, payload.password)
    except InvalidCredentialsError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc

    tokens = auth_service.create_tokens_for_user(user)
    return AuthResponse(tokens=tokens, user=UserRead.model_validate(user))


async def get_current_user(
    authorization: Annotated[str | None, Header(alias="Authorization")] = None,
    auth_service: Annotated[AuthService, Depends(get_auth_service)] = None,
) -> User:
    """Resolve authenticated user from a bearer access token."""
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
        )

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization scheme",
        )

    try:
        return await auth_service.get_current_user(token)
    except UnauthorizedError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc
