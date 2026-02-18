import pytest
from app.services.auth_service import AuthService, EmailAlreadyExistsError, InvalidCredentialsError
from app.repositories.user_repository import UserRepository
from tests.factories import UserFactory

@pytest.fixture
def user_repository(db_session):
    return UserRepository(db_session)

@pytest.fixture
def auth_service(user_repository):
    return AuthService(user_repository)

@pytest.mark.asyncio
async def test_register_user(auth_service, db_session):
    email = "test@example.com"
    password = "password123"
    full_name = "Test User"

    user = await auth_service.register_user(email, password, full_name)

    assert user.email == email
    assert user.full_name == full_name
    assert user.hashed_password != password # Should be hashed

@pytest.mark.asyncio
async def test_register_user_duplicate_email(auth_service, db_session):
    # Create user directly using factory or service
    existing_email = "duplicate@example.com"
    await auth_service.register_user(existing_email, "password", "First User")
    
    with pytest.raises(EmailAlreadyExistsError):
        await auth_service.register_user(existing_email, "newpassword", "Second User")

@pytest.mark.asyncio
async def test_authenticate_user_success(auth_service, db_session):
    email = "login@example.com"
    password = "securepassword"
    await auth_service.register_user(email, password, "Login User")

    user = await auth_service.authenticate_user(email, password)
    assert user is not None
    assert user.email == email

@pytest.mark.asyncio
async def test_authenticate_user_invalid_credentials(auth_service, db_session):
    email = "wrong@example.com"
    password = "password"
    await auth_service.register_user(email, password, "Wrong User")

    with pytest.raises(InvalidCredentialsError):
        await auth_service.authenticate_user(email, "wrongpassword")

    with pytest.raises(InvalidCredentialsError):
        await auth_service.authenticate_user("nonexistent@example.com", password)
