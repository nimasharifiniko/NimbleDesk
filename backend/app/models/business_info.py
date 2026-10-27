import uuid
from typing import Optional
from sqlalchemy import String, Time, Boolean, ForeignKey, SmallInteger
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from backend.app.models.base import BaseModel

class BusinessHour(BaseModel):
    __tablename__ = "business_hours"

    business_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    day_of_week: Mapped[int] = mapped_column(SmallInteger, nullable=False)  # 0=Monday/???? ... 6=Sunday/????
    open_time: Mapped[Optional[str]] = mapped_column(String(10), nullable=True) # e.g. "08:00"
    close_time: Mapped[Optional[str]] = mapped_column(String(10), nullable=True) # e.g. "23:00"
    is_closed: Mapped[bool] = mapped_column(Boolean, default=False)

class BusinessLink(BaseModel):
    __tablename__ = "business_links"

    business_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. "Instagram", "Map", "Phone"
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    link_type: Mapped[str] = mapped_column(String(50), nullable=False) # instagram, telegram, map, website, phone
    sort_order: Mapped[int] = mapped_column(SmallInteger, default=0)

