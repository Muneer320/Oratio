import os
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # API Environment
    API_ENV: str = os.getenv("REPL_ENV", "development")

    # Replit-specific settings
    REPL_ID: str = os.getenv("REPL_ID", "local")
    REPL_SLUG: str = os.getenv("REPL_SLUG", "oratio")
    REPL_OWNER: str = os.getenv("REPL_OWNER", "")

    # Database - Supabase (primary), Replit DB (fallback)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

    # Fallback database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./oratio.db")
    USE_REPLIT_DB: bool = False  # Only if Supabase is unavailable

    # Use Gemini AI exclusively
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = "gemini-2.5-pro"
    GEMINI_TEMPERATURE: float = 0.7

    # Fact-Checking (Serper is free tier friendly)
    SERPER_API_KEY: str = os.getenv("SERPER_API_KEY", "")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")

    # WebSocket
    WS_HOST: str = "0.0.0.0"
    WS_PORT: int = 8000

    # CORS - Auto-detect Replit URL
    REPLIT_URL: str = os.getenv("REPLIT_DEV_DOMAIN", "")
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:80",
        "http://localhost",
    ]

    # Security
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", "replit-oratio-secret-key-change-in-prod")

    # File Upload - Use Replit Object Storage
    MAX_FILE_SIZE_MB: int = 50
    ALLOWED_FILE_EXTENSIONS: List[str] = ["pdf", "mp3", "wav", "ogg"]

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # Logging
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

# Add Replit domain to CORS if running on Replit
if settings.REPLIT_URL:
    replit_domains = [
        f"https://{settings.REPLIT_URL}",
        f"http://{settings.REPLIT_URL}",
        f"https://{settings.REPL_SLUG}.{settings.REPL_OWNER}.repl.co",
    ]
    settings.CORS_ORIGINS.extend(replit_domains)
    print(f"🔗 Added Replit domains to CORS: {replit_domains}")
