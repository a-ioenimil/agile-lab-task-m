import pytest
from app.repositories.user_repository import UserRepository
from app.models.user import User

@pytest.fixture
def user_repository(db_session):
    return UserRepository(db_session)

@pytest.mark.asyncio
async def test_create_user(user_repository):
    email = "repo_create@example.com"
    user = await user_repository.create(email, "hashed", "Repo User")
    assert user.id is not None
    assert user.email == email

@pytest.mark.asyncio
async def test_get_by_email(user_repository):
    email = "repo_get@example.com"
    await user_repository.create(email, "hashed", "Repo Get")
    
    user = await user_repository.get_by_email(email)
    assert user is not None
    assert user.email == email
    
    missing = await user_repository.get_by_email("missing@example.com")
    assert missing is None

@pytest.mark.asyncio
async def test_get_by_id(user_repository):
    user = await user_repository.create("repo_id@example.com", "hashed", "Repo ID")
    
    found = await user_repository.get_by_id(user.id)
    assert found is not None
    assert found.id == user.id
