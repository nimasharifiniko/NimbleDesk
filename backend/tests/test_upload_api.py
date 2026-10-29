import io
import pytest
import uuid
from unittest.mock import AsyncMock
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.database import get_db

client = TestClient(app)

def test_upload_invalid_file_extension():
    fake_biz_id = str(uuid.uuid4())
    file_bytes = io.BytesIO(b"fake image data")

    response = client.post(
        "/api/v1/documents/upload",
        data={"business_id": fake_biz_id, "title": "Test Image"},
        files={"file": ("test.png", file_bytes, "image/png")}
    )
    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["detail"]

def test_upload_txt_file_success():
    async def mock_get_db():
        mock_session = AsyncMock()
        yield mock_session

    app.dependency_overrides[get_db] = mock_get_db

    fake_biz_id = str(uuid.uuid4())
    txt_content = io.BytesIO(b"This is a valid text document for vectorization.")

    response = client.post(
        "/api/v1/documents/upload",
        data={"business_id": fake_biz_id, "title": "Store Guidelines"},
        files={"file": ("guidelines.txt", txt_content, "text/plain")}
    )
    assert response.status_code == 201
    assert response.json()["filename"] == "guidelines.txt"
    assert response.json()["file_type"] == ".txt"

    app.dependency_overrides.clear()
