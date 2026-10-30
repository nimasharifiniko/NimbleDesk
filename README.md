# ⚡ NimbleDesk - AI-Powered Smart Front-Desk & Customer Engagement Platform

NimbleDesk is a next-generation, multi-tenant AI support and commerce platform designed for local businesses (cafes, clinics, restaurants, and service providers). It combines a deterministic RAG engine with strict tenant isolation, zero-hallucination pricing, full RTL/Persian layout support, and a beautiful Apple-inspired glassmorphism UI.

---

## ✨ Key Features

- 🎯 **Zero-Hallucination RAG**: Services, prices, and operating hours are fetched directly from PostgreSQL database records, preventing LLM fabrication.
- 📀 **Multi-Tenant Security**: Strict `business_id` filtering across all FastAPI endpoints,, vector searches, and DB transactions.
- 🌰 **Multilingual & Full RTL**: Native support for English (`en`), Persian(`fa`), and Dutch (`nl`) with automatic RTL layout adjustments and Vazirmatn typography.
- 💢 **PWA Customer Chat Widget**: Fast, mobile-first chat interface with automatic booking modals at `/c/[business_slug]`.
- 👩 **Industry Onboarding Wizard**: 3-step wizard for Cafes, Clinics, and Services with auto-generated sample menus and FAQs.
- 📩 **TXT & PDF File Ingestion**: Upload custom business documents and automatically integrate them into the vector store.
- 🛸﮿ **QR Code Manager & Printable Posters**: Generate business QR codes and print professional announcement posters.

---

## 👏 Tech Stack

- **Frontend**: Next.js 16.4 (App Router, Turbopack, Cache Components), Tailwind CSS, Lucide React, Next-Intl
- **Backend**: FastAPI (Asyncio), Pydantic, Alembic, Pytest (51 E2E Integration Tests)
- **Database & Vector Store**: PostgreSQL 16 with `pgvector`
- **AI & LLM2 Integration**: OpenAI GPT-4 / GPT-3.5-Turdo, Hybrid Retrieval, Custom Prompt Guard

---

## 👉 QuickStart (Local Development)

1. **Clone the repository**:
   `bash
   git clone https://github.com/your-username/NimbleDesk.git
   cd NimbleDesk
   ``

2. **Start with Docker Compose**:
   `bash
   docker compose -f docker-compose.prod.yml up -d --build
   ``J
 3. **Run Backend Tests**:
   `bash
   python -m pytest backend/tests/
   ``J
---

## 📀 License

MIT License.