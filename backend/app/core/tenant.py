import uuid
from typing import Type, TypeVar, List, Optional, Generic
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.app.models.base import BaseModel

ModelType = TypeVar("ModelType", bound=BaseModel)

class TenantRepository(Generic[ModelType]):
    """
    Base Repository enforcing multi-tenant isolation by strictly filtering by business_id.
    """
    def __init__(self, model: Type[ModelType], db: AsyncSession, business_id: uuid.UUID):
        self.model = model
        self.db = db
        self.business_id = business_id

    async def get_by_id(self, item_id: uuid.UUID) -> Optional[ModelType]:
        query = select(self.model).where(
            self.model.id == item_id,
            getattr(self.model, "business_id") == self.business_id
        )
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_all(self) -> List[ModelType]:
        query = select(self.model).where(
            getattr(self.model, "business_id") == self.business_id
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create(self, **kwargs) -> ModelType:
        kwargs["business_id"] = self.business_id
        instance = self.model(**kwargs)
        self.db.add(instance)
        await self.db.commit()
        await self.db.refresh(instance)
        return instance

