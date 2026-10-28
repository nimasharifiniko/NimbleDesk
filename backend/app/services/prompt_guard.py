import re
from typing import Dict, Any

INJECTION_PATTERNS = [
    r"ignore",
    r"disregard",
    r"you are now",
    r"dan mode",
    r"system prompt",
    r"developer mode",
    r"override",
    r"reveal",
    r"print instructions",
    r"دستورات",
    r"پرامپت",
    r"فراموش"
]

class PromptGuardService:
    """
    Security guard service to detect and block prompt injection attempts.
    """
    def inspect_prompt(self, user_query: str) -> Dict[str, Any]:
        if not user_query or not user_query.strip():
            return {"is_safe": True, "reason": None}

        clean_query = user_query.lower()
        for pattern in INJECTION_PATTERNS:
            if re.search(pattern, clean_query, re.IGNORECASE):
                return {
                    "is_safe": False,
                    "reason": f"Prompt injection pattern detected: '{pattern}'"
                }

        return {"is_safe": True, "reason": None}

prompt_guard_service = PromptGuardService()
