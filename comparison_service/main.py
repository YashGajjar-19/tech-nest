from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from db import supabase
from comparator import generate_verdict
from ai_summary import generate_comparison_summary

app = FastAPI(title="Tech Nest Comparison Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_device(slug: str):
    if not supabase: return None
    res = supabase.table("devices").select("*, brands(name)").eq("slug", slug).single().execute()
    return res.data if res.data else None

def get_specs(device_id: int):
    if not supabase: return []
    res = supabase.table("device_specs").select("*, spec_definitions(display_label, category, unit, higher_is_better)").eq("device_id", device_id).execute()
    return res.data

@app.get("/compare")
async def compare_devices(a: str, b: str):
    device_a = get_device(a)
    device_b = get_device(b)

    if not device_a or not device_b:
        raise HTTPException(status_code=404, detail="Devices not found")

    specs_a = get_specs(device_a["id"])
    specs_b = get_specs(device_b["id"])

    # Normalization & Winner calculation map
    verdicts = generate_verdict(specs_a, specs_b)

    # AI Text Summary
    ai_summary = generate_comparison_summary(device_a["model_name"], device_b["model_name"], verdicts)

    return {
        "devices": [
            { "info": device_a, "specs": specs_a },
            { "info": device_b, "specs": specs_b }
        ],
        "verdicts": verdicts,
        "ai_summary": ai_summary,
        "winner_id": device_a["id"] if verdicts.get("battery") == "A" else device_b["id"] # Mock winner strategy
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
