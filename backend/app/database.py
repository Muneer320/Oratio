from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database
from app.config import settings

# Database setup (fallback - not used with Replit DB)
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

# Always use SQLite as fallback since we're using Replit DB
if not SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    SQLALCHEMY_DATABASE_URL = "sqlite:///./oratio.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
metadata = MetaData()

# Async database (commented out - using Replit DB instead)
# database = Database(SQLALCHEMY_DATABASE_URL)


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def connect_db():
    """Connect to database on startup (placeholder - using Replit DB)"""
    # await database.connect()
    print("✅ SQL Database (placeholder)")


async def disconnect_db():
    """Disconnect from database on shutdown (placeholder - using Replit DB)"""
    # await database.disconnect()
    print("❌ SQL Database disconnected (placeholder)")
