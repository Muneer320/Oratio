"""Gemini judging and transcription. Unavailable AI never produces invented scores."""

import asyncio
from pathlib import Path
from typing import Any, Dict, List, Optional

import httpx
from pydantic import BaseModel, Field

from app.config import settings

try:
    from google import genai
    from google.genai import types
except ImportError:
    genai = None
    types = None

GEMINI_AVAILABLE = bool(genai and settings.GEMINI_API_KEY)
gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY) if GEMINI_AVAILABLE else None


class LCRAnalysis(BaseModel):
    logic: float = Field(ge=0, le=10)
    credibility: float = Field(ge=0, le=10)
    rhetoric: float = Field(ge=0, le=10)
    feedback: str
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)


class ParticipantInsight(BaseModel):
    participant_id: str
    insight: str


class FinalVerdict(BaseModel):
    summary: str
    feedback: List[ParticipantInsight] = Field(default_factory=list)
    key_moments: List[str] = Field(default_factory=list)


class GeminiAI:
    @staticmethod
    async def _structured(prompt: str, schema: type[BaseModel], temperature: float = 0.2):
        if not gemini_client:
            return None
        try:
            response = await gemini_client.aio.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=temperature,
                    response_mime_type="application/json",
                    response_schema=schema,
                ),
            )
            if isinstance(response.parsed, schema):
                return response.parsed
            return schema.model_validate_json(response.text)
        except Exception as error:
            print(f"Gemini structured response unavailable: {error}")
            return None

    @staticmethod
    async def generate_debate_argument(prompt: str) -> Optional[str]:
        if not gemini_client:
            return None
        try:
            response = await gemini_client.aio.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(temperature=0.8, max_output_tokens=800),
            )
            return response.text.strip() if response.text else None
        except Exception as error:
            print(f"Gemini argument unavailable: {error}")
            return None

    @staticmethod
    async def analyze_debate_turn(
        turn_content: str,
        context: Optional[str] = None,
        previous_turns: Optional[List[str]] = None,
    ) -> Optional[Dict[str, Any]]:
        history = "\n".join(f"- {turn}" for turn in (previous_turns or [])[-10:])
        prompt = (
            "Score this debate turn on logic, credibility and rhetoric from 0 to 10. "
            "Use the topic and earlier turns to assess rebuttals and consistency. "
            "Do not treat unsupported claims as verified facts. Give specific feedback, "
            "strengths and weaknesses.\n\n"
            f"Topic: {context or 'Unspecified'}\n"
            f"Earlier turns:\n{history or 'None'}\n\nCurrent turn:\n{turn_content}"
        )
        analysis = await GeminiAI._structured(prompt, LCRAnalysis)
        return analysis.model_dump() if analysis else None

    @staticmethod
    async def generate_final_verdict(
        room_data: Dict[str, Any],
        all_turns: List[Dict[str, Any]],
        participant_scores: Dict[str, Dict[str, float]],
    ) -> Optional[Dict[str, Any]]:
        if not participant_scores:
            return None
        transcript = "\n".join(
            f"{turn.get('speaker_name', turn.get('speaker_id'))}: {turn.get('content', '')}"
            for turn in all_turns
        )
        prompt = (
            "Summarize this completed debate and give specific feedback for each participant. "
            "Include each participant ID in a feedback item. Do not choose a winner; "
            "the application calculates that from the scores.\n\n"
            f"Topic: {room_data.get('topic', 'Unspecified')}\n"
            f"Scores by participant ID: {participant_scores}\n"
            f"Transcript:\n{transcript}"
        )
        verdict = await GeminiAI._structured(prompt, FinalVerdict, temperature=0.3)
        if not verdict:
            return None
        return {
            "summary": verdict.summary,
            "feedback": {item.participant_id: item.insight for item in verdict.feedback},
            "key_moments": verdict.key_moments,
        }

    @staticmethod
    async def transcribe_audio(audio_path: str) -> Optional[str]:
        if not gemini_client:
            return None
        uploaded = None
        try:
            uploaded = await asyncio.to_thread(gemini_client.files.upload,
                                               file=Path(audio_path))
            for _ in range(30):
                state = str(getattr(uploaded, "state", "ACTIVE"))
                if not state.endswith("PROCESSING"):
                    break
                await asyncio.sleep(1)
                uploaded = await asyncio.to_thread(gemini_client.files.get,
                                                   name=uploaded.name)
            if str(getattr(uploaded, "state", "ACTIVE")).endswith("FAILED"):
                return None
            response = await gemini_client.aio.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=[uploaded, "Transcribe this audio accurately. Return only the transcript."],
            )
            return response.text.strip() if response.text else None
        except Exception as error:
            print(f"Gemini transcription unavailable: {error}")
            return None
        finally:
            if uploaded and getattr(uploaded, "name", None):
                try:
                    await asyncio.to_thread(gemini_client.files.delete, name=uploaded.name)
                except Exception:
                    pass

    @staticmethod
    async def fact_check(statement: str, context: Optional[str] = None) -> Dict[str, Any]:
        if not settings.SERPER_API_KEY:
            return {"verified": False, "confidence": 0, "sources": [],
                    "summary": "Fact-checking unavailable (no search key)"}
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://google.serper.dev/search",
                    headers={"X-API-KEY": settings.SERPER_API_KEY,
                             "Content-Type": "application/json"},
                    json={"q": f"{statement} {context or ''}".strip()},
                    timeout=10.0,
                )
                response.raise_for_status()
                data = response.json()
                return {
                    "verified": False,
                    "confidence": 0,
                    "sources": [item.get("link") for item in data.get("organic", [])[:3]
                                if item.get("link")],
                    "summary": "Search results are leads for review, not verification of the claim.",
                }
        except Exception as error:
            print(f"Fact-check search unavailable: {error}")
            return {"verified": False, "confidence": 0, "sources": [],
                    "summary": "Unable to search for supporting sources"}


__all__ = ["GeminiAI", "GEMINI_AVAILABLE"]
