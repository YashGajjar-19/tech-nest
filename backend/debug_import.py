import traceback
import sys
import os

print(f"DEBUG: sys.path is {sys.path}")
print(f"DEBUG: CWD is {os.getcwd()}")

try:
    print("DEBUG: Importing app.api.deps")
    import app.api.deps
    print("DEBUG: app.api.deps imported")
    
    print("DEBUG: Importing app.api.endpoints.intelligence")
    import app.api.endpoints.intelligence
    print("DEBUG: app.api.endpoints.intelligence imported")
    
    # Finally, try app.main
    import app.main
    print("Success")
except Exception:
    traceback.print_exc()
