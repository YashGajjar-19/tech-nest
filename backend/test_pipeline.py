import sys
import os
from dotenv import load_dotenv

load_dotenv()

from app.db.supabase import supabase
from app.intelligence.pipeline import run_intelligence_pipeline

device_id = "07dc5c4c-9c08-4aee-86a7-0997f66c459ce"
try:
    print(f"Triggering pipeline for {device_id}")
    res = run_intelligence_pipeline(device_id, force=True)
    print(res)
except Exception as e:
    print("Failed")
    import traceback
    traceback.print_exc()
