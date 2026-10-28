import json
import logging
from typing import Dict, Any, Optional
from pydantic import ValidationError
from backend.app.schemas.structured_response import StructuredLLMOutput, IntentEnum
from backend.app.services.llm_provider import BaseLLMProvider

logger = logging.getLogger(__name__)

FALLBACK_RESPONSES = {
    "en": "I am currently experiencing technical difficulties. Please contact front desk directly.",
    "fa": "در حال حاضر ارتباط با سیستم پاسخگویی برقرار نشد. لطفاً مستقیماً با پذیرش تماس بگیرید.",
    "nl": "Er است momenteel een technische storing. Neem direct contact op met de receptie."
}

class LLMResilienceService:
    """
    Handles automatic retries for malformed/failed LLM structured outputs and returns a safe fallback if retries fail.
    """
    async def generate_with_retry(
        self,
        provider: BaseLLMProvider,
        prompt: str,
        system_prompt: Optional[str] = None,
        max_retries: int = 3,
        lang: str = "en"
    ) -> StructuredLLMOutput:
        for attempt in range(1, max_retries + 1):
            try:
                raw_response = await provider.generate(prompt, system_prompt)
                
                # Attempt parsing raw JSON string if output is wrapped in code blocks
                clean_json = raw_response.strip()
                if clean_json.startswith("```json"):
                    clean_json = clean_json[7:]
                if clean_json.endswith("```"):
                    clean_json = clean_json[:-3]
                clean_json = clean_json.strip()

                parsed_dict = json.loads(clean_json)
                return StructuredLLMOutput(**parsed_dict)
            except (json.JSONDecodeError, ValidationError, Exception) as e:
                logger.warning(f"Attempt {attempt}/{max_retries} failed parsing LLM response: {e}")

        # Return safe fallback after all retries fail
        fallback_text = FALLBACK_RESPONSES.get(lang, FALLBACK_RESPONSES["en"])
        return StructuredLLMOutput(
            intent=IntentEnum.GENERAL_QUERY,
            confidence=0.0,
            reply_text=fallback_text,
            requires_human=True
        )

llm_resilience_service = LLMResilienceService()
