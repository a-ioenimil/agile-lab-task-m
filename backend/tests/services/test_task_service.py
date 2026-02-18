import pytest
from app.services.task_service import TaskService, TaskNotFoundError, TaskForbiddenError
from app.repositories.task_repository import TaskRepository
from app.repositories.user_repository import UserRepository
from app.schemas.task import TaskCreate, TaskUpdate, TaskPriority, TaskStatus
from tests.factories import UserFactory, TaskFactory

@pytest.fixture
def task_repository(db_session):
    return TaskRepository(db_session)

@pytest.fixture
def task_service(task_repository):
    return TaskService(task_repository)

@pytest.fixture
def user_repository(db_session):
    return UserRepository(db_session)

@pytest.mark.asyncio
async def test_create_task(task_service, user_repository):
    user = await user_repository.create("taskcreator@example.com", "pass", "Creator")
    payload = TaskCreate(title="New Task", description="Desc", priority=TaskPriority.HIGH)
    
    task = await task_service.create_task(user.id, payload)
    
    assert task.title == payload.title
    assert task.creator_id == user.id
    assert task.status == TaskStatus.TODO

@pytest.mark.asyncio
async def test_get_tasks_for_user(task_service, task_repository, user_repository):
    user1 = await user_repository.create("u1@example.com", "pass", "U1")
    user2 = await user_repository.create("u2@example.com", "pass", "U2")
    
    # Task created by user1
    await task_service.create_task(user1.id, TaskCreate(title="Task 1"))
    # Task assigned to user1
    await task_service.create_task(user2.id, TaskCreate(title="Task 2", assignee_id=user1.id))
    # Task unrelated to user1
    await task_service.create_task(user2.id, TaskCreate(title="Task 3"))
    
    tasks = await task_service.get_tasks_for_user(user1.id)
    assert len(tasks) == 2
    titles = {t.title for t in tasks}
    assert "Task 1" in titles
    assert "Task 2" in titles

@pytest.mark.asyncio
async def test_update_task_success(task_service, task_repository, user_repository):
    user = await user_repository.create("updater@example.com", "pass", "Updater")
    task = await task_service.create_task(user.id, TaskCreate(title="Original"))
    
    update_payload = TaskUpdate(title="Updated", status=TaskStatus.IN_PROGRESS)
    updated_task = await task_service.update_task(user.id, task.id, update_payload)
    
    assert updated_task.title == "Updated"
    assert updated_task.status == TaskStatus.IN_PROGRESS

@pytest.mark.asyncio
async def test_update_task_forbidden(task_service, user_repository, task_repository):
    owner = await user_repository.create("owner@example.com", "pass", "Owner")
    other = await user_repository.create("other@example.com", "pass", "Other")
    task = await task_service.create_task(owner.id, TaskCreate(title="Task"))
    
    with pytest.raises(TaskForbiddenError):
        await task_service.update_task(other.id, task.id, TaskUpdate(title="Hacked"))

@pytest.mark.asyncio
async def test_delete_task_success(task_service, user_repository):
    user = await user_repository.create("deleter@example.com", "pass", "Deleter")
    task = await task_service.create_task(user.id, TaskCreate(title="Task"))
    
    await task_service.delete_task(user.id, task.id)
    
    assert await task_service.task_repository.get_by_id(task.id) is None
