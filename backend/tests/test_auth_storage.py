import unittest
import os
from pathlib import Path
from tempfile import TemporaryDirectory
from datetime import datetime, timedelta, timezone

os.environ["ORATIO_DB_PATH"] = ":memory:"

from fastapi import HTTPException

from app.replit_auth import ReplitAuth, verify_password
from app.replit_db import DB, Collections, _db
from app.local_store import SQLiteStore


class AuthStorageTests(unittest.TestCase):
    def setUp(self):
        _db.clear()

    def test_passwords_are_hashed_and_sessions_expire(self):
        result = ReplitAuth.simple_auth_register("alice", "alice@example.com", "long-password")
        user = result["user"]
        stored = DB.get(Collections.USERS, user["id"])["password_hash"]
        self.assertNotEqual(stored, "long-password")
        self.assertTrue(stored.startswith("scrypt$"))
        self.assertTrue(verify_password("long-password", stored))
        self.assertFalse(verify_password("wrong-password", stored))
        self.assertEqual(ReplitAuth.get_user_from_token(result["token"])["id"], user["id"])

        with self.assertRaises(HTTPException):
            ReplitAuth.simple_auth_login("alice@example.com", "wrong-password")
        DB.update(Collections.SESSIONS, result["token"], {
            "expires_at": (datetime.now(timezone.utc) - timedelta(seconds=1)).isoformat()
        })
        self.assertIsNone(ReplitAuth.get_user_from_token(result["token"]))
        self.assertIsNone(DB.get(Collections.SESSIONS, result["token"]))

    def test_legacy_password_is_upgraded_on_login(self):
        user = DB.insert(Collections.USERS, {
            "username": "old", "email": "old@example.com", "password_hash": "old-password"
        })
        ReplitAuth.simple_auth_login("old@example.com", "old-password")
        stored = DB.get(Collections.USERS, user["id"])["password_hash"]
        self.assertTrue(stored.startswith("scrypt$"))
        self.assertTrue(verify_password("old-password", stored))

    def test_find_filters_before_limit(self):
        for index in range(125):
            DB.insert(Collections.TURNS, {"room_id": "other", "content": str(index)})
        DB.insert(Collections.TURNS, {"room_id": "target", "content": "wanted"})
        self.assertEqual(DB.find(Collections.TURNS, {"room_id": "target"}, limit=1)[0]["content"],
                         "wanted")
        self.assertEqual(DB.count(Collections.TURNS), 126)

    def test_local_storage_survives_reopen(self):
        with TemporaryDirectory() as directory:
            path = str(Path(directory) / "oratio.sqlite3")
            first = SQLiteStore(path)
            first["room:1"] = '{"topic":"Demo"}'
            first.close()
            second = SQLiteStore(path)
            try:
                self.assertEqual(second.get("room:1"), '{"topic":"Demo"}')
                self.assertIn("room:1", second.keys())
            finally:
                second.close()


if __name__ == "__main__":
    unittest.main()
