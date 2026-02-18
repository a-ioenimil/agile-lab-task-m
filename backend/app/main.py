"""Application entrypoint for the Dispatch backend."""

from fastapi import FastAPI

from app.routers.auth import router as auth_router
from app.routers.health import router as health_router
from app.routers.tasks import router as tasks_router
from app.routers.users import router as users_router


def create_application() -> FastAPI:
    """Create and configure the FastAPI application instance."""
    application = FastAPI(title="Dispatch API", version="0.1.0")
    application.include_router(health_router)
    application.include_router(auth_router)
    application.include_router(tasks_router)
    application.include_router(users_router)
    return application


app = create_application()
