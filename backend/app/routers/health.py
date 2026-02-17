"""Health check routes for service status verification."""

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health", summary="Health check")
async def health_check() -> dict[str, str]:
    """Return backend health status."""
    return {"status": "ok"}
