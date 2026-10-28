from typing import Dict, Any, List, Optional
from uuid import UUID
from datetime import datetime
from sqlalchemy import cast, String
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.app.models.business_info import BusinessHour, BusinessLink
from backend.app.models.menu_item import MenuItem
from backend.app.models.interaction import BookingRequest, ContactRequest
from backend.app.services.vector_store import vector_store_service

class AIToolsService:
    """
    Structured execution tools callable by AI engine.
    Strictly scoped by business_id to enforce multi-tenancy security.
    """

    async def search_menu(
        self,
        db: AsyncSession,
        business_id: UUID,
        query: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        stmt = select(MenuItem).where(MenuItem.business_id == business_id, MenuItem.is_available == True)
        if query and query.strip():
            stmt = stmt.where(MenuItem.name.ilike(f"%{query.strip()}%"))

        res = await db.execute(stmt)
        items = res.scalars().all()

        return [
            {
                "id": str(item.id),
                "name": item.name,
                "description": item.description,
                "price": item.price,
                "currency": item.currency
            }
            for item in items
        ]

    async def get_hours(
        self,
        db: AsyncSession,
        business_id: UUID,
        day_of_week: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        stmt = select(BusinessHour).where(BusinessHour.business_id == business_id)
        if day_of_week and day_of_week.strip():
            stmt = stmt.where(cast(BusinessHour.day_of_week, String).ilike(f"%{day_of_week.strip()}%"))

        res = await db.execute(stmt)
        hours = res.scalars().all()

        return [
            {
                "day": str(h.day_of_week),
                "open_time": h.open_time if not h.is_closed else None,
                "close_time": h.close_time if not h.is_closed else None,
                "is_closed": h.is_closed
            }
            for h in hours
        ]

    async def get_contact(
        self,
        db: AsyncSession,
        business_id: UUID
    ) -> List[Dict[str, Any]]:
        stmt = select(BusinessLink).where(BusinessLink.business_id == business_id)
        res = await db.execute(stmt)
        links = res.scalars().all()

        return [
            {
                "platform": link.platform,
                "title": link.title,
                "url": link.url
            }
            for link in links
        ]

    async def get_policy(
        self,
        db: AsyncSession,
        business_id: UUID,
        query: str
    ) -> List[Dict[str, Any]]:
        return await vector_store_service.search_similar_chunks(
            db=db,
            business_id=business_id,
            query=f"policy terms cancellation rules {query}",
            limit=3
        )

    async def create_booking_request(
        self,
        db: AsyncSession,
        business_id: UUID,
        customer_name: str,
        customer_phone: str,
        requested_date: datetime,
        service_id: Optional[UUID] = None,
        notes: Optional[str] = None
    ) -> Dict[str, Any]:
        booking = BookingRequest(
            business_id=business_id,
            service_id=service_id,
            customer_name=customer_name,
            customer_phone=customer_phone,
            requested_date=requested_date,
            notes=notes
        )
        db.add(booking)
        await db.commit()
        await db.refresh(booking)

        return {
            "booking_id": str(booking.id),
            "status": str(booking.status),
            "message": "Booking request submitted successfully."
        }

    async def create_contact_request(
        self,
        db: AsyncSession,
        business_id: UUID,
        customer_name: str,
        customer_phone: str,
        message: str
    ) -> Dict[str, Any]:
        contact = ContactRequest(
            business_id=business_id,
            customer_name=customer_name,
            customer_phone=customer_phone,
            message=message
        )
        db.add(contact)
        await db.commit()
        await db.refresh(contact)

        return {
            "contact_id": str(contact.id),
            "status": str(contact.status),
            "message": "Contact request submitted successfully."
        }

ai_tools_service = AIToolsService()
