import pytest
from app.repositories.task_repository import TaskRepository
from app.repositories.user_repository import UserRepository
from app.models.task import TaskPriority

@pytest.fixture
def task_repository(db_session):
    return TaskRepository(db_session)

@pytest.fixture
def user_repository(db_session):
    return UserRepository(db_session)

@pytest.mark.asyncio
async def test_create_with_owner(task_repository, user_repository):
    user = await user_repository.create("task_owner@example.com", "pass", "Owner")
    task = await task_repository.create_with_owner(
        owner_id=user.id,
        title="Repo Task",
        description="Desc",
        priority=TaskPriority.LOW,
        assignee_id=None
    )
    assert task.id is not None
    assert task.creator_id == user.id

@pytest.mark.asyncio
async def test_get_multi(task_repository, user_repository):
    u1 = await user_repository.create("multi1@example.com", "pass", "M1")
    u2 = await user_repository.create("multi2@example.com", "pass", "M2")
    
    await task_repository.create_with_owner(u1.id, "T1", None, TaskPriority.LOW, None)
    await task_repository.create_with_owner(u2.id, "T2", None, TaskPriority.LOW, assignee_id=u1.id)
    
    tasks = await task_repository.get_multi(u1.id)
    assert len(tasks) == 2

@pytest.mark.asyncio
async def test_update(task_repository, user_repository):
    user = await user_repository.create("update@example.com", "pass", "Update")
    task = await task_repository.create_with_owner(user.id, "Original", None, TaskPriority.LOW, None)
    
    updated = await task_repository.update(task, {"title": "Changed"})
    assert updated.title == "Changed"
    
    # Verify persistence
    refetched = await task_repository.get_by_id(task.id)
    assert refetched.title == "Changed"

@pytest.mark.asyncio
async def test_remove(task_repository, user_repository):
    user = await user_repository.create("remove@example.com", "pass", "Remove")
    task = await task_repository.create_with_owner(user.id, "To Delete", None, TaskPriority.LOW, None)
    
    await task_repository.remove(task)
    assert await task_repository.get_by_id(task.id) is None
