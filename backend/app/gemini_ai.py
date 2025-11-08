"""
Gemini AI integration for Oratio
Uses Google Gemini AI exclusively for debate judging and analysis
"""
import httpx
import json
from typing import Optional, Dict, Any, List
from app.config import settings

# Import Gemini
try:
    from google import genai
    GEMINI_AVAILABLE = bool(settings.GEMINI_API_KEY)
    if GEMINI_AVAILABLE:
        gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
        print("✅ Gemini AI available")
    else:
        gemini_client = None
        print("⚠️  Gemini API key not configured")
except ImportError:
    GEMINI_AVAILABLE = False
    gemini_client = None
    print("⚠️  Gemini package not installed")


class GeminiAI:
    """Wrapper for Gemini AI API"""

    @staticmethod
    async def chat_completion(
        messages: List[Dict[str, str]],
        model: str = "gemini-2.0-flash",
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> str:
        """
        Generate chat completion using Gemini AI
        """

        if not GEMINI_AVAILABLE or not gemini_client:
            print("⚠️  Gemini AI unavailable, using static fallback")
            return GeminiAI._fallback_response(messages[-1]["content"])

        try:
            # Convert messages to Gemini format
            # Combine system and user messages for Gemini
            system_instruction = None
            user_content = []
            
            for msg in messages:
                if msg["role"] == "system":
                    system_instruction = msg["content"]
                elif msg["role"] == "user":
                    user_content.append(msg["content"])
                elif msg["role"] == "assistant":
                    # Skip assistant messages for now (can be added for multi-turn)
                    pass
            
            # Combine all user messages
            combined_content = "\n\n".join(user_content)
            
            # Generate content with Gemini
            from google.genai import types
            
            config = types.GenerateContentConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
            )
            
            if system_instruction:
                config.system_instruction = system_instruction
            
            response = gemini_client.models.generate_content(
                model=model,
                contents=combined_content,
                config=config
            )
            
            result = response.text
            print(f"✅ Using Gemini AI ({model})")
            return result

        except Exception as e:
            print(f"⚠️  Gemini AI failed: {e}")
            print("⚠️  Using static fallback...")
            return GeminiAI._fallback_response(messages[-1]["content"])

    @staticmethod
    def _fallback_response(prompt: str) -> str:
        """Simple fallback when Gemini AI is unavailable"""
        if "judge" in prompt.lower() or "score" in prompt.lower():
            return """
            {
                "logic": 7,
                "credibility": 7,
                "rhetoric": 7,
                "feedback": "Good argument structure. Consider adding more evidence.",
                "strengths": ["Clear presentation"],
                "weaknesses": ["Needs more supporting evidence"]
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
            {"role": "system", "content": "You are a professional debate judge using the LCR evaluation model. Always respond with valid JSON."},
            {"role": "user", "content": prompt}
        ]

        response = await GeminiAI.chat_completion(messages, temperature=0.3, max_tokens=500)

        try:
            # Try to parse JSON response
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
            {"role": "system", "content": "You are a professional debate judge. Always respond with valid JSON."},
            {"role": "user", "content": prompt}
        ]

        response = await GeminiAI.chat_completion(messages, temperature=0.5, max_tokens=800)

        try:
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
__all__ = ["GeminiAI", "GEMINI_AVAILABLE"]
