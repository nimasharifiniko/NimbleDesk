import pytest
import uuid
from unittest.mock import AsyncMock, patch
from backend.app.services.rag_generator import rag_generator_service

@pytest.mark.asyncio
async def test_citations_extraction_and_uncertainty_prompt():
    mock_db = AsyncMock()
    fake_context = {
        "business_name": "Salon Nimble",
        "business_hours": "Not specified",
        "menu_items": "N/A",
        "services": "N/A",
        "knowledge_base": "[Salon Terms]: No refund policy.",
        "raw_chunks": [
            {"document_title": "Salon Terms", "content": "No refund policy."}
        ]
    }

    with patch("backend.app.services.rag_generator.context_retriever.assemble_context", return_value=fake_context):
        # Test English citations & uncertainty text
        res_en = await rag_generator_service.generate_response(mock_db, uuid.uuid4(), "Refund policy?", lang="en")
        assert "Salon Terms" in res_en["citations"]
        assert "I don't have enough verified information" in res_en["system_prompt"]

        # Test Persian uncertainty text
        res_fa = await rag_generator_service.generate_response(mock_db, uuid.uuid4(), "تخفیف داری؟", lang="fa")
        assert "اطلاعات کافی و تاییدشده‌ای برای پاسخ به این سوال در دسترس نیست" in res_fa["system_prompt"]
