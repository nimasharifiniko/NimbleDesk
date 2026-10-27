import pytest
import io
import uuid
from pypdf import PdfWriter
from unittest.mock import AsyncMock
from backend.app.services.ingestion import ingestion_service

def create_sample_pdf_bytes(text: str) -> bytes:
    # Utility function to generate sample PDF bytes in-memory for testing
    writer = PdfWriter()
    page = writer.add_blank_page(width=200, height=200)
    # Using pypdf writer annotation/text or simple mock bytes test
    buffer = io.BytesIO()
    writer.write(buffer)
    return buffer.getvalue()

def test_extract_pdf_empty_or_valid():
    sample_bytes = create_sample_pdf_bytes("NimbleDesk test PDF content")
    extracted = ingestion_service.extract_text_from_pdf(sample_bytes)
    assert isinstance(extracted, str)

@pytest.mark.asyncio
async def test_ingest_pdf_document_mock_db():
    mock_db = AsyncMock()
    test_biz_id = uuid.uuid4()
    sample_bytes = create_sample_pdf_bytes("Sample PDF Content")

    doc = await ingestion_service.ingest_pdf_document(
        db=mock_db,
        business_id=test_biz_id,
        title="Sample Rules PDF",
        pdf_bytes=sample_bytes
    )
    assert doc.title == "Sample Rules PDF"
    assert doc.business_id == test_biz_id
