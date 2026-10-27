import pytest
import uuid
from unittest.mock import AsyncMock, MagicMock
from backend.app.services.context_retriever import context_retriever

@pytest.mark.asyncio
async def test_assemble_context_structure():
    mock_db = AsyncMock()
    
    # Mocking database execute responses
    mock_biz = MagicMock()
    mock_biz.name = "Test Cafe"

    mock_res_biz = MagicMock()
    mock_res_biz.scalar_one_or_none.return_value = mock_biz

    mock_res_empty = MagicMock()
    mock_res_empty.scalars.return_value.all.return_value = []

    # Setup execute side effects for business, hours, menu, service calls
    mock_db.execute.side_effect = [
        mock_res_biz,   # Business query
        mock_res_empty, # Hours query
        mock_res_empty, # Menu query
        mock_res_empty, # Service query
        MagicMock(all=MagicMock(return_value=[])) # Vector search query
    ]

    test_biz_id = uuid.uuid4()
    context = await context_retriever.assemble_context(
        db=mock_db,
        business_id=test_biz_id,
        query="Coffee price?"
    )

    assert context["business_name"] == "Test Cafe"
    assert "business_hours" in context
    assert "menu_items" in context
    assert "services" in context
    assert "knowledge_base" in context
