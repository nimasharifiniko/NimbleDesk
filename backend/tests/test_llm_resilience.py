import pytest
from unittest.mock import AsyncMock
from backend.app.services.llm_resilience import llm_resilience_service
from backend.app.services.llm_provider import BaseLLMProvider
from backend.app.schemas.structured_response import IntentEnum

@pytest.mark.asyncio
async def test_successful_json_parsing_on_first_try():
    mock_provider = AsyncMock(spec=BaseLLMProvider)
    valid_json = '''
    {
        "intent": "hours_inquiry",
        "confidence": 0.9,
        "reply_text": "We are open from 8am to 8pm.",
        "requires_human": false
    }
    '''
    mock_provider.generate.return_value = valid_json

    result = await llm_resilience_service.generate_with_retry(
        provider=mock_provider,
        prompt="Hours?",
        max_retries=3
    )

    assert result.intent == IntentEnum.HOURS_INQUIRY
    assert result.confidence == 0.9
    assert result.reply_text == "We are open from 8am to 8pm."
    assert mock_provider.generate.call_count == 1

@pytest.mark.asyncio
async def test_fallback_activation_after_all_retries_fail():
    mock_provider = AsyncMock(spec=BaseLLMProvider)
    mock_provider.generate.return_value = "Invalid Non-JSON Response Text"

    result = await llm_resilience_service.generate_with_retry(
        provider=mock_provider,
        prompt="Hours?",
        max_retries=3,
        lang="fa"
    )

    assert result.confidence == 0.0
    assert result.requires_human is True
    assert "پذیرش تماس بگیرید" in result.reply_text
    assert mock_provider.generate.call_count == 3
