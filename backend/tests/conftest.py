import asyncio
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlmodel import SQLModel
from sqlalchemy.pool import NullPool

from app.core.config import settings
from app.db.base import Base

# Force test database name
TEST_DB_NAME = "test_dispatch_db"

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
def test_db_url():
    """Override database URL to use test database."""
    # Replace the database name in the configured URL
    original_url = str(settings.database_url)
    # This is a simple string replacement, assuming the format is correct
    # A more robust way would be to parse and replace
    if settings.postgres_db in original_url:
        return original_url.replace(settings.postgres_db, TEST_DB_NAME)
    return original_url

@pytest.fixture(scope="session")
async def db_engine(test_db_url):
    """Create async engine for the test database."""
    # First, we need to create the database if it doesn't exist.
    # We connect to the default database to do this.
    default_db_url = str(settings.database_url).replace(settings.postgres_db, "postgres")
    
    from sqlalchemy import text
    
    # We use a separate engine for admin tasks
    admin_engine = create_async_engine(default_db_url, isolation_level="AUTOCOMMIT")
    
    async with admin_engine.connect() as conn:
        # Check if database exists
        result = await conn.execute(
            text(f"SELECT 1 FROM pg_database WHERE datname = '{TEST_DB_NAME}'")
        )
        if not result.scalar():
            await conn.execute(text(f"CREATE DATABASE {TEST_DB_NAME}"))
    
    await admin_engine.dispose()

    # Now connect to the test database
    engine = create_async_engine(test_db_url, poolclass=NullPool, echo=False)
    
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
        
    yield engine
    
    # Teardown - Drop tables
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)
    
    await engine.dispose()

@pytest.fixture(scope="function")
async def db_session(db_engine):
    """Yield a database session with transaction rollback."""
    connection = await db_engine.connect()
    transaction = await connection.begin()
    
    session_maker = async_sessionmaker(
        bind=connection,
        class_=AsyncSession,
        expire_on_commit=False,
        join_transaction_mode="create_savepoint",
    )
    
    async with session_maker() as session:
        yield session
    
    await transaction.rollback()
    await connection.close()
