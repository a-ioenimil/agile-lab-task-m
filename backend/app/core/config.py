"""Application configuration loaded from environment variables."""

from functools import lru_cache

from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration for the Dispatch backend service."""

    postgres_user: str = "dispatch_user"
    postgres_password: str = "dispatch_password"
    postgres_db: str = "dispatch_db"
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    sqlalchemy_echo: bool = False

    model_config = SettingsConfigDict(
        env_file="../.env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @computed_field
    @property
    def database_url(self) -> str:
        """Build the async SQLAlchemy database URL from configured fields."""
        return (
            "postgresql+asyncpg://"
            f"{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )


@lru_cache
def get_settings() -> Settings:
    """Return a cached settings instance for the application lifecycle."""
    return Settings()


settings = get_settings()
