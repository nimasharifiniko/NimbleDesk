# ⚡ NimbleDesk - AI-Powered Smart Front-Desk & Customer Engagement Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-nimble--desk.vercel.app-10b981?style=for-the-badge&logo=vercel)](https://nimble-desk.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-emerald?style=for-the-badge&logo=pwa)](https://nimble-desk.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **Designed & Developed by Nima Sharifi Niko**  
> *A full-featured, production-ready AI SaaS platform engineered for local businesses (cafes, clinics, auto repairs, and service providers).*

---

## 🌟 Executive Overview

**NimbleDesk** is a next-generation 24/7 AI-powered front-desk engagement platform. It empowers local SMBs to deploy an instant, multi-lingual AI assistant capable of answering business inquiries, handling service pricing, providing operational hours, and guiding customer bookings without human intervention.

---

## 🔥 Key Technical Highlights

### 🧠 1. Stateless Multi-Tenant RAG via QR URL Encoding
* **Zero-Database Multi-Tenancy for Cross-Device AI Context**: Business profiles and custom service catalogs configured during onboarding are compressed and encoded into UTF-8 Base64 parameters directly within QR Code deep-links (`/c/[slug]?biz=...`).
* **Cross-Device Context Persistence**: Any customer scanning the QR code with their mobile device instantly inherits the complete, accurate business persona and menu pricing for the AI model without server-side database lookups or latency.

### 🤖 2. Dynamic Real-Time Multi-Model LLM Engine
* **OpenRouter API Integration**: Connected to state-of-the-art open-source and proprietary models (`Gemini 2.0 Flash`, `Llama 3.3 70B`, `Qwen 2.5`, `DeepSeek R1`) with automated failover routing.
* **Hybrid Knowledge Context**: Capable of answering specific business query contexts (e.g., custom service pricing, manager details, operating hours) while smoothly handling open-ended general domain questions (e.g., coffee science, technical advice, general FAQs).

### 🌍 3. Native Trilingual Support & Pixel-Perfect RTL System
* **Bilingual & Trilingual Fluidity**: Native support for **Persian (`fa`)**, **English (`en`)**, and **Dutch (`nl`)**.
* **Robust Bidi & RTL Handling**: Built-in Bidirectional text isolation for numerical strings (e.g., `24/7`, phone numbers) preventing layout breakage in Persian RTL layouts.
* **Dynamic Currency System**: Automatic currency symbol context switching (`$` for English / `تومان` for Persian).

### 📱 4. Progressive Web App (PWA) & Glassmorphism UI
* **Installable SaaS Platform**: Fully configured `manifest.json` with high-resolution maskable glassmorphic green icons (`192x192`, `512x512`, `apple-touch-icon`).
* **Mobile-Responsive Drawer Sidebar**: Custom responsive drawer menu with mobile backdrop blur, touch overlays, and dynamic viewport handling (`100dvh` layout preventing mobile address bar cutoffs).

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology / Tools |
| :--- | :--- |
| **Frontend Framework** | **Next.js 16.4** (App Router, Turbopack, Partial Prerender, Cache Components) |
| **Language & Styling** | **TypeScript**, **Tailwind CSS**, Glassmorphism Design Token System, Vazirmatn Typography |
| **AI & LLM Integration** | **OpenRouter API** (`Gemini Flash`, `Llama 3.3`, `Qwen 2.5`, `DeepSeek R1`) |
| **State & Context** | React Context API (`ThemeContext`, `DashboardLangContext`), LocalStorage Persistence |
| **PWA & Media** | Web App Manifest, Service Workers, Dynamic QR Code Server API |
| **Deployment** | **Vercel** (Global Edge Network, Automated Continuous Deployment) |
| **Backend Architecture** *(Repo Ingestion)* | **FastAPI (Python 3.11)**, **PostgreSQL 16** with **pgvector**, **Pydantic v2**, **Pytest** (51 E2E tests) |

---

## 🚀 Live Demo Journey

Experience the platform live at **[nimble-desk.vercel.app](https://nimble-desk.vercel.app)**:

1. **Landing Page (`/`)**: Dark/Light mode toggle, bilingual presentation, interactive demo triggers.
2. **Onboarding Wizard (`/onboarding`)**:
   - **Step 1**: Select trade sector (Spa, Cafe, Auto Repair, Clinic).
   - **Step 2**: Custom business name, manager, phone, address, and URL slug.
   - **Step 3**: Service pricing manager (toggle, edit, add custom services like *Tire Repair*).
3. **Dashboard (`/dashboard`)**: Analytics metrics, live scannable QR Code generator, PDF document upload widget, business hours manager.
4. **AI Customer Chat (`/c/sample-cafe`)**: Interactive customer chat widget with live AI responses.

---

## 💻 Local Development Setup

```bash
# Clone the repository
git clone https://github.com/nimasharifiniko/NimbleDesk.git
cd NimbleDesk/frontend

# Install dependencies
npm install

# Configure environment variables
echo "OPENROUTER_API_KEY=your_openrouter_api_key" > .env.local

# Run the development server
npm run dev
Open http://localhost:3000 in your browser.

📬 Contact & Author
Designed and engineered with precision by Nima Sharifi Niko.

🌐 Live SaaS Demo: https://nimble-desk.vercel.app
💼 LinkedIn:https://www.linkedin.com/in/nima-sharifiniko/
🐙 GitHub: https://github.com/nimasharifiniko
📧 Email: nimasharify.pc1@gmail.com
📜 License
Distributed under the MIT License. See LICENSE for more information.

