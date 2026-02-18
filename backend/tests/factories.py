from polyfactory.factories.pydantic_factory import ModelFactory
from app.models.user import User
from app.models.task import Task, TaskStatus, TaskPriority

class UserFactory(ModelFactory[User]):
    __model__ = User

class TaskFactory(ModelFactory[Task]):
    __model__ = Task
