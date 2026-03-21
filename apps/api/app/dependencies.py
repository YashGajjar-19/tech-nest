from supabase import Client
from app.db.supabase import get_supabase

def get_db() -> Client:
    return get_supabase()