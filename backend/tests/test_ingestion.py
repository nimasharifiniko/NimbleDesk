import pytest
import uuid
from unittest.mock import AsyncMock, MagicMock
from backend.app.services.ingestion import ingestion_service

def test_chunk_text_small_input():
    text = "This is a small text query."
    chunks = ingestion_service.chunk_text(text, chunk_size=300, overlap=50)
    assert len(chunks) == 1
    assert chunks[0] == text

def test_chunk_text_empty_input():
    chunks = ingestion_service.chunk_text("")
    assert chunks == []

def test_chunk_text_large_input_overlap():
    words = [f"word{i}" for i in range(500)]
    long_text = " ".join(words)
    chunks = ingestion_service.chunk_text(long_text, chunk_size=200, overlap=50)
    assert len(chunks) > 1
    # Check that adjacent chunks share overlapping words
    chunk0_words = set(chunks[0].split())
    chunk1_words = set(chunks[1].split())
    assert len(chunk0_words.intersection(chunk1_words)) > 0

@pytest.mark.asyncio
async def test_ingest_text_document_mock_db():
    mock_db = AsyncMock()
    test_biz_id = uuid.uuid4()
    
    doc = await ingestion_service.ingest_text_document(
        db=mock_db,
        business_id=test_biz_id,
        title="FAQ Document",
        content="Question: What is your refund policy? Answer: 30 days money back guarantee."
    )
    
    assert doc.title == "FAQ Document"
    assert doc.business_id == test_biz_id
    mock_db.commit.assert_called_once()
