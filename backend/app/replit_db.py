"""
Replit Database wrapper for Oratio
Uses Replit's built-in key-value database instead of SQL
"""
import json
from typing import Optional, List, Dict, Any
from datetime import datetime
import os

# Try to import Replit DB, fallback to dict for local development
try:
    from replit import db
    REPLIT_DB_AVAILABLE = True
    print("✅ Using Replit Database")
except ImportError:
    # Fallback to in-memory dict for local development
    db = {}
    REPLIT_DB_AVAILABLE = False
    print("⚠️  Replit DB not available, using in-memory storage (data will not persist)")


class ReplitDB:
    """
    Wrapper around Replit Database for structured data storage.
    Collections are stored with prefixed keys: collection_name:id
    """

    @staticmethod
    def _generate_id(collection: str) -> str:
        """Generate unique ID for a collection"""
        counter_key = f"_{collection}_counter"
        current = db.get(counter_key, 0)
        new_id = current + 1
        db[counter_key] = new_id
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
            data["created_at"] = datetime.utcnow().isoformat()

        key = ReplitDB._make_key(collection, str(data["id"]))
        db[key] = json.dumps(data)
        return data

    @staticmethod
    def get(collection: str, id: str) -> Optional[Dict[str, Any]]:
        """Get document by ID"""
        key = ReplitDB._make_key(collection, id)
        value = db.get(key)
        return json.loads(value) if value else None

    @staticmethod
    def update(collection: str, id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update document"""
        existing = ReplitDB.get(collection, id)
        if not existing:
            return None

        existing.update(data)
        existing["updated_at"] = datetime.utcnow().isoformat()

        key = ReplitDB._make_key(collection, id)
        db[key] = json.dumps(existing)
        return existing

    @staticmethod
    def delete(collection: str, id: str) -> bool:
        """Delete document"""
        key = ReplitDB._make_key(collection, id)
        if key in db:
            del db[key]
            return True
        return False

    @staticmethod
    def find(collection: str, filter: Optional[Dict[str, Any]] = None, limit: int = 100) -> List[Dict[str, Any]]:
        """Find documents matching filter"""
        results = []
        prefix = f"{collection}:"

        # Get all keys for this collection
        keys = [k for k in db.keys() if k.startswith(prefix)]

        for key in keys[:limit]:
            value = db.get(key)
            if value:
                doc = json.loads(value)

                # Apply filter if provided
                if filter:
                    matches = all(doc.get(k) == v for k, v in filter.items())
                    if matches:
                        results.append(doc)
                else:
                    results.append(doc)

        return results

    @staticmethod
    def find_one(collection: str, filter: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Find single document"""
        results = ReplitDB.find(collection, filter, limit=1)
        return results[0] if results else None

    @staticmethod
    def count(collection: str, filter: Optional[Dict[str, Any]] = None) -> int:
        """Count documents"""
        return len(ReplitDB.find(collection, filter))

    @staticmethod
    def clear_collection(collection: str):
        """Clear all documents in collection"""
        prefix = f"{collection}:"
        keys_to_delete = [k for k in db.keys() if k.startswith(prefix)]
        for key in keys_to_delete:
            del db[key]


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
    """Initialize Replit Database"""
    if REPLIT_DB_AVAILABLE:
        print("✅ Replit Database connected")
    else:
        print("⚠️  Running in local mode with in-memory storage")


async def disconnect_db():
    """Cleanup on shutdown"""
    print("👋 Database disconnected")


# Export the database instance
__all__ = ["ReplitDB", "Collections", "connect_db", "disconnect_db", "db"]
