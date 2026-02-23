from db import supabase
from intent_parser import parse_query

async def search_devices(query: str):
    intent = parse_query(query)

    if not supabase:
        # If DB not hooked up yet, return empty list safely
        return []

    # Level 1: MVP Keyword Search
    if intent["type"] == "keyword":
        response = supabase.table("devices") \
            .select("model_name, slug, image_url") \
            .ilike("model_name", f"%{query}%") \
            .limit(10).execute()
            
        # Transform results for UI
        return [{"type": "device", "title": row["model_name"], "slug": row["slug"], "image_url": row["image_url"]} for row in response.data]

    # Level 2 & 3 Placeholders (Intelligent & Semantic Search)
    response = supabase.table("devices") \
        .select("model_name, slug, image_url") \
        .ilike("model_name", f"%{query}%") \
        .limit(10).execute()
        
    return [{"type": "device", "title": row["model_name"], "slug": row["slug"], "image_url": row["image_url"]} for row in response.data]
