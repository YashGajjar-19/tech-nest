import os
import shutil
import re
from pathlib import Path

BASE_DIR = Path("c:/Users/user/Documents/tech-nest")
BACKEND_DIR = BASE_DIR / "backend" / "app"
SUPABASE_MIGRATIONS = BASE_DIR / "supabase" / "migrations"

# 1. Create structure
for d in ["routers", "services", "models", "schemas", "workers", "utils"]:
    (BACKEND_DIR / d).mkdir(parents=True, exist_ok=True)
SUPABASE_MIGRATIONS.mkdir(parents=True, exist_ok=True)

# Function to move carefully
def safe_move(src, dest):
    if src.exists():
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(src), str(dest))

# 2. config.py & database.py
safe_move(BACKEND_DIR / "core" / "config.py", BACKEND_DIR / "config.py")
safe_move(BACKEND_DIR / "db" / "supabase.py", BACKEND_DIR / "database.py")

# 3. Handle routers
api_dir = BACKEND_DIR / "api"
if api_dir.exists():
    for f in (api_dir / "endpoints").glob("*.py"):
        if f.name != "__init__.py":
            safe_move(f, BACKEND_DIR / "routers" / f.name)
    for f in (api_dir / "platform").glob("*.py"):
        if f.name != "__init__.py":
            safe_move(f, BACKEND_DIR / "routers" / f"platform_{f.name}")
            
    safe_move(api_dir / "deps.py", BACKEND_DIR / "routers" / "deps.py")
    safe_move(api_dir / "platform_deps.py", BACKEND_DIR / "routers" / "platform_deps.py")

# 4. Handle intelligence & logic (Services, Utils, Workers, Models)
int_dir = BACKEND_DIR / "intelligence"
if int_dir.exists():
    for f in int_dir.glob("*.py"):
        if f.name == "__init__.py":
            continue
        elif f.name == "worker.py":
            safe_move(f, BACKEND_DIR / "workers" / "intelligence_worker.py")
        elif f.name == "normalizer.py":
            safe_move(f, BACKEND_DIR / "utils" / "normalization.py")
        elif f.name == "models.py":
            safe_move(f, BACKEND_DIR / "models" / "decision.py")
        elif f.name == "schemas.py":
            safe_move(f, BACKEND_DIR / "schemas" / "decision_schema.py")
        else:
            safe_move(f, BACKEND_DIR / "services" / f.name)

# 5. Handle SQL files properly
db_dir = BACKEND_DIR / "db"
if db_dir.exists():
    for f in db_dir.glob("**/*.sql"):
        # Move directly to the supabase/migrations folder
        shutil.move(str(f), str(SUPABASE_MIGRATIONS / f.name))

# 6. Cleanup old directories
for d in ["core", "api", "intelligence", "db"]:
    p = BACKEND_DIR / d
    if p.exists():
        shutil.rmtree(str(p), ignore_errors=True)

# 7. Mass Replace Imports
IMPORT_MAP = {
    # order is vital for substring overlap
    r"from app\.core\.config": "from app.config",
    r"import app\.core\.config": "import app.config",
    r"from app\.db\.supabase": "from app.database",
    r"import app\.db\.supabase": "import app.database",
    r"from app\.api\.deps": "from app.routers.deps",
    r"import app\.api\.deps": "import app.routers.deps",
    r"from app\.api\.platform_deps": "from app.routers.platform_deps",
    r"from app\.api\.endpoints\.([a-zA-Z0-9_]+)": r"from app.routers.\1",
    r"from app\.api\.platform\.([a-zA-Z0-9_]+)": r"from app.routers.platform_\1",
    r"from app\.intelligence\.worker": "from app.workers.intelligence_worker",
    r"from app\.intelligence\.normalizer": "from app.utils.normalization",
    r"from app\.intelligence\.models": "from app.models.decision",
    r"from app\.intelligence\.schemas": "from app.schemas.decision_schema",
    r"from app\.intelligence\.([a-zA-Z0-9_]+)": r"from app.services.\1",
    
    # Check general app.api cases
    r"from app\.api ": "from app.routers ",
}

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception: return
    
    new_content = content
    for old, new in IMPORT_MAP.items():
        new_content = re.sub(old, new, new_content)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

main_py_path = BACKEND_DIR / "main.py"
if main_py_path.exists():
    replace_in_file(main_py_path)

for root, _, files in os.walk(str(BACKEND_DIR)):
    for file in files:
        if file.endswith(".py"):
            replace_in_file(os.path.join(root, file))

print("Backend restructured and imports mapped.")
