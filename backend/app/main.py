from fastapi import FastAPI
from backend.app.api.chat import router as chat_router
from backend.app.api.auth import router as auth_router

app = FastAPI(
    title="NimbleDesk API Core",
    description="Multi-Tenant AI Smart Front-Desk Engine",
    version="0.4.0"
)

app.include_router(chat_router)
app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "NimbleDesk API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "nimbledesk-backend"}
