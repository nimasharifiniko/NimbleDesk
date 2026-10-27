import pytest
import uuid
from unittest.mock import AsyncMock, MagicMock
from backend.app.services.context_retriever import context_retriever

@pytest.mark.asyncio
async def test_hybrid_retrieval_combines_structured_and_vector_data():
    mock_db = AsyncMock()

    # Mock Business
    mock_biz = MagicMock()
    mock_biz.name = "Nimble Cafe"
    res_biz = MagicMock()
    res_biz.scalar_one_or_none.return_value = mock_biz

    # Mock Structured Business Hours
    mock_hour = MagicMock()
    mock_hour.day_of_week = "Monday"
    mock_hour.open_time = "08:00"
    mock_hour.close_time = "20:00"
    mock_hour.is_closed = False
    res_hours = MagicMock()
    res_hours.scalars.return_value.all.return_value = [mock_hour]

    # Mock Structured Menu
    mock_item = MagicMock()
    mock_item.name = "Latte"
    mock_item.price = 4.5
    mock_item.currency = "USD"
    res_menu = MagicMock()
    res_menu.scalars.return_value.all.return_value = [mock_item]

    # Mock Structured Services
    mock_service = MagicMock()
    mock_service.name = "Haircut"
    mock_service.duration_minutes = 30
    mock_service.price = 25.0
    mock_service.currency = "USD"
    res_services = MagicMock()
    res_services.scalars.return_value.all.return_value = [mock_service]

    # Mock Vector Search result
    mock_vector_res = MagicMock()
    mock_vector_res.all.return_value = []

    mock_db.execute.side_effect = [
        res_biz,
        res_hours,
        res_menu,
        res_services,
        mock_vector_res
    ]

    test_biz_id = uuid.uuid4()
    context = await context_retriever.assemble_context(
        db=mock_db,
        business_id=test_biz_id,
        query="What are your hours and latte price?"
    )

    # Validate structured data retrieval
    assert context["business_name"] == "Nimble Cafe"
    assert "Monday: 08:00 - 20:00" in context["business_hours"]
    assert "- Latte: 4.5 USD" in context["menu_items"]
    assert "- Haircut (30m): 25.0 USD" in context["services"]
    assert "knowledge_base" in context
