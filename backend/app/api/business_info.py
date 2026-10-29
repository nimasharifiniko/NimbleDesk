from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.app.core.database import get_db
from backend.app.models.business_info import BusinessHour, BusinessLink
from backend.app.models.knowledge import FAQ

router = APIRouter(prefix="/api/v1", tags=["Business Information & FAQ"])

# --- Schemas ---
class BusinessHourCreateRequest(BaseModel):
    business_id: UUID
    day_of_week: int = Field(..., ge=0, le=6, description="0=Monday, 6=Sunday")
    open_time: Optional[str] = Field(None, description="Format HH:MM")
    close_time: Optional[str] = Field(None, description="Format HH:MM")
    is_closed: bool = False

class BusinessLinkCreateRequest(BaseModel):
    business_id: UUID
    platform: str = Field(..., min_length=2)
    title: str = Field(...)
    url: str = Field(...)

class FAQCreateRequest(BaseModel):
    business_id: UUID
    question: str = Field(..., min_length=3)
    answer: str = Field(..., min_length=2)

# --- Endpoints ---
@router.post("/business-hours", status_code=status.HTTP_201_CREATED)
async def create_business_hour(request: BusinessHourCreateRequest, db: AsyncSession = Depends(get_db)):
    hour = BusinessHour(
        business_id=request.business_id,
        day_of_week=request.day_of_week,
        open_time=request.open_time,
        close_time=request.close_time,
        is_closed=request.is_closed
    )
    db.add(hour)
    await db.commit()
    await db.refresh(hour)

    return {"id": str(hour.id), "day_of_week": hour.day_of_week, "is_closed": hour.is_closed}

@router.post("/business-links", status_code=status.HTTP_201_CREATED)
async def create_business_link(request: BusinessLinkCreateRequest, db: AsyncSession = Depends(get_db)):
    link = BusinessLink(
        business_id=request.business_id,
        platform=request.platform,
        title=request.title,
        url=request.url
    )
    db.add(link)
    await db.commit()
    await db.refresh(link)

    return {"id": str(link.id), "platform": link.platform, "url": link.url}

@router.post("/faqs", status_code=status.HTTP_201_CREATED)
async def create_faq(request: FAQCreateRequest, db: AsyncSession = Depends(get_db)):
    faq = FAQ(
        business_id=request.business_id,
        question=request.question,
        answer=request.answer
    )
    db.add(faq)
    await db.commit()
    await db.refresh(faq)

    return {"id": str(faq.id), "question": faq.question}
