import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

if url and key:
    s = create_client(url, key)
    # Check devices table
    try:
        devices = s.table('devices').select('*').limit(5).execute()
        print('Devices:', devices.data)
        if devices.data:
            print('Columns in devices:', devices.data[0].keys())
    except Exception as e:
        print('Error fetching devices:', str(e))
    
    # Check roles
    try:
        roles = s.table('user_roles').select('*').execute()
        print('Roles:', roles.data)
    except Exception as e:
        print('Error fetching roles:', str(e))

else:
    print("No env vars")
