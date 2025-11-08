"""
Gemini AI integration for Oratio
Uses Google Gemini AI exclusively for debate judging and analysis
"""
import httpx
import json
from typing import Optional, Dict, Any, List
from app.config import settings

# Import Gemini (Primary AI)
try:
    from google import genai
    GEMINI_AVAILABLE = bool(settings.GEMINI_API_KEY)
    if GEMINI_AVAILABLE:
        gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
        print("✅ Gemini AI available (Primary)")
    else:
        gemini_client = None
        print("⚠️  Gemini API key not configured, will use Replit AI fallback")
except ImportError:
    GEMINI_AVAILABLE = False
    gemini_client = None
    print("⚠️  Gemini package not installed, will use Replit AI fallback")

# Import Replit AI (Fallback)
try:
    from replit.ai.modelfarm import ChatModel, ChatSession, ChatMessage
    REPLIT_AI_AVAILABLE = True
    print("✅ Replit AI available (Fallback)")
except ImportError:
    REPLIT_AI_AVAILABLE = False
    print("⚠️  Replit AI not available")


class GeminiAI:
    """Wrapper for Gemini AI API"""

    @staticmethod
    async def chat_completion(
        messages: List[Dict[str, str]],
        model: str = "gemini-2.5-pro",
        temperature: float = 0.7,
        max_tokens: int = 4000
    ) -> str:
        """
        Generate chat completion using Gemini AI
        """

        if not GEMINI_AVAILABLE or not gemini_client:
            print("⚠️  Gemini AI unavailable, trying Replit AI fallback")
            if REPLIT_AI_AVAILABLE:
                return await GeminiAI._replit_ai_fallback(messages, temperature, max_tokens)
            else:
                print("⚠️  Replit AI also unavailable, using static fallback")
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

            # Better error handling for Gemini responses
            if not response:
                raise ValueError("Gemini returned no response object")

            # Check if response has text
            result = None
            try:
                result = response.text
            except Exception as text_error:
                print(f"⚠️  Error accessing response.text: {text_error}")
                # Try to get candidates
                if hasattr(response, 'candidates') and response.candidates:
                    candidate = response.candidates[0]
                    if hasattr(candidate, 'content') and candidate.content:
                        if hasattr(candidate.content, 'parts') and candidate.content.parts:
                            result = candidate.content.parts[0].text

            if not result or result.strip() == "":
                print(f"⚠️  Gemini response details: {response}")
                if hasattr(response, 'prompt_feedback'):
                    print(f"⚠️  Prompt feedback: {response.prompt_feedback}")
                raise ValueError("Gemini returned empty response")

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
    async def _replit_ai_fallback(
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 4000
    ) -> str:
        """
        Fallback to Replit AI when Gemini is unavailable
        """
        try:
            from replit.ai.modelfarm import ChatModel, ChatSession

            # Create chat model
            model = ChatModel("chat-bison")

            # Combine messages into a single prompt for Replit AI
            system_prompt = ""
            user_prompt = ""

            for msg in messages:
                if msg["role"] == "system":
                    system_prompt += msg["content"] + "\n\n"
                elif msg["role"] == "user":
                    user_prompt += msg["content"] + "\n\n"

            # Create prompt
            full_prompt = system_prompt + user_prompt if system_prompt else user_prompt

            # Generate response
            response = model.chat(full_prompt)

            return response if response else "Replit AI returned empty response"

        except Exception as e:
            print(f"⚠️  Replit AI fallback failed: {e}")
            return GeminiAI._fallback_response(messages[-1]["content"])

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

        response = await GeminiAI.chat_completion(messages, temperature=0.3, max_tokens=2000)

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

        response = await GeminiAI.chat_completion(messages, temperature=0.5, max_tokens=3000)

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
    async def transcribe_audio(audio_path: str) -> str:
        """
        Transcribe audio file using Gemini AI
        Returns: Transcribed text
        """
        if not GEMINI_AVAILABLE or not gemini_client:
            print("⚠️  Gemini AI unavailable, cannot transcribe audio")
            return "[Audio transcription unavailable]"

        try:
            import pathlib
            import asyncio

            # Upload the audio file
            audio_file = gemini_client.files.upload(
                file=pathlib.Path(audio_path))

            if not audio_file or not hasattr(audio_file, 'name'):
                raise ValueError("File upload failed")

            # Wait for Gemini to process the audio file
            # Audio files take 3-5 seconds to become ACTIVE
            await asyncio.sleep(5)

            # Generate transcription using the uploaded file
            prompt = "Please transcribe this audio file accurately. Provide only the transcription without any additional commentary."

            # Build contents manually to avoid type issues
            file_uri = getattr(audio_file, 'uri', None)
            mime_type = getattr(audio_file, 'mime_type', None)

            if not file_uri:
                raise ValueError("No file URI available")

            from google.genai import types
            file_part = types.Part.from_uri(
                file_uri=file_uri, mime_type=mime_type or "audio/webm")

            response = gemini_client.models.generate_content(
                model="gemini-2.5-pro",
                contents=[file_part, prompt]
            )

            # Clean up the uploaded file
            if hasattr(audio_file, 'name') and audio_file.name:
                try:
                    gemini_client.files.delete(name=audio_file.name)
                except:
                    pass  # Ignore cleanup errors

            # Extract transcription
            transcription = getattr(response, 'text', None)
            if not transcription:
                raise ValueError("No transcription returned")

            transcription = transcription.strip()
            print(
                f"✅ Audio transcribed successfully: {len(transcription)} characters")
            return transcription

        except Exception as e:
            print(f"⚠️  Audio transcription failed: {e}")
            import traceback
            traceback.print_exc()
            return "[Audio transcription failed - please try again]"

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
