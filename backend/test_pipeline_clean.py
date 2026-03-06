
import sys
import io

# Redirect stdout and stderr
log = io.StringIO()
sys.stdout = sys.stderr = log

from app.db.supabase import supabase
from app.intelligence.pipeline import run_intelligence_pipeline

device_id = '07dc5c4c-9c08-4aee-86a7-0997f6c459ce'

try:
    print(f'Triggering pipeline for {device_id}')
    res = run_intelligence_pipeline(device_id, force=True)
    print(res)
except Exception as e:
    print('Failed')
    import traceback
    traceback.print_exc()

# Reset and write to file correctly
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__

with open('pipeline_out_clean.log', 'w', encoding='utf-8') as f2:
    f2.write(log.getvalue())
print('Done')
