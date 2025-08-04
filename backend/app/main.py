from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, new_tables
from app.core.config import settings

app = FastAPI(
    title="Profitify.ai API",
    description="AI-powered hospital financial management system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(new_tables.router, prefix="/api/new-tables", tags=["new-tables"])

@app.get("/")
async def root():
    return {"message": "Profitify.ai API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}