"""
Simple in-memory cache for frequently accessed data
"""
from datetime import datetime, timedelta
from typing import Dict, Any, Optional


class SimpleCache:
    """Thread-safe simple cache with TTL"""
    
    def __init__(self, ttl_seconds: int = 60):
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.ttl_seconds = ttl_seconds
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache if not expired"""
        if key in self.cache:
            entry = self.cache[key]
            if datetime.utcnow() < entry['expires']:
                return entry['value']
            else:
                del self.cache[key]
        return None
    
    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None):
        """Set value in cache with TTL"""
        ttl = ttl_seconds if ttl_seconds is not None else self.ttl_seconds
        self.cache[key] = {
            'value': value,
            'expires': datetime.utcnow() + timedelta(seconds=ttl)
        }
    
    def delete(self, key: str):
        """Delete value from cache"""
        if key in self.cache:
            del self.cache[key]
    
    def clear(self):
        """Clear all cache"""
        self.cache.clear()


# Global cache instances
user_cache = SimpleCache(ttl_seconds=300)  # 5 minutes for user data
room_cache = SimpleCache(ttl_seconds=10)   # 10 seconds for room data
