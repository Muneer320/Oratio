"""Key-value API backed by Replit DB or a local SQLite file."""
import json
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import os
from pathlib import Path
from app.local_store import SQLiteStore

# Try Replit DB, then use persistent SQLite locally.
def local_backend():
    path = os.getenv("ORATIO_DB_PATH", str(Path(__file__).resolve().parents[1] /
                                          "data" / "oratio.sqlite3"))
    if path == ":memory:":
        return {}, "memory"
    return SQLiteStore(path), "sqlite"


try:
    from replit import db
    # The `replit` package may be installed but not provide a usable `db`
    # (it can be None or an uninitialized backend).
    if db is None or not hasattr(db, "keys") or not hasattr(db, "get"):
        _db, STORAGE_BACKEND = local_backend()
        REPLIT_DB_AVAILABLE = False
        print(f"Using {STORAGE_BACKEND} storage")
    else:
        _db = db
        STORAGE_BACKEND = "replit-db"
        REPLIT_DB_AVAILABLE = True
        print("✅ Using Replit Database")
except ImportError:
    _db, STORAGE_BACKEND = local_backend()
    REPLIT_DB_AVAILABLE = False
    print(f"Using {STORAGE_BACKEND} storage")


class ReplitDB:
    """
    Wrapper around Replit Database for structured data storage.
    Collections are stored with prefixed keys: collection_name:id
    """

    @staticmethod
    def _generate_id(collection: str) -> str:
        """Generate unique ID for a collection"""
        counter_key = f"_{collection}_counter"
        current = _db.get(counter_key, 0)
        new_id = current + 1
        _db[counter_key] = new_id
        return str(new_id)

    @staticmethod
    def _make_key(collection: str, id: str) -> str:
        """Create key for storage"""
        return f"{collection}:{id}"

    @staticmethod
    def insert(collection: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Insert document into collection"""
        if "id" not in data:
            data["id"] = ReplitDB._generate_id(collection)

        if "created_at" not in data:
            data["created_at"] = datetime.now(timezone.utc).isoformat()

        key = ReplitDB._make_key(collection, str(data["id"]))
        _db[key] = json.dumps(data)
        return data

    @staticmethod
    def get(collection: str, id: str) -> Optional[Dict[str, Any]]:
        """Get document by ID"""
        key = ReplitDB._make_key(collection, id)
        value = _db.get(key)
        return json.loads(value) if value else None

    @staticmethod
    def update(collection: str, id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update document"""
        existing = ReplitDB.get(collection, id)
        if not existing:
            return None

        existing.update(data)
        existing["updated_at"] = datetime.now(timezone.utc).isoformat()

        key = ReplitDB._make_key(collection, id)
        _db[key] = json.dumps(existing)
        return existing

    @staticmethod
    def delete(collection: str, id: str) -> bool:
        """Delete document"""
        key = DB._make_key(collection, id)
        if key in _db:
            del _db[key]
            return True
        return False

    @staticmethod
    def find(collection: str, filter: Optional[Dict[str, Any]] = None, limit: Optional[int] = 100) -> List[Dict[str, Any]]:
        """Find documents matching filter"""
        results = []
        if limit is not None and limit <= 0:
            return results
        prefix = f"{collection}:"

        # Get all keys for this collection
        # When using the real Replit DB, the `.keys()` call may not behave
        # exactly like a dict; we already guarded above so `_db` is
        # dict-like. This comprehension is safe on both memory and
        # replit-backed dicts that implement `.keys()`.
        try:
            keys = [k for k in _db.keys() if k.startswith(prefix)]
        except Exception:
            # As a fallback, treat as empty
            keys = []

        for key in keys:
            value = _db.get(key)
            if value:
                doc = json.loads(value)

                # Apply filter if provided
                if filter:
                    matches = all(doc.get(k) == v for k, v in filter.items())
                    if matches:
                        results.append(doc)
                else:
                    results.append(doc)

                if limit is not None and len(results) >= limit:
                    break

        return results

    @staticmethod
    def find_one(collection: str, filter: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Find single document"""
        results = ReplitDB.find(collection, filter, limit=1)
        return results[0] if results else None

    @staticmethod
    def count(collection: str, filter: Optional[Dict[str, Any]] = None) -> int:
        """Count documents"""
        return len(ReplitDB.find(collection, filter, limit=None))

    @staticmethod
    def clear_collection(collection: str):
        """Clear all documents in collection"""
        prefix = f"{collection}:"
        try:
            keys_to_delete = [k for k in _db.keys() if k.startswith(prefix)]
        except Exception:
            keys_to_delete = []
        for key in keys_to_delete:
            del _db[key]


# Collection names
class Collections:
    USERS = "users"
    ROOMS = "rooms"
    PARTICIPANTS = "participants"
    TURNS = "turns"
    SPECTATOR_VOTES = "spectator_votes"
    RESULTS = "results"
    TRAINER_FEEDBACK = "trainer_feedback"
    UPLOADED_FILES = "uploaded_files"
    SESSIONS = "sessions"  # For auth sessions
    FEEDBACK = "feedback"  # For user feedback


# Initialize database
async def connect_db():
    """The selected key-value backend is ready at import time."""
    print(f"Storage ready: {STORAGE_BACKEND}")


async def disconnect_db():
    """Cleanup on shutdown"""
    print("👋 Database disconnected")


# Alias for backward compatibility
DB = ReplitDB

# Export the database instance
__all__ = ["ReplitDB", "DB", "Collections", "connect_db",
           "disconnect_db", "db", "REPLIT_DB_AVAILABLE"]
