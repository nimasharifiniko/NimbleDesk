import pytest
import uuid
from unittest.mock import AsyncMock, MagicMock
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.database import get_db

client = TestClient(app)

def test_create_business_duplicate_slug_error():
    async def mock_get_db():
        mock_session = AsyncMock()
        mock_result = MagicMock()
        mock_biz = MagicMock()
        mock_biz.slug = "existing-biz"
        mock_result.scalar_one_or_none.return_value = mock_biz
        mock_session.execute.return_value = mock_result
        yield mock_session

    app.dependency_overrides[get_db] = mock_get_db

    response = client.post(
        "/api/v1/business",
        json={
            "name": "Existing Cafe",
            "slug": "existing-biz"
        }
    )
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

    app.dependency_overrides.clear()

def test_get_business_not_found():
    async def mock_get_db():
        mock_session = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_session.execute.return_value = mock_result
        yield mock_session

    app.dependency_overrides[get_db] = mock_get_db

    response = client.get("/api/v1/business/non-existent-slug")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()

    app.dependency_overrides.clear()
