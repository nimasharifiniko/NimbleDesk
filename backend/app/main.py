from fastapi import FastAPI

app = FastAPI(
    title="NimbleDesk API",
    description="Backend service for NimbleDesk platform",
    version="0.1.0"
)

@app.get("/")
def read_root():
    return {"message": "NimbleDesk API is running"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "nimbledesk-backend"
    }

