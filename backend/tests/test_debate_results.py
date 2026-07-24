import asyncio
import unittest
import os
from pathlib import Path

os.environ["ORATIO_DB_PATH"] = ":memory:"
from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from app.main import app
from app.replit_auth import ReplitAuth
from app.replit_db import DB, Collections, _db
from app.routers.debate import generate_debate_results
from app.routers.debate import submit_turn
from app.schemas import TurnSubmit
from app.scoring import aggregate_debate_scores


class DebateResultsTests(unittest.TestCase):
    def setUp(self):
        _db.clear()
        self.client = TestClient(app)
        registered = ReplitAuth.simple_auth_register(
            "host", "host@example.com", "long-password"
        )
        self.user = registered["user"]
        self.headers = {"Authorization": f"Bearer {registered['token']}"}
        self.room = DB.insert(Collections.ROOMS, {
            "host_id": self.user["id"], "topic": "Test topic", "status": "completed"
        })
        self.first = DB.insert(Collections.PARTICIPANTS, {
            "room_id": self.room["id"], "user_id": self.user["id"], "role": "debater"
        })
        self.second = DB.insert(Collections.PARTICIPANTS, {
            "room_id": self.room["id"], "user_id": "other", "role": "debater"
        })

    def test_unjudged_turns_do_not_select_a_winner(self):
        DB.insert(Collections.TURNS, {
            "room_id": self.room["id"], "speaker_id": self.first["id"],
            "content": "A", "ai_feedback": None
        })
        with patch("app.routers.debate.GeminiAI.generate_final_verdict", return_value=None):
            result = asyncio.run(generate_debate_results(self.room["id"]))
        self.assertFalse(result["judged"])
        self.assertIsNone(result["winner_id"])
        response = self.client.post("/api/ai/final-score", json={"room_id": int(self.room["id"])},
                                    headers=self.headers)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json()["judged"])

    def test_weighted_scores_and_ties(self):
        participants = [self.first, self.second]
        turns = [
            {"speaker_id": self.first["id"], "ai_feedback": {
                "logic": 8, "credibility": 8, "rhetoric": 8}},
            {"speaker_id": self.second["id"], "ai_feedback": {
                "logic": 6, "credibility": 6, "rhetoric": 6}},
        ]
        scores, _, judged, winner = aggregate_debate_scores(participants, turns)
        self.assertTrue(judged)
        self.assertEqual(winner, self.first["id"])
        self.assertEqual(scores[self.first["id"]]["weighted_total"], 8)
        turns[1]["ai_feedback"] = turns[0]["ai_feedback"]
        self.assertIsNone(aggregate_debate_scores(participants, turns)[3])

    def test_private_debate_data_requires_membership(self):
        outsider = ReplitAuth.simple_auth_register(
            "outsider", "outsider@example.com", "long-password"
        )
        outsider_headers = {"Authorization": f"Bearer {outsider['token']}"}
        for path in (f"/api/debate/{self.room['id']}/status",
                     f"/api/debate/{self.room['id']}/transcript",
                     f"/api/ai/summary/{self.room['id']}"):
            self.assertEqual(self.client.get(path).status_code, 401)
            self.assertEqual(self.client.get(path, headers=outsider_headers).status_code, 403)

    def test_training_opponent_replies_before_round_analysis(self):
        DB.update(Collections.ROOMS, self.room["id"], {
            "status": "upcoming", "is_training": True, "rounds": 3
        })
        DB.update(Collections.PARTICIPANTS, self.second["id"], {
            "is_ai": True, "username": "AI Opponent"
        })
        data = TurnSubmit(content="Human argument", round_number=1, turn_number=1)
        with patch("app.routers.debate.GEMINI_AVAILABLE", True), \
             patch("app.routers.debate.GeminiAI.generate_debate_argument",
                   new_callable=AsyncMock, return_value="AI reply"), \
             patch("app.routers.debate.broadcast_to_room", new_callable=AsyncMock), \
             patch("app.routers.debate.check_and_analyze_round", new_callable=AsyncMock):
            asyncio.run(submit_turn(self.room["id"], data, self.user))
        turns = DB.find(Collections.TURNS, {"room_id": self.room["id"]})
        self.assertEqual([turn["content"] for turn in turns],
                         ["Human argument", "AI reply"])
        self.assertIn("timestamp", turns[1])

    def test_failed_training_reply_allows_retry(self):
        DB.update(Collections.ROOMS, self.room["id"], {
            "status": "upcoming", "is_training": True, "rounds": 3
        })
        DB.update(Collections.PARTICIPANTS, self.second["id"], {"is_ai": True})
        data = TurnSubmit(content="Human argument", round_number=1, turn_number=1)
        with patch("app.routers.debate.GEMINI_AVAILABLE", True), \
             patch("app.routers.debate.GeminiAI.generate_debate_argument",
                   new_callable=AsyncMock, return_value=None), \
             patch("app.routers.debate.broadcast_to_room", new_callable=AsyncMock):
            with self.assertRaises(Exception) as failed:
                asyncio.run(submit_turn(self.room["id"], data, self.user))
        self.assertEqual(failed.exception.status_code, 503)
        self.assertEqual(DB.find(Collections.TURNS, {"room_id": self.room["id"]}), [])

    def test_audio_turn_can_be_played_by_room_member(self):
        DB.update(Collections.ROOMS, self.room["id"], {"status": "ongoing", "rounds": 3})
        response = self.client.post(
            f"/api/debate/{self.room['id']}/submit-audio", headers=self.headers,
            data={"round_number": "1", "turn_number": "1", "content": "Spoken argument"},
            files={"audio": ("argument.webm", b"demo-audio", "audio/webm")},
        )
        self.assertEqual(response.status_code, 200, response.text)
        audio_url = response.json()["audio_url"]
        try:
            self.assertEqual(self.client.get(audio_url).status_code, 401)
            played = self.client.get(audio_url, headers=self.headers)
            self.assertEqual(played.status_code, 200)
            self.assertEqual(played.content, b"demo-audio")
        finally:
            Path(DB.get(Collections.TURNS, str(response.json()["id"]))["audio_path"]).unlink()


if __name__ == "__main__":
    unittest.main()
