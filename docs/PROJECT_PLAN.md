# NimbleDesk - Technical Roadmap & Execution Plan

## ?? Vision
NimbleDesk is a multi-tenant, AI-powered smart front-desk platform for local businesses (cafes, salons, agencies). It enables customers to scan a QR code and interact with a business-specific assistant while ensuring zero hallucination on critical data like prices and working hours.

---

## ??? Architecture Overview

- **Backend:** FastAPI (Python 3.12+), Pydantic, SQLAlchemy 2.0 Async
- **Database:** PostgreSQL 16 + pgvector (Dockerized)
- **Migrations:** Alembic
- **AI/LLM:** Ollama (Qwen 2.5 local) + Hybrid Search (Structured + Vector)
- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, i18n (EN / FA / NL)
- **CI/CD:** GitHub Actions

---

## ?? Milestones Summary

- **M0: Foundation (Current)** -> Infrastructure, FastAPI skeleton, Docker DB, Next.js i18n setup.
- **M1: Data Model & Tenant Isolation** -> Multi-tenant schema, seed data, security boundary tests.
- **M2: Quality Benchmark** -> Evaluation dataset (EN/FA/NL) & evaluation metrics script.
- **M3: AI Core & RAG Engine** -> LLM provider layer, vector search, tool calling, prompt defense.
- **M4: Public API & Auth** -> Owner signup/login, business management CRUD, QR code generator.
- **M5: Customer Interface & PWA** -> Mobile-first UI, chat component, booking forms, PWA manifest.
- **M6: Owner Dashboard & Wizard** -> Industry wizards, response refinement, PDF QR poster generator.
- **M7: Real-world Testing & Security Review** -> Playwright E2E tests, live business feedback.
- **M8: Production Release** -> Final Docker Compose, README polish, LinkedIn video demos.

