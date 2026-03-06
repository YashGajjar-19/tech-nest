import asyncio
import json
from app.db.supabase import supabase

def run():
    res = supabase.table('devices').select('id, name, intelligence_status').execute()
    print("Total devices:", len(res.data))
    for d in res.data:
        print(f"{d['id']} - {d['name']} - {d['intelligence_status']}")

if __name__ == '__main__':
    run()
