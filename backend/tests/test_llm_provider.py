import pytest
from backend.app.services.llm_provider import MockLLMProvider, OllamaLLMProvider

@pytest.mark.asyncio
async def test_mock_llm_provider():
    provider = MockLLMProvider()
    response = await provider.generate(prompt="What are your hours?", system_prompt="You are an assistant.")
    assert "[Mock LLM Response]" in response

@pytest.mark.asyncio
async def test_ollama_llm_provider_connection_fallback():
    # Test connection fallback handling when local Ollama service is unavailable
    provider = OllamaLLMProvider(base_url="http://127.0.0.1:9999")
    response = await provider.generate(prompt="Test fallback")
    assert "Ollama connection error" in response
