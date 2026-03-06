import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

if url and key:
    s = create_client(url, key)
    try:
        buckets = s.storage.list_buckets()
        print('Buckets:', buckets)
    except Exception as e:
        print('Error listing buckets:', str(e))
else:
    print("No env vars")
