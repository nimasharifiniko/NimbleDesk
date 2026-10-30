# NimbleDesk Production Deployment Guide

NimbleDesk is an AI-powered smart front-desk platform for local businesses, supporting multi-tenancy, RTL/Persian interface, and zero-hallucination RAG.

---

## Required Environment Variables
DATABASE_URL=postgresql+asyncpg://nimbledesk_admin:YOUR_DB_PASSWORD@localhost:5432/nimbledesk
JWT_SECRET=YOUR_SECURE_JWT_SECRET_KEY
OPENAI_API_KEY=TOUR_OPENAI_API_KEYNEXT_PUBLIC_API_BASE_URL=https://your-domain.com/api

---

## Production Launch
1. Launch with Docker: `docker compose -f docker-compose.prod.yml up -d --build`
2. Run Migrations: `docker compose -f docker-compose.prod.yml exec backend alembic upgrade head`

---

## Security Architecture
1. Tenant Isolation: Every request filtered by `business_id`.
2. Deterministic Context: Zero LLM hallucination for prices and hours.
3. Prompt Guard: Input sanitization prior to LLM execution.