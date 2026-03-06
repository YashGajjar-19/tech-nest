import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

if url and key:
    s = create_client(url, key)
    
    # Create device-images bucket
    try:
        # Check if it exists first
        buckets = s.storage.list_buckets()
        if not any(b.id == 'device-images' for b in buckets):
            print('Creating device-images bucket...')
            res = s.storage.create_bucket('device-images', options={'public': True})
            print('Created:', res)
        else:
            print('Bucket device-images already exists.')
            # Ensure it is public
            s.storage.update_bucket('device-images', options={'public': True})
            print('Updated device-images to public.')
            
    except Exception as e:
        print('Error managing bucket:', str(e))
else:
    print("No env vars")
