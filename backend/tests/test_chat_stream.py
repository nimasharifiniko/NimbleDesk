import pytest
import uuid
from unittest.mock import AsyncMock, MagicMock
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.database import get_db

client = TestClient(app)

def test_chat_stream_endpoint_returns_event_stream():
    async def mock_get_db():
        mock_session = AsyncMock()
        mock_result = MagicMock()
        mock_biz = MagicMock()
        mock_biz.id = uuid.uuid4()
        mock_biz.name = "Nimble Cafe"
        mock_result.scalar_one_or_none.return_value = mock_biz
        mock_session.execute.return_value = mock_result
        yield mock_session

    app.dependency_overrides[get_db] = mock_get_db

    response = client.post(
        "/api/v1/chat/stream",
        json={
            "business_slug": "nimble-cafe",
            "query": "What are your hours?",
            "language": "en"
        }
    )
    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]
    assert "data: [DONE]" in response.text

    app.dependency_overrides.clear()
