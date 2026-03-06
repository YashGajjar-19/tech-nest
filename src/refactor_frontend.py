import os
import shutil
import re
from pathlib import Path

SRC_DIR = Path("c:/Users/user/Documents/tech-nest/src")

# Ensure feature dirs exist
for feat in ["devices", "comparisons", "decision-ai", "trending"]:
    (SRC_DIR / "features" / feat).mkdir(parents=True, exist_ok=True)

# Move components
decision_card = SRC_DIR / "components" / "ui" / "DecisionCard.tsx"
device_card_target = SRC_DIR / "features" / "devices" / "device-card.tsx"
if decision_card.exists():
    shutil.move(str(decision_card), str(device_card_target))

# Update imports in TSX/TS files
def replace_in_tsx(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception: return
    
    new_content = content
    # Replace DecisionCard import
    new_content = re.sub(
        r'from ["\']@/components/ui/DecisionCard["\']',
        'from "@/features/devices/device-card"',
        new_content
    )
    # the exported component name is still `DecisionCard`, so just update path.
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

for root, _, files in os.walk(str(SRC_DIR)):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts"):
            replace_in_tsx(os.path.join(root, file))

# Create placeholder feature files as requested by user to complete the architecture
def touch_file(path, content=""):
    if not path.exists():
        path.write_text(content, encoding="utf-8")

# features/devices
touch_file(SRC_DIR / "features" / "devices" / "device-grid.tsx", "// Device Grid Component\nexport function DeviceGrid() { return <div />; }\n")
touch_file(SRC_DIR / "features" / "devices" / "device-service.ts", "// Device Service\nexport const fetchDevices = async () => [];\n")
touch_file(SRC_DIR / "features" / "devices" / "device-types.ts", "// Device Types\nexport interface Device { id: string; name: string; }\n")

# features/comparisons
touch_file(SRC_DIR / "features" / "comparisons" / "comparison-table.tsx", "// Comparison Table Component\nexport function ComparisonTable() { return <div />; }\n")
touch_file(SRC_DIR / "features" / "comparisons" / "comparison-service.ts", "// Comparison Service\nexport const fetchComparison = async () => null;\n")

# features/decision-ai
touch_file(SRC_DIR / "features" / "decision-ai" / "decision-form.tsx", "// Decision Form Component\nexport function DecisionForm() { return <div />; }\n")
touch_file(SRC_DIR / "features" / "decision-ai" / "decision-service.ts", "// Decision Service\nexport const submitDecision = async () => null;\n")

# features/trending
touch_file(SRC_DIR / "features" / "trending" / "trending-devices.tsx", "// Trending Devices Component\nexport function TrendingList() { return <div />; }\n")

# Check where score color and format price are
if not (SRC_DIR / "utils" / "format-price.ts").exists():
    touch_file(SRC_DIR / "utils" / "format-price.ts", "export const formatPrice = (p: number) => `$${p}`;\n")

if not (SRC_DIR / "utils" / "score-color.ts").exists():
    touch_file(SRC_DIR / "utils" / "score-color.ts", "export const getScoreColor = (s: number) => s > 90 ? 'text-green-500' : 'text-neutral-500';\n")

if not (SRC_DIR / "utils" / "slugify.ts").exists():
    touch_file(SRC_DIR / "utils" / "slugify.ts", "export const slugify = (t: string) => t.toLowerCase().replace(/\\s+/g, '-');\n")

print("Frontend restructured and files updated.")
