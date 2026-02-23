import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

def get_or_create(table, column, value, extra_data=None):
    url = f"{os.getenv('SUPABASE_URL')}/rest/v1/{table}"
    headers = {
        "apikey": os.getenv("SUPABASE_KEY"),
        "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    # 1. Look for existing
    res = requests.get(f"{url}?{column}=eq.{value}", headers=headers)
    data = res.json()
    
    if data:
        return data[0]['id']
    
    # 2. Create if not found
    payload = {column: value}
    if extra_data: payload.update(extra_data)
    
    res = requests.post(url, headers=headers, json=payload)
    return res.json()[0]['id']

def save_to_supabase(image_url):
    with open("metadata.json", "r") as f:
        meta = json.load(f)

    print(f"Syncing {meta['brand']} {meta['model']} with complex schema...")

    # Get Foreign Keys
    brand_id = get_or_create("brands", "name", meta['brand'], {"slug": meta['brand'].lower()})
    cat_id = get_or_create("device_categories", "name", "Smartphones")

    # Insert Device
    device_payload = {
        "brand_id": brand_id,
        "category_id": cat_id,
        "model_name": meta['model'],
        "slug": meta['model'].lower().replace(" ", "-"),
        "image_url": image_url,
        "tech_nest_score": 85 # Placeholder
    }

    endpoint = f"{os.getenv('SUPABASE_URL')}/rest/v1/devices"
    headers = {
        "apikey": os.getenv("SUPABASE_KEY"),
        "Authorization": f"Bearer {os.getenv('SUPABASE_KEY')}",
        "Content-Type": "application/json"
    }
    
    requests.post(endpoint, headers=headers, json=device_payload)
    print("Done: Device saved to your master database!")

def upload_to_cloudinary():
    import cloudinary
    import cloudinary.uploader
    
    print("Uploading to Cloudinary...")
    cloudinary.config(
        cloud_name=os.getenv("CLOUD_NAME"),
        api_key=os.getenv("API_KEY"),
        api_secret=os.getenv("API_SECRET")
    )
    
    try:
        response = cloudinary.uploader.upload(
            "images/device_final.webp",
            folder="tech-nest/devices"
        )
        return response["secure_url"]
    except Exception as e:
        print(f"Cloudinary Error: {e}")
        return None

if __name__ == "__main__":
    secure_url = upload_to_cloudinary()
    if secure_url:
        save_to_supabase(secure_url)
