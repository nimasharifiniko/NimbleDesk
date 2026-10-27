import pytest
from sqlalchemy import select
from backend.app.core.database import AsyncSessionLocal
from backend.app.core.tenant import TenantRepository
from backend.app.models.business import Business
from backend.app.models.menu_item import MenuItem

@pytest.mark.asyncio
async def test_tenant_isolation_prevents_cross_data_access():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(Business))
        businesses = res.scalars().all()
        
        if len(businesses) < 2:
            pytest.skip("Not enough businesses seeded for isolation test.")
            
        cafe_biz = next((b for b in businesses if b.slug == "nima-cafe"), businesses[0])
        salon_biz = next((b for b in businesses if b.slug == "nimble-salon"), businesses[1])
        
        # Cafe Tenant Repository
        cafe_repo = TenantRepository(MenuItem, db, cafe_biz.id)
        cafe_items = await cafe_repo.get_all()
        
        assert len(cafe_items) > 0
        
        # Ensure ALL returned items belong exclusively to Cafe
        for item in cafe_items:
            assert item.business_id == cafe_biz.id
            assert item.business_id != salon_biz.id

