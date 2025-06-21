from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, hospitals, revenue, expenses, analytics, revenue_analytics
from app.core.config import settings

app = FastAPI(
    title="Medicost.ai API",
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
app.include_router(hospitals.router, prefix="/api/hospitals", tags=["hospitals"])
app.include_router(revenue.router, prefix="/api/revenue", tags=["revenue"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["expenses"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(revenue_analytics.router, prefix="/api/revenue-analytics", tags=["revenue-analytics"])

@app.get("/")
async def root():
    return {"message": "Medicost.ai API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}