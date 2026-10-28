from typing import Dict, Any, List, Optional
from uuid import UUID
from sqlalchemy import cast, String
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.app.models.business_info import BusinessHour, BusinessLink
from backend.app.models.menu_item import MenuItem

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

ai_tools_service = AIToolsService()
