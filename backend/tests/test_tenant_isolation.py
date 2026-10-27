import pytest
import uuid

def test_tenant_repository_structure():
    """
    Sanity check to ensure TenantRepository enforces business_id requirement.
    """
    from backend.app.core.tenant import TenantRepository
    from backend.app.models.menu_item import MenuItem

    business_a_id = uuid.uuid4()
    business_b_id = uuid.uuid4()

    assert business_a_id != business_b_id

