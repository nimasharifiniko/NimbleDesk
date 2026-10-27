import pytest
import uuid
from unittest.mock import AsyncMock, patch
from backend.app.services.rag_generator import rag_generator_service

@pytest.mark.asyncio
async def test_rag_generator_multilingual_prompt():
    mock_db = AsyncMock()
    fake_context = {
        "business_name": "Nima Cafe",
        "business_hours": "Mon-Fri: 08:00 - 18:00",
        "menu_items": "- Espresso: 3.5 USD",
        "services": "N/A",
        "knowledge_base": "No specific document match.",
        "raw_chunks": []
    }

    with patch("backend.app.services.rag_generator.context_retriever.assemble_context", return_value=fake_context):
        res_en = await rag_generator_service.generate_response(mock_db, uuid.uuid4(), "Hours?", lang="en")
        assert "Nima Cafe" in res_en["system_prompt"]
        assert "Mon-Fri: 08:00 - 18:00" in res_en["system_prompt"]

        res_fa = await rag_generator_service.generate_response(mock_db, uuid.uuid4(), "ساعت کاری؟", lang="fa")
        assert "شما دستیار هوشمند NimbleDesk برای Nima Cafe هستید." in res_fa["system_prompt"]

        res_nl = await rag_generator_service.generate_response(mock_db, uuid.uuid4(), "Openingstijden?", lang="nl")
        assert "Je bent NimbleDesk AI, een slimme assistent voor Nima Cafe." in res_nl["system_prompt"]
