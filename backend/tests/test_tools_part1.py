import pytest
import uuid
from unittest.mock import AsyncMock, MagicMock
from backend.app.services.tools import ai_tools_service

@pytest.mark.asyncio
async def test_search_menu_tool():
    mock_db = AsyncMock()
    mock_item = MagicMock()
    mock_item.id = uuid.uuid4()
    mock_item.name = "Cappuccino"
    mock_item.description = "Italian coffee"
    mock_item.price = 4.0
    mock_item.currency = "USD"

    res_mock = MagicMock()
    res_mock.scalars.return_value.all.return_value = [mock_item]
    mock_db.execute.return_value = res_mock

    items = await ai_tools_service.search_menu(mock_db, uuid.uuid4(), query="Cappuccino")
    assert len(items) == 1
    assert items[0]["name"] == "Cappuccino"
    assert items[0]["price"] == 4.0

@pytest.mark.asyncio
async def test_get_hours_tool():
    mock_db = AsyncMock()
    mock_hour = MagicMock()
    mock_hour.day_of_week = "Friday"
    mock_hour.open_time = "09:00"
    mock_hour.close_time = "22:00"
    mock_hour.is_closed = False

    res_mock = MagicMock()
    res_mock.scalars.return_value.all.return_value = [mock_hour]
    mock_db.execute.return_value = res_mock

    hours = await ai_tools_service.get_hours(mock_db, uuid.uuid4(), day_of_week="Friday")
    assert len(hours) == 1
    assert hours[0]["day"] == "Friday"
    assert hours[0]["is_closed"] is False

@pytest.mark.asyncio
async def test_get_contact_tool():
    mock_db = AsyncMock()
    mock_link = MagicMock()
    mock_link.platform = "Instagram"
    mock_link.title = "Official IG"
    mock_link.url = "https://instagram.com/nimbledesk"

    res_mock = MagicMock()
    res_mock.scalars.return_value.all.return_value = [mock_link]
    mock_db.execute.return_value = res_mock

    contacts = await ai_tools_service.get_contact(mock_db, uuid.uuid4())
    assert len(contacts) == 1
    assert contacts[0]["platform"] == "Instagram"
