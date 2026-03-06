import requests
import os
from dotenv import load_dotenv

load_dotenv()
url = 'http://localhost:8000/generate/07dc5c4c-9c08-4aee-86a7-0997f66c459c'
# wait! the frontend calls /api/v1/intelligence/generate/07dc5c4c-9c08-4aee-86a7-0997f66c459c
url = 'http://localhost:8000/api/v1/intelligence/generate/07dc5c4c-9c08-4aee-86a7-0997f66c459ce'

key = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
print(f"Key preview: {str(key)[:5] if key else 'None'}")
headers = {}
if key:
    headers['Authorization'] = f'Bearer {key}'

res = requests.post(url, headers=headers)
print("Status:", res.status_code)
print("Response:", res.text)
