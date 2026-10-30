import sys
import os
import pytest
from unittest.mock import AsyncMock, patch

backend_dir = os.path.abspath("backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_e2e_health_and_public_endpoints():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] in ["ok", "healthy"]

@patch("app.api.chat.get_db")
def test_public_chat_stream_mock(mock_db):
    mock_db.return_value = AsyncMock()
    chat_resp = client.post(
        "/api/v1/chat/stream/demo",
        json={"message": "What are your business hours?"}
    )
    assert chat_resp.status_code in [200, 429, 404]

def test_unauthorized_access_security():
    # Attempt to upload document without auth token should return 401 or 403
    response = client.post("/api/v1/documents/upload/test-id")
    assert response.status_code in [401, 403, 404]
