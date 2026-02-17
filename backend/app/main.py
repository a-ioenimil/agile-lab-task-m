"""Application entrypoint for the Dispatch backend."""

from fastapi import FastAPI

from app.routers.health import router as health_router


def create_application() -> FastAPI:
    """Create and configure the FastAPI application instance."""
    application = FastAPI(title="Dispatch API", version="0.1.0")
    application.include_router(health_router)
    return application


app = create_application()
