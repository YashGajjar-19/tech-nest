
from supabase import create_client, Client
from app.core.config import settings

# Initialize Supabase service role client for backend operations
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
