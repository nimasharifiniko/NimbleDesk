import pytest
import uuid
from datetime import datetime
from unittest.mock import AsyncMock, patch
from backend.app.services.tools import ai_tools_service

@pytest.mark.asyncio
async def test_get_policy_tool():
    mock_db = AsyncMock()
    fake_chunks = [{"chunk_id": "1", "content": "Refunds allowed within 14 days."}]

    with patch("backend.app.services.tools.vector_store_service.search_similar_chunks", return_value=fake_chunks):
        res = await ai_tools_service.get_policy(mock_db, uuid.uuid4(), "refunds")
        assert len(res) == 1
        assert "Refunds allowed" in res[0]["content"]

@pytest.mark.asyncio
async def test_create_booking_request_tool():
    mock_db = AsyncMock()
    test_biz_id = uuid.uuid4()

    res = await ai_tools_service.create_booking_request(
        db=mock_db,
        business_id=test_biz_id,
        customer_name="Ali Reza",
        customer_phone="+989123456789",
        requested_date=datetime.now(),
        notes="Haircut reservation"
    )

    assert "booking_id" in res
    assert res["message"] == "Booking request submitted successfully."
    mock_db.commit.assert_called_once()

@pytest.mark.asyncio
async def test_create_contact_request_tool():
    mock_db = AsyncMock()
    test_biz_id = uuid.uuid4()

    res = await ai_tools_service.create_contact_request(
        db=mock_db,
        business_id=test_biz_id,
        customer_name="Sara Sharifi",
        customer_phone="+989998887766",
        message="I need a custom consultation."
    )

    assert "contact_id" in res
    assert res["message"] == "Contact request submitted successfully."
    mock_db.commit.assert_called_once()
