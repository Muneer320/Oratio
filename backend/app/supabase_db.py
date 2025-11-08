"""
Supabase Database wrapper for Oratio
Primary database with Replit DB as fallback
"""
import json
from typing import Optional, List, Dict, Any
from datetime import datetime
import os

# Try Supabase first
try:
    from supabase import create_client, Client
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

    if SUPABASE_URL and SUPABASE_KEY:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        SUPABASE_AVAILABLE = True
        print("✅ Using Supabase Database (Primary)")
    else:
        supabase = None
        SUPABASE_AVAILABLE = False
        print("⚠️  Supabase credentials not configured, falling back to Replit DB")
except ImportError:
    supabase = None
    SUPABASE_AVAILABLE = False
    print("⚠️  Supabase package not installed, falling back to Replit DB")

# Fallback to Replit DB
if not SUPABASE_AVAILABLE:
    try:
        from replit import db as replit_db
        REPLIT_DB_AVAILABLE = True
        print("✅ Using Replit Database (Fallback)")
    except ImportError:
        # Final fallback to in-memory dict
        replit_db = {}
        REPLIT_DB_AVAILABLE = False
        print(
            "⚠️  Replit DB not available, using in-memory storage (data will not persist)")


class DatabaseWrapper:
    """
    Unified database wrapper supporting Supabase (primary) and Replit DB (fallback)
    """

    @staticmethod
    def _generate_id(collection: str) -> str:
        """Generate unique ID for a collection (Replit DB fallback only)"""
        if not SUPABASE_AVAILABLE:
            counter_key = f"_{collection}_counter"
            current = replit_db.get(counter_key, 0)
            new_id = current + 1
            replit_db[counter_key] = new_id
            return str(new_id)
        return None  # Supabase uses auto-increment

    @staticmethod
    def _make_key(collection: str, id: str) -> str:
        """Create key for storage (Replit DB fallback only)"""
        return f"{collection}:{id}"

    @staticmethod
    def insert(collection: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Insert document into collection"""
        if "created_at" not in data:
            data["created_at"] = datetime.utcnow().isoformat()

        if SUPABASE_AVAILABLE:
            try:
                # Supabase insert
                response = supabase.table(collection).insert(data).execute()
                if response.data and len(response.data) > 0:
                    return response.data[0]
                else:
                    raise Exception("Supabase insert returned no data")
            except Exception as e:
                print(
                    f"⚠️  Supabase insert failed: {e}, falling back to Replit DB")
                # Fallback to Replit DB
                if REPLIT_DB_AVAILABLE:
                    return DatabaseWrapper._replit_insert(collection, data)
                else:
                    raise
        else:
            # Use Replit DB fallback
            return DatabaseWrapper._replit_insert(collection, data)

    @staticmethod
    def _replit_insert(collection: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Insert using Replit DB or in-memory fallback"""
        if "id" not in data:
            data["id"] = DatabaseWrapper._generate_id(collection)

        key = DatabaseWrapper._make_key(collection, str(data["id"]))

        # Store as JSON string for Replit DB, or dict for in-memory fallback
        if REPLIT_DB_AVAILABLE:
            replit_db[key] = json.dumps(data)
        else:
            replit_db[key] = data

        return data

    @staticmethod
    def get(collection: str, id: str) -> Optional[Dict[str, Any]]:
        """Get document by ID"""
        if SUPABASE_AVAILABLE:
            try:
                response = supabase.table(collection).select(
                    "*").eq("id", id).execute()
                if response.data and len(response.data) > 0:
                    return response.data[0]
                return None
            except Exception as e:
                print(
                    f"⚠️  Supabase get failed: {e}, falling back to Replit DB")
                if REPLIT_DB_AVAILABLE:
                    return DatabaseWrapper._replit_get(collection, id)
                return None
        else:
            return DatabaseWrapper._replit_get(collection, id)

    @staticmethod
    def _replit_get(collection: str, id: str) -> Optional[Dict[str, Any]]:
        """Get using Replit DB or in-memory fallback"""
        key = DatabaseWrapper._make_key(collection, id)
        value = replit_db.get(key)

        if not value:
            return None

        # Parse JSON for Replit DB, or return dict directly for in-memory fallback
        if REPLIT_DB_AVAILABLE:
            return json.loads(value)
        else:
            return value

    @staticmethod
    def update(collection: str, id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update document"""
        data["updated_at"] = datetime.utcnow().isoformat()

        if SUPABASE_AVAILABLE:
            try:
                response = supabase.table(collection).update(
                    data).eq("id", id).execute()
                if response.data and len(response.data) > 0:
                    return response.data[0]
                return None
            except Exception as e:
                print(
                    f"⚠️  Supabase update failed: {e}, falling back to Replit DB")
                if REPLIT_DB_AVAILABLE:
                    return DatabaseWrapper._replit_update(collection, id, data)
                return None
        else:
            return DatabaseWrapper._replit_update(collection, id, data)

    @staticmethod
    def _replit_update(collection: str, id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update using Replit DB or in-memory fallback"""
        existing = DatabaseWrapper._replit_get(collection, id)
        if not existing:
            return None

        existing.update(data)
        key = DatabaseWrapper._make_key(collection, id)

        # Store as JSON string for Replit DB, or dict for in-memory fallback
        if REPLIT_DB_AVAILABLE:
            replit_db[key] = json.dumps(existing)
        else:
            replit_db[key] = existing

        return existing

    @staticmethod
    def delete(collection: str, id: str) -> bool:
        """Delete document"""
        if SUPABASE_AVAILABLE:
            try:
                supabase.table(collection).delete().eq("id", id).execute()
                return True
            except Exception as e:
                print(
                    f"⚠️  Supabase delete failed: {e}, falling back to Replit DB")
                if REPLIT_DB_AVAILABLE:
                    return DatabaseWrapper._replit_delete(collection, id)
                return False
        else:
            return DatabaseWrapper._replit_delete(collection, id)

    @staticmethod
    def _replit_delete(collection: str, id: str) -> bool:
        """Delete using Replit DB"""
        key = DatabaseWrapper._make_key(collection, id)
        if key in replit_db:
            del replit_db[key]
            return True
        return False

    @staticmethod
    def find(collection: str, filter: Optional[Dict[str, Any]] = None, limit: int = 100) -> List[Dict[str, Any]]:
        """Find documents matching filter"""
        if SUPABASE_AVAILABLE:
            try:
                query = supabase.table(collection).select("*")

                # Apply filters
                if filter:
                    for key, value in filter.items():
                        query = query.eq(key, value)

                query = query.limit(limit)
                response = query.execute()
                return response.data if response.data else []
            except Exception as e:
                print(
                    f"⚠️  Supabase find failed: {e}, falling back to Replit DB")
                if REPLIT_DB_AVAILABLE:
                    return DatabaseWrapper._replit_find(collection, filter, limit)
                return []
        else:
            return DatabaseWrapper._replit_find(collection, filter, limit)

    @staticmethod
    def _replit_find(collection: str, filter: Optional[Dict[str, Any]] = None, limit: int = 100) -> List[Dict[str, Any]]:
        """Find using Replit DB or in-memory fallback"""
        results = []
        prefix = f"{collection}:"
        keys = [k for k in replit_db.keys() if k.startswith(prefix)]

        for key in keys[:limit]:
            value = replit_db.get(key)
            if value:
                # Parse JSON for Replit DB, or use dict directly for in-memory fallback
                if REPLIT_DB_AVAILABLE:
                    doc = json.loads(value)
                else:
                    doc = value

                # Apply filter
                if filter:
                    match = all(doc.get(k) == v for k, v in filter.items())
                    if not match:
                        continue

                results.append(doc)

        return results

    @staticmethod
    def find_one(collection: str, filter: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Find one document matching filter"""
        results = DatabaseWrapper.find(collection, filter, limit=1)
        return results[0] if results else None


class Collections:
    """Collection name constants"""
    USERS = "users"
    ROOMS = "rooms"
    PARTICIPANTS = "participants"
    TURNS = "turns"
    SPECTATOR_VOTES = "spectator_votes"
    RESULTS = "results"
    TRAINER_FEEDBACK = "trainer_feedback"
    UPLOADED_FILES = "uploaded_files"
    SESSIONS = "sessions"
    FEEDBACK = "feedback"
    FEEDBACK = "feedback"


# Export for backward compatibility
DB = DatabaseWrapper
