# NimbleDesk 🚀

> An AI-powered smart front-desk and customer engagement platform designed for local businesses and service providers.

---

## 📌 Overview

**NimbleDesk** helps businesses (restaurants, salons, agencies, etc.) digitize their front-desk customer service. By scanning a QR code, customers can view real-time business profiles and interact with an AI-powered assistant tailored specifically to that business's menu, services, operating hours, and policies.

### Key Highlights
- **No App Installation Required:** Fully responsive PWA-enabled interface accessible instantly via QR code.
- **Accurate & Safe AI:** Uses structured database lookups alongside vector search to prevent hallucinations (e.g., prices and operating hours are fetched strictly from DB).
- **Multi-Tenant Architecture:** Strict data isolation between different business accounts.
- **Bilingual Support:** Built-in internationalization (English & Persian) with full RTL layout support.

---

## 🛠️ Tech Stack (Target Architecture)

- **Backend:** Python, FastAPI, Pydantic, Alembic
- **Database:** PostgreSQL + pgvector
- **AI & Retrieval:** Ollama (Qwen 2.5), FastEmbed / HuggingFace Embeddings
- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **DevOps & Testing:** Docker Compose, GitHub Actions (CI), pytest, Playwright

---

## 🚀 Project Status

This project is currently under active development.

- [x] Initial Repository Architecture Setup
- [ ] Database Schema & Multi-Tenant Isolation
- [ ] RAG Pipeline & LLM Tool Integration
- [ ] Public API & Business Management Dashboard
- [ ] Customer PWA Interface

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  <b>Powered by NimDesk</b> · Built with ❤️ by <a href="https://github.com/nima-sharifi-niko">Nima Sharifi Niko</a>
</p>