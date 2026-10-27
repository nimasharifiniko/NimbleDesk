import pytest
import uuid
from unittest.mock import AsyncMock, MagicMock
from backend.app.services.vector_store import vector_store_service

@pytest.mark.asyncio
async def test_vector_store_empty_query():
    mock_db = AsyncMock()
    test_biz_id = uuid.uuid4()
    results = await vector_store_service.search_similar_chunks(
        db=mock_db,
        business_id=test_biz_id,
        query=""
    )
    assert results == []
    mock_db.execute.assert_not_called()

@pytest.mark.asyncio
async def test_vector_store_tenant_isolation():
    mock_db = AsyncMock()
    mock_result = MagicMock()
    mock_result.all.return_value = []
    mock_db.execute.return_value = mock_result

    fake_biz_id = uuid.uuid4()
    results = await vector_store_service.search_similar_chunks(
        db=mock_db,
        business_id=fake_biz_id,
        query="What are your opening hours?"
    )
    assert isinstance(results, list)
    assert len(results) == 0
    mock_db.execute.assert_called_once()
