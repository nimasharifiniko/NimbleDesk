import pytest
import uuid
from unittest.mock import AsyncMock, MagicMock
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.database import get_db

client = TestClient(app)

def test_create_business_hour_endpoint():
    async def mock_get_db():
        mock_session = AsyncMock()
        yield mock_session

    app.dependency_overrides[get_db] = mock_get_db

    fake_biz_id = str(uuid.uuid4())
    response = client.post(
        "/api/v1/business-hours",
        json={
            "business_id": fake_biz_id,
            "day_of_week": 0,
            "open_time": "08:00",
            "close_time": "18:00",
            "is_closed": False
        }
    )
    assert response.status_code == 201
    assert response.json()["day_of_week"] == 0

    app.dependency_overrides.clear()

def test_create_faq_endpoint():
    async def mock_get_db():
        mock_session = AsyncMock()
        yield mock_session

    app.dependency_overrides[get_db] = mock_get_db

    fake_biz_id = str(uuid.uuid4())
    response = client.post(
        "/api/v1/faqs",
        json={
            "business_id": fake_biz_id,
            "question": "What is your refund policy?",
            "answer": "Full refund within 14 days."
        }
    )
    assert response.status_code == 201
    assert "refund policy" in response.json()["question"]

    app.dependency_overrides.clear()
