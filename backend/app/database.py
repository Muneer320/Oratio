from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database
from app.config import settings

# Database setup
if settings.DATABASE_URL.startswith("sqlite"):
    # SQLite for local development
    SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL for production
    SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
metadata = MetaData()

# Async database
database = Database(SQLALCHEMY_DATABASE_URL)


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def connect_db():
    """Connect to database on startup"""
    await database.connect()
    print("✅ Database connected")


async def disconnect_db():
    """Disconnect from database on shutdown"""
    await database.disconnect()
    print("❌ Database disconnected")
