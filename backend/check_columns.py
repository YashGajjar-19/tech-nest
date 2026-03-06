import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

if url and key:
    s = create_client(url, key)
    # Check table structure with rpc OR direct SQL if supabase supports it (it doesn't directly but we can use postgrest trick or specialized library)
    # Actually, let's just use regular POSTGREST and try to catch error messages for columns.
    
    columns_to_check = ['id', 'name', 'slug', 'brand_id', 'category_id', 'release_date', 'price', 'is_published', 'short_summary', 'image_url', 'updated_at']
    for col in columns_to_check:
        try:
            s.table('devices').select(col).limit(1).execute()
            print(f'Column {col} EXISTS')
        except Exception as e:
            if 'does not exist' in str(e):
                print(f'Column {col} DOES NOT EXIST')
            else:
                print(f'Error checking {col}: {e}')
else:
    print("No env vars")
