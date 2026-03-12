import logging
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from app.database import supabase

router = APIRouter()
logger = logging.getLogger(__name__)

class DecisionRequest(BaseModel):
    priority: str
    budget: int
    ecosystem: str
    session_id: Optional[str] = None

class DeviceVerdict(BaseModel):
    id: str  
    name: str
    brand: str
    score: int
    price: str
    highlights: List[str]

@router.post("/decide", response_model=List[DeviceVerdict])
def decide(payload: DecisionRequest):
    """
    Real decision engine: filters by price/ecosystem,
    weights the category scores by user priority,
    and returns top 3 matching devices.
    """
    logger.info(f"Decision request: {payload}")
    
    # 1. Fetch published devices with their scores, brand names and insights.
    query = (
        supabase.table("devices")
        .select("id, name, slug, price, brand_id, brands(name), "
                "device_scores(overall_score, camera_score, battery_score, performance_score), "
                "device_ai_insights(pros)")
        .eq("is_published", True)
    )
    
    # Filter by budget
    if payload.budget > 0:
        query = query.lte("price", payload.budget)
        
    resp = query.execute()
    devices_data = resp.data or []
    
    # 2. Filter by ecosystem
    filtered = []
    for d in devices_data:
        brand = d.get("brands", {}).get("name", "") if d.get("brands") else ""
        ecosystem = payload.ecosystem.lower()
        if ecosystem == "ios" and brand.lower() != "apple":
            continue
        if ecosystem == "android" and brand.lower() == "apple":
            continue
        filtered.append(d)
        
    # 3. Calculate weighted score
    results = []
    for d in filtered:
        # device_scores might be a dict or list depending on the join
        scores = d.get("device_scores") or {}
        if isinstance(scores, list) and scores:
            scores = scores[0]

        overall = float(scores.get("overall_score", 5.0) or 5.0)
        camera = float(scores.get("camera_score", 5.0) or 5.0)
        battery = float(scores.get("battery_score", 5.0) or 5.0)
        performance = float(scores.get("performance_score", 5.0) or 5.0)
        
        priority_str = payload.priority.lower()
        if "camera" in priority_str or "photography" in priority_str:
            weighted_score = (camera * 2.0 + overall) / 3.0
        elif "battery" in priority_str:
            weighted_score = (battery * 2.0 + overall) / 3.0
        elif "performance" in priority_str or "gaming" in priority_str:
            weighted_score = (performance * 2.0 + overall) / 3.0
        else:
            weighted_score = overall
            
        d["weighted_score"] = weighted_score
        results.append(d)
        
    # 4. Sort and return top 3
    results.sort(key=lambda x: x["weighted_score"], reverse=True)
    top_3 = results[:3]
    
    verdicts = []
    for d in top_3:
        brand = d.get("brands", {}).get("name", "") if d.get("brands") else ""
        price_val = d.get("price")
        price_str = f"${int(price_val)}" if price_val is not None else "N/A"
        
        highlights = ["Great overall value", "Solid performance"]
        insights = d.get("device_ai_insights")
        if isinstance(insights, list) and insights:
            insights = insights[0]
            
        if insights and isinstance(insights, dict) and insights.get("pros"):
            pros = insights.get("pros", [])
            if pros and isinstance(pros, list) and len(pros) > 0:
                highlights = pros[:3]
                
        verdicts.append(DeviceVerdict(
            id=d.get("slug", d.get("id")), 
            name=d.get("name", "Unknown"),
            brand=brand,
            score=int(d["weighted_score"] * 10), 
            price=price_str,
            highlights=highlights
        ))
        
    return verdicts
