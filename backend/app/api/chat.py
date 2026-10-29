import asyncio
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional, AsyncGenerator
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.app.core.database import get_db
from backend.app.models.business import Business
from backend.app.services.rag_generator import rag_generator_service
from backend.app.services.prompt_guard import prompt_guard_service

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
    # Prompt Guard inspection
    guard_res = prompt_guard_service.inspect_prompt(request.query)
    if not guard_res["is_safe"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Security violation: Malicious prompt pattern detected."
        )

    stmt = select(Business).where(Business.slug == request.business_slug)
    res = await db.execute(stmt)
    business = res.scalar_one_or_none()

    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business tenant '{request.business_slug}' not found."
        )

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

async def event_stream_generator(full_text: str) -> AsyncGenerator[str, None]:
    """
    Yields response token chunks with SSE event formatting.
    """
    words = full_text.split()
    for word in words:
        yield f"data: {word} \n\n"
        await asyncio.sleep(0.05) # Simulate token streaming delay
    yield "data: [DONE]\n\n"

@router.post("/chat/stream")
async def chat_stream_endpoint(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    guard_res = prompt_guard_service.inspect_prompt(request.query)
    if not guard_res["is_safe"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Security violation: Malicious prompt pattern detected."
        )

    stmt = select(Business).where(Business.slug == request.business_slug)
    res = await db.execute(stmt)
    business = res.scalar_one_or_none()

    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Business tenant '{request.business_slug}' not found."
        )

    rag_result = await rag_generator_service.generate_response(
        db=db,
        business_id=business.id,
        query=request.query,
        lang=request.language
    )

    return StreamingResponse(
        event_stream_generator(rag_result["response"]),
        media_type="text/event-stream"
    )
