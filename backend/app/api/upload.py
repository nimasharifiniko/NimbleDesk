import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.core.database import get_db
from backend.app.services.ingestion import ingestion_service

router = APIRouter(prefix="/api/v1/documents", tags=["Document Upload"])

MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 # 5 MB limit
ALLOWED_EXTENSIONS = {".pdf", ".txt"}

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_document(
    business_id: UUID = Form(...),
    title: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    file_ext = os.path.splitext(file.filename or "")[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{file_ext}'. Allowed formats: .pdf, .txt"
        )

    content_bytes = await file.read()
    if len(content_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum allowed limit of 5 MB."
        )

    if file_ext == ".pdf":
        doc = await ingestion_service.ingest_pdf_document(
            db=db,
            business_id=business_id,
            title=title,
            pdf_bytes=content_bytes
        )
    else: # .txt file
        text_content = content_bytes.decode("utf-8", errors="ignore")
        doc = await ingestion_service.ingest_text_document(
            db=db,
            business_id=business_id,
            title=title,
            content=text_content
        )

    return {
        "document_id": str(doc.id),
        "title": doc.title,
        "filename": file.filename,
        "file_type": file_ext,
        "status": "processed_and_vectorized"
    }
