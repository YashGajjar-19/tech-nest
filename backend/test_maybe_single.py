from app.db.supabase import supabase
import sys

# Case 1: Just execute
print("Case 1: table.select.eq.execute")
res1 = supabase.table("device_scores").select("*").eq("device_id", "07dc5c4c-9c08-4aee-86a7-0997f6c459ce").execute()
print(f"Res1: {res1}")
if res1 is None:
    print("Res1 is NONE!")
else:
    print(f"Res1 data: {res1.data}")

# Case 2: maybe_single
print("\nCase 2: table.select.eq.maybe_single.execute")
res2 = supabase.table("device_scores").select("*").eq("device_id", "07dc5c4c-9c08-4aee-86a7-0997f6c459ce").maybe_single().execute()
print(f"Res2: {res2}")
if res2 is None:
    print("Res2 is NONE!")
else:
    print(f"Res2 data: {res2.data}")
