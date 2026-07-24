"""Small persistent key-value store for local and Docker demos."""

import json
import sqlite3
import threading
from pathlib import Path


class SQLiteStore:
    def __init__(self, path: str):
        database_path = Path(path)
        database_path.parent.mkdir(parents=True, exist_ok=True)
        self.connection = sqlite3.connect(database_path, check_same_thread=False,
                                          isolation_level=None)
        self.lock = threading.RLock()
        with self.lock:
            self.connection.execute("PRAGMA journal_mode=WAL")
            self.connection.execute("CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT NOT NULL)")

    def get(self, key, default=None):
        with self.lock:
            row = self.connection.execute("SELECT value FROM kv WHERE key = ?", (key,)).fetchone()
        return json.loads(row[0]) if row else default

    def __setitem__(self, key, value):
        with self.lock:
            self.connection.execute(
                "INSERT INTO kv (key, value) VALUES (?, ?) "
                "ON CONFLICT(key) DO UPDATE SET value = excluded.value",
                (key, json.dumps(value)),
            )

    def __delitem__(self, key):
        with self.lock:
            cursor = self.connection.execute("DELETE FROM kv WHERE key = ?", (key,))
            if cursor.rowcount == 0:
                raise KeyError(key)

    def __contains__(self, key):
        with self.lock:
            return self.connection.execute("SELECT 1 FROM kv WHERE key = ?", (key,)).fetchone() is not None

    def keys(self):
        with self.lock:
            return [row[0] for row in self.connection.execute("SELECT key FROM kv")]

    def clear(self):
        with self.lock:
            self.connection.execute("DELETE FROM kv")

    def close(self):
        with self.lock:
            self.connection.close()
