import pytest
import uuid
from unittest.mock import AsyncMock, MagicMock
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.database import get_db
from backend.app.services.qr_generator import qr_generator_service

client = TestClient(app)

def test_qr_generator_service_returns_png_bytes():
    qr_bytes = qr_generator_service.generate_qr_code("https://nimbledesk.ai/c/nima-cafe")
    assert isinstance(qr_bytes, bytes)
    # Check PNG magic header bytes (\x89PNG)
    assert qr_bytes.startswith(b"\x89PNG")

def test_get_business_qr_code_endpoint():
    async def mock_get_db():
        mock_session = AsyncMock()
        mock_result = MagicMock()
        mock_biz = MagicMock()
        mock_biz.slug = "nima-cafe"
        mock_result.scalar_one_or_none.return_value = mock_biz
        mock_session.execute.return_value = mock_result
        yield mock_session

    app.dependency_overrides[get_db] = mock_get_db

    response = client.get("/api/v1/business/nima-cafe/qr")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert response.content.startswith(b"\x89PNG")

    app.dependency_overrides.clear()
