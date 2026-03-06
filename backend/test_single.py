import sys
from app.db.supabase import supabase
device_id = "07dc5c4c-9c08-4aee-86a7-0997f66c459c"
print("ID in test:", device_id)
try:
    dev_resp = supabase.table("devices").select("id, name, price").eq("id", device_id).single().execute()
    print("Success:", dev_resp.data)
except Exception as e:
    print("Error on .single():", e)
