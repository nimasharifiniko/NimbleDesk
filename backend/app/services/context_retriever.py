from typing import Dict, Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.app.models.business import Business
from backend.app.models.business_info import BusinessHour
from backend.app.models.menu_item import MenuItem
from backend.app.models.service import Service
from backend.app.services.vector_store import vector_store_service

class ContextRetriever:
    """
    Assembles grounded context combining structured database records
    (business hours, menu, services) with vector knowledge search.
    Strictly isolated by business_id.
    """
    async def assemble_context(
        self,
        db: AsyncSession,
        business_id: UUID,
        query: str
    ) -> Dict[str, Any]:
        # Fetch business details
        biz_stmt = select(Business).where(Business.id == business_id)
        biz_res = await db.execute(biz_stmt)
        biz = biz_res.scalar_one_or_none()
        biz_name = biz.name if biz else "Business"

        # Fetch operating hours
        hours_stmt = select(BusinessHour).where(BusinessHour.business_id == business_id)
        hours_res = await db.execute(hours_stmt)
        hours_records = hours_res.scalars().all()
        
        hours_lines = []
        for h in hours_records:
            status = "Closed" if h.is_closed else f"{h.open_time} - {h.close_time}"
            hours_lines.append(f"{h.day_of_week}: {status}")
        hours_str = "\n".join(hours_lines) if hours_lines else "Not specified"

        # Fetch available menu items
        menu_stmt = select(MenuItem).where(MenuItem.business_id == business_id, MenuItem.is_available == True)
        menu_res = await db.execute(menu_stmt)
        menu_items = menu_res.scalars().all()
        menu_lines = [f"- {item.name}: {item.price} {item.currency}" for item in menu_items]
        menu_str = "\n".join(menu_lines) if menu_lines else "N/A"

        # Fetch active services
        service_stmt = select(Service).where(Service.business_id == business_id)
        service_res = await db.execute(service_stmt)
        services = service_res.scalars().all()
        service_lines = [f"- {s.name} ({s.duration_minutes}m): {s.price} {s.currency}" for s in services]
        service_str = "\n".join(service_lines) if service_lines else "N/A"

        # Search vector knowledge base
        vector_chunks = await vector_store_service.search_similar_chunks(
            db=db,
            business_id=business_id,
            query=query,
            limit=3
        )
        kb_lines = [f"[{c['document_title']}]: {c['content']}" for c in vector_chunks]
        kb_str = "\n".join(kb_lines) if kb_lines else "No specific document match."

        return {
            "business_name": biz_name,
            "business_hours": hours_str,
            "menu_items": menu_str,
            "services": service_str,
            "knowledge_base": kb_str,
            "raw_chunks": vector_chunks
        }

context_retriever = ContextRetriever()
