from app.db.supabase import supabase
import sys

device_id = "07dc5c4c-9c08-4aee-86a7-0997f6c459ce"

print("--- Testing list_devices style (execute directly) ---")
try:
    resp = supabase.table("devices").select("*").eq("id", device_id).execute()
    print(f"Success: {resp}")
    if resp:
        print(f"Data: {resp.data}")
except Exception as e:
    print(f"Failed: {e}")

print("\n--- Testing maybe_single style ---")
try:
    resp = supabase.table("devices").select("*").eq("id", device_id).maybe_single().execute()
    print(f"Success: {resp}")
    if resp:
        print(f"Data: {resp.data}")
except Exception as e:
    print(f"Failed: {e}")
