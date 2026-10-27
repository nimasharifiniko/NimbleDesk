from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import httpx

class BaseLLMProvider(ABC):
    """
    Abstract interface for LLM providers (Ollama, API-based, or Mock).
    """
    @abstractmethod
    async def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        pass

class MockLLMProvider(BaseLLMProvider):
    """
    Mock LLM Provider for local testing and benchmark baselines without local GPU/API key requirements.
    """
    async def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        return f"[Mock LLM Response] Processed query successfully."

class OllamaLLMProvider(BaseLLMProvider):
    """
    Ollama integration for running open-weights LLMs locally (e.g., Llama 3, Qwen 2.5).
    """
    def __init__(self, base_url: str = "http://localhost:11434", model_name: str = "llama3:8b"):
        self.base_url = base_url
        self.model_name = model_name

    async def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": self.model_name,
            "prompt": prompt,
            "system": system_prompt or "",
            "stream": False
        }
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    return res.json().get("response", "")
                return f"Error from Ollama: {res.status_code}"
        except Exception as e:
            return f"Ollama connection error: {str(e)}"

# Default dev instance
llm_provider: BaseLLMProvider = MockLLMProvider()
