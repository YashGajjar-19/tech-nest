import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('.env.local')
url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
if url and key:
    s = create_client(url, key)
    roles = s.table('user_roles').select('*').execute()
    print('Roles:', roles.data)
    users = s.auth.admin.list_users()
    for u in users:
        print('User:', [(uu.email, uu.id) for uu in u[1]])
else:
    print("No env vars")
