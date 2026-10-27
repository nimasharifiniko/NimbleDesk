import pytest
from unittest.mock import AsyncMock, MagicMock
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.database import get_db

client = TestClient(app)

def test_chat_endpoint_business_not_found():
    async def mock_get_db():
        mock_session = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_session.execute.return_value = mock_result
        yield mock_session

    app.dependency_overrides[get_db] = mock_get_db

    response = client.post(
        "/api/v1/chat",
        json={
            "business_slug": "non-existent-biz",
            "query": "Hello",
            "language": "en"
        }
    )
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]

    app.dependency_overrides.clear()
