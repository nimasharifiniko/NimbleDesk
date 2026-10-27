import asyncio
import uuid
from backend.app.core.database import AsyncSessionLocal
from backend.app.models import User, Business, Category, MenuItem, Service, BusinessHour, BusinessLink, FAQ

async def seed_data():
    async with AsyncSessionLocal() as db:
        # Check if already seeded
        from sqlalchemy import select
        res = await db.execute(select(User).where(User.email == "owner@nimbledesk.com"))
        if res.scalars().first():
            print("Database already seeded!")
            return

        # 1. Create Owner User
        owner = User(
            email="owner@nimbledesk.com",
            hashed_password="hashed_placeholder_pass",
            full_name="Nima Sharifi Niko",
            is_active=True
        )
        db.add(owner)
        await db.flush()

        # 2. Business 1: Cafe
        cafe = Business(
            owner_id=owner.id,
            name="Nima Specialty Coffee",
            slug="nima-cafe",
            business_type="cafe",
            description="Specialty coffee shop and bakery.",
            phone="+989120000000",
            address="Tehran, Vanak Sq"
        )
        db.add(cafe)
        await db.flush()

        cat_drinks = Category(business_id=cafe.id, name="Hot Coffee", target_type="menu")
        db.add(cat_drinks)
        await db.flush()

        item1 = MenuItem(business_id=cafe.id, category_id=cat_drinks.id, name="Espresso Double", description="100% Arabica", price=4.50)
        item2 = MenuItem(business_id=cafe.id, category_id=cat_drinks.id, name="Latte", description="Fresh steamed milk with espresso", price=5.50)
        db.add_all([item1, item2])

        faq_cafe = FAQ(business_id=cafe.id, question="Do you have WiFi?", answer="Yes, high-speed free WiFi is available for customers.")
        db.add(faq_cafe)

        # 3. Business 2: Salon
        salon = Business(
            owner_id=owner.id,
            name="Nimble Style Studio",
            slug="nimble-salon",
            business_type="salon",
            description="Modern hair and grooming studio.",
            phone="+989121111111",
            address="Tehran, Mirdamad"
        )
        db.add(salon)
        await db.flush()

        cat_hair = Category(business_id=salon.id, name="Hair Services", target_type="service")
        db.add(cat_hair)
        await db.flush()

        srv1 = Service(business_id=salon.id, category_id=cat_hair.id, name="Haircut & Styling", price=25.00, duration_minutes=45)
        db.add(srv1)

        # 4. Business 3: Airline
        airline = Business(
            owner_id=owner.id,
            name="Nimble Airways",
            slug="nimble-airways",
            business_type="company",
            description="Premium regional flight services.",
            phone="+982188888888",
            address="Tehran, Airport Blvd"
        )
        db.add(airline)
        await db.flush()

        faq_air1 = FAQ(business_id=airline.id, question="What is the cabin baggage limit?", answer="Economy class passengers are allowed 1 piece up to 7kg.")
        faq_air2 = FAQ(business_id=airline.id, question="How can I cancel my ticket?", answer="Cancellation is available via website up to 2 hours before flight.")
        db.add_all([faq_air1, faq_air2])

        await db.commit()
        print("Successfully seeded 3 businesses (Cafe, Salon, Airline) into PostgreSQL!")

if __name__ == "__main__":
    asyncio.run(seed_data())

