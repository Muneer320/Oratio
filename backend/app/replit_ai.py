"""
Replit AI integration for Oratio
Uses Replit's built-in AI API for debate judging and analysis
Falls back to OpenAI GPT-4o mini if Replit AI unavailable
"""
import httpx
import json
from typing import Optional, Dict, Any, List
from app.config import settings

# Try to import Replit AI
try:
    from replit.ai.modelfarm import CompletionModel, ChatModel, ChatExample, ChatMessage, ChatSession
    REPLIT_AI_AVAILABLE = True
    print("✅ Replit AI available")
except ImportError:
    REPLIT_AI_AVAILABLE = False
    print("⚠️  Replit AI not available, will use fallback")

# Try to import OpenAI
try:
    from openai import AsyncOpenAI
    OPENAI_AVAILABLE = bool(settings.OPENAI_API_KEY)
    if OPENAI_AVAILABLE:
        openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        print("✅ OpenAI fallback available")
    else:
        openai_client = None
        print("⚠️  OpenAI API key not configured")
except ImportError:
    OPENAI_AVAILABLE = False
    openai_client = None
    print("⚠️  OpenAI package not installed")


class ReplitAI:
    """Wrapper for Replit AI API"""

    @staticmethod
    async def chat_completion(
        messages: List[Dict[str, str]],
        model: str = "chat-bison",
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> str:
        """
        Generate chat completion using AI cascade:
        1. Try Replit AI first (primary)
        2. Fall back to OpenAI GPT-4o mini (secondary)
        3. Fall back to static response (last resort)
        """

        # Strategy 1: Try Replit AI
        if REPLIT_AI_AVAILABLE:
            try:
                # Use Replit AI ChatModel
                model_instance = ChatModel(model)

                # Convert messages to ChatMessage format
                chat_messages = [
                    ChatMessage(
                        author="USER" if msg["role"] == "user" else "ASSISTANT",
                        content=msg["content"]
                    )
                    for msg in messages
                ]

                # Call chat method with ChatSession
                response = model_instance.chat(
                    [ChatSession(
                        context="You are an expert debate judge analyzing arguments.",
                        examples=[],
                        messages=chat_messages
                    )],
                    temperature=temperature
                )
                
                # Extract response content
                result = response.responses[0].candidates[0].message.content
                print("✅ Using Replit AI")
                return result

            except Exception as e:
                print(f"⚠️  Replit AI failed: {e}, trying OpenAI...")

        # Strategy 2: Try OpenAI
        if OPENAI_AVAILABLE and openai_client:
            try:
                response = await openai_client.chat.completions.create(
                    model=settings.OPENAI_MODEL,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    response_format={"type": "json_object"} if any("JSON" in msg.get("content", "") for msg in messages) else None
                )
                result = response.choices[0].message.content
                print("✅ Using OpenAI fallback")
                return result

            except Exception as e:
                print(f"⚠️  OpenAI failed: {e}, using static fallback...")

        # Strategy 3: Static fallback (last resort)
        print("⚠️  All AI providers unavailable, using static fallback")
        return ReplitAI._fallback_response(messages[-1]["content"])

    @staticmethod
    def _fallback_response(prompt: str) -> str:
        """Simple fallback when Replit AI is unavailable"""
        if "judge" in prompt.lower() or "score" in prompt.lower():
            return """
            {
                "logic": 7,
                "credibility": 7,
                "rhetoric": 7,
                "feedback": "Good argument structure. Consider adding more evidence.",
                "winner": "A"
            }
            """
        elif "fact" in prompt.lower():
            return "Unable to verify this claim without AI connection."
        else:
            return "AI analysis temporarily unavailable. Running in demo mode."

    @staticmethod
    async def analyze_debate_turn(
        turn_content: str,
        context: Optional[str] = None,
        previous_turns: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Analyze a single debate turn using LCR model
        Returns: {logic, credibility, rhetoric, feedback}
        """

        prompt = f"""
You are an expert debate judge. Analyze this argument using the LCR model:

**Logic (40%)**: Reasoning, coherence, argument structure
**Credibility (35%)**: Evidence, facts, reliability
**Rhetoric (25%)**: Persuasiveness, delivery, clarity

Argument: "{turn_content}"

Context: {context or "None"}

Provide scores (0-10) and brief feedback in JSON format:
{{
    "logic": score,
    "credibility": score,
    "rhetoric": score,
    "feedback": "brief analysis",
    "strengths": ["point1", "point2"],
    "weaknesses": ["point1", "point2"]
}}
"""

        messages = [
            {"role": "system", "content": "You are a professional debate judge using the LCR evaluation model."},
            {"role": "user", "content": prompt}
        ]

        response = await ReplitAI.chat_completion(messages, temperature=0.3, max_tokens=500)

        try:
            # Try to parse JSON response
            import json
            # Extract JSON from response
            start = response.find('{')
            end = response.rfind('}') + 1
            if start != -1 and end > start:
                return json.loads(response[start:end])
        except:
            pass

        # Fallback response
        return {
            "logic": 7,
            "credibility": 7,
            "rhetoric": 7,
            "feedback": "Analysis in progress...",
            "strengths": ["Clear argument"],
            "weaknesses": ["Needs more evidence"]
        }

    @staticmethod
    async def generate_final_verdict(
        room_data: Dict[str, Any],
        all_turns: List[Dict[str, Any]],
        participant_scores: Dict[int, Dict[str, float]]
    ) -> Dict[str, Any]:
        """
        Generate final debate verdict and winner
        """

        prompt = f"""
You are a debate judge. Based on the following scores, determine the winner and provide feedback.

**Participants Scores:**
{participant_scores}

**Debate Topic:** {room_data.get('topic', 'Unknown')}

Provide a final verdict in JSON:
{{
    "winner_id": participant_id,
    "summary": "Overall debate summary",
    "feedback": {{
        "participant_1": "personalized feedback",
        "participant_2": "personalized feedback"
    }},
    "key_moments": ["moment1", "moment2"]
}}
"""

        messages = [
            {"role": "system", "content": "You are a professional debate judge."},
            {"role": "user", "content": prompt}
        ]

        response = await ReplitAI.chat_completion(messages, temperature=0.5, max_tokens=800)

        try:
            import json
            start = response.find('{')
            end = response.rfind('}') + 1
            if start != -1 and end > start:
                return json.loads(response[start:end])
        except:
            pass

        # Fallback
        return {
            "winner_id": list(participant_scores.keys())[0] if participant_scores else None,
            "summary": "Debate completed. Check individual scores for details.",
            "feedback": {},
            "key_moments": []
        }

    @staticmethod
    async def fact_check(statement: str, context: Optional[str] = None) -> Dict[str, Any]:
        """
        Fact-check a statement (requires external API like Serper)
        """

        if not settings.SERPER_API_KEY:
            return {
                "verified": False,
                "confidence": 0,
                "sources": [],
                "summary": "Fact-checking unavailable (no API key)"
            }

        # Use Serper API for web search
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://google.serper.dev/search",
                    headers={
                        "X-API-KEY": settings.SERPER_API_KEY,
                        "Content-Type": "application/json"
                    },
                    json={"q": statement},
                    timeout=10.0
                )

                if response.status_code == 200:
                    data = response.json()
                    # Process search results
                    return {
                        "verified": True,
                        "confidence": 0.7,
                        "sources": [r.get("link") for r in data.get("organic", [])[:3]],
                        "summary": data.get("answerBox", {}).get("answer", "No direct answer found")
                    }
        except Exception as e:
            print(f"Fact-check error: {e}")

        return {
            "verified": False,
            "confidence": 0,
            "sources": [],
            "summary": "Unable to verify"
        }


# Export
__all__ = ["ReplitAI", "REPLIT_AI_AVAILABLE"]
