# ADR 001: Technical Stack and Initial System Architecture

- **Status:** Accepted
- **Date:** 2026-10-26
- **Author:** Nima Sharifi Niko

## Context
When building NimbleDesk, we needed a modern, scalable, and isolated architecture that allows local business customers to interact with an AI assistant quickly via QR codes without friction (no mandatory app installation).

## Decision
1. **Next.js PWA over Native App:** Chosen PWA (Progressive Web App) to ensure instant loading via QR code scans without forcing customers to download an app store application.
2. **PostgreSQL + pgvector over standalone Vector DB:** Combined relational and vector storage into a single PostgreSQL instance using `pgvector` to simplify multi-tenant data isolation and deployment complexity.
3. **FastAPI for Backend:** Provided high performance async execution, automatic OpenAPI generation, and seamless integration with Python AI/LLM libraries.
4. **Local LLM First (Ollama + Qwen 2.5):** Ensured data privacy and zero API costs during development, wrapped in a provider layer for easy cloud model fallback.

## Consequences
- Single database infrastructure simplifies Docker setup.
- PWA guarantees 100% web accessibility on mobile devices.
- Abstraction layer allows swapping LLM models seamlessly in the future.

