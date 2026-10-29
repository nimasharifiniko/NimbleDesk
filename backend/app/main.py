from fastapi import FastAPI
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from backend.app.api.chat import router as chat_router
from backend.app.api.auth import router as auth_router
from backend.app.api.business import router as business_router
from backend.app.api.business_info import router as business_info_router
from backend.app.api.upload import router as upload_router

limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])

app = FastAPI(
    title="NimbleDesk API Core",
    description="Multi-Tenant AI Smart Front-Desk Engine",
    version="0.4.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(chat_router)
app.include_router(auth_router)
app.include_router(business_router)
app.include_router(business_info_router)
app.include_router(upload_router)

@app.get("/")
async def root():
    return {"message": "NimbleDesk API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "nimbledesk-backend"}
