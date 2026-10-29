from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.app.core.database import get_db
from backend.app.models.business import Business
from backend.app.models.menu_item import MenuItem
from backend.app.models.service import Service
from backend.app.services.qr_generator import qr_generator_service

router = APIRouter(prefix="/api/v1", tags=["Business Management"])

# --- Schemas ---
class BusinessCreateRequest(BaseModel):
    name: str = Field(..., min_length=2)
    slug: str = Field(..., min_length=2)
    owner_id: Optional[UUID] = None

class MenuItemCreateRequest(BaseModel):
    business_id: UUID
    name: str = Field(..., min_length=1)
    description: Optional[str] = None
    price: float = Field(..., ge=0)
    currency: str = Field("USD")
    is_available: bool = True

class ServiceCreateRequest(BaseModel):
    business_id: UUID
    name: str = Field(..., min_length=1)
    description: Optional[str] = None
    duration_minutes: int = Field(..., gt=0)
    price: float = Field(..., ge=0)
    currency: str = Field("USD")

# --- Endpoints ---
@router.post("/business", status_code=status.HTTP_201_CREATED)
async def create_business(request: BusinessCreateRequest, db: AsyncSession = Depends(get_db)):
    stmt = select(Business).where(Business.slug == request.slug)
    res = await db.execute(stmt)
    if res.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Business slug already exists.")

    business = Business(
        name=request.name,
        slug=request.slug,
        owner_id=request.owner_id
    )
    db.add(business)
    await db.commit()
    await db.refresh(business)

    return {"id": str(business.id), "name": business.name, "slug": business.slug}

@router.get("/business/{slug}")
async def get_business_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Business).where(Business.slug == slug)
    res = await db.execute(stmt)
    business = res.scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found.")

    return {"id": str(business.id), "name": business.name, "slug": business.slug}

@router.get("/business/{slug}/qr")
async def get_business_qr_code(slug: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Business).where(Business.slug == slug)
    res = await db.execute(stmt)
    business = res.scalar_one_or_none()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found.")

    target_url = f"https://nimbledesk.ai/c/{business.slug}"
    qr_bytes = qr_generator_service.generate_qr_code(target_url)

    return Response(content=qr_bytes, media_type="image/png")

@router.post("/menu-items", status_code=status.HTTP_201_CREATED)
async def create_menu_item(request: MenuItemCreateRequest, db: AsyncSession = Depends(get_db)):
    item = MenuItem(
        business_id=request.business_id,
        name=request.name,
        description=request.description,
        price=request.price,
        currency=request.currency,
        is_available=request.is_available
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)

    return {"id": str(item.id), "name": item.name, "price": item.price, "currency": item.currency}

@router.post("/services", status_code=status.HTTP_201_CREATED)
async def create_service(request: ServiceCreateRequest, db: AsyncSession = Depends(get_db)):
    service = Service(
        business_id=request.business_id,
        name=request.name,
        description=request.description,
        duration_minutes=request.duration_minutes,
        price=request.price,
        currency=request.currency
    )
    db.add(service)
    await db.commit()
    await db.refresh(service)

    return {"id": str(service.id), "name": service.name, "duration_minutes": service.duration_minutes, "price": service.price}
