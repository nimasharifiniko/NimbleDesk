import pytest
from pydantic import ValidationError
from backend.app.schemas.structured_response import (
    StructuredLLMOutput,
    IntentEnum,
    ExtractedEntities
)

def test_valid_structured_llm_output():
    data = {
        "intent": "pricing_inquiry",
        "confidence": 0.95,
        "entities": {
            "item_name": "Espresso"
        },
        "reply_text": "An Espresso costs 3.5 USD.",
        "requires_human": False
    }
    parsed = StructuredLLMOutput(**data)
    assert parsed.intent == IntentEnum.PRICING_INQUIRY
    assert parsed.confidence == 0.95
    assert parsed.entities.item_name == "Espresso"

def test_invalid_confidence_score():
    data = {
        "intent": "general_query",
        "confidence": 1.5, # Exceeds 1.0 limit
        "reply_text": "Invalid score test"
    }
    with pytest.raises(ValidationError):
        StructuredLLMOutput(**data)

def test_invalid_intent_enum():
    data = {
        "intent": "unknown_intent_type",
        "confidence": 0.8,
        "reply_text": "Invalid intent test"
    }
    with pytest.raises(ValidationError):
        StructuredLLMOutput(**data)
