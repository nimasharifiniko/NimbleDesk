from fastapi import FastAPI
from backend.app.api.chat import router as chat_router

app = FastAPI(
    title="NimbleDesk API Core",
    description="Multi-Tenant AI Smart Front-Desk Engine",
    version="0.3.0"
)

app.include_router(chat_router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "NimbleDesk Core Engine"}
