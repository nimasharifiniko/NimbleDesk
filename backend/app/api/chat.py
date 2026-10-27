from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.app.core.database import get_db
from backend.app.models.business import Business
from backend.app.services.rag_generator import rag_generator_service

router = APIRouter(prefix="/api/v1", tags=["Chat"])

class ChatRequest(BaseModel):
    business_slug: str = Field(..., description="Unique slug of the business tenant")
    query: str = Field(..., min_length=1, description="Customer question")
    language: Optional[str] = Field("en", description="Language code: en, fa, or nl")

class ChatResponse(BaseModel):
    business_id: str
    query: str
    response: str
    language: str

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    # Lookup tenant by slug
    stmt = select(Business).where(Business.slug == request.business_slug)
    res = await db.execute(stmt)
    business = res.scalar_one_or_none()

    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business tenant '{request.business_slug}' not found."
        )

    # Generate RAG response
    rag_result = await rag_generator_service.generate_response(
        db=db,
        business_id=business.id,
        query=request.query,
        lang=request.language
    )

    return ChatResponse(
        business_id=str(business.id),
        query=request.query,
        response=rag_result["response"],
        language=rag_result["language"]
    )
