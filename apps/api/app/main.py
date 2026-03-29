from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.supabase import get_supabase

app = FastAPI(
    title="Tech Nest API",
    version="1.0.0",
    description="Backend API for Tech Nest platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
allow_headers=["*"],
)

from app.routers import suggestions
app.include_router(suggestions.router)

@app.on_event("startup")
async def startup():
    # Test Supabase connection on startup
    try:
        db = get_supabase()
        db.table("phones").select("id").limit(1).execute()
        print("✅ Supabase connected successfully")
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")

@app.get("/")
def root():
    return {"status": "ok", "message": "Tech Nest API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}