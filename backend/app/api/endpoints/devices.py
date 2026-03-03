from __future__ import annotations

from typing import Any, List, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.db.supabase import supabase

router = APIRouter()

class DeviceSpec(BaseModel):
    spec_key: str
    spec_value: str

class Device(BaseModel):
    id: str
    name: str
    slug: str
    brand_id: Optional[str] = None
    category_id: Optional[str] = None
    image_url: Optional[str] = None
    is_published: bool
    specs: Optional[dict] = None

@router.get("", response_model=List[Device])
async def list_devices(
    category: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
) -> List[Device]:
    """
    List devices from the database.
    Used by the frontend to display trending devices and browsing lists.
    """
    query = supabase.table("devices").select("*").eq("is_published", True)
    
    if category:
        query = query.eq("category_id", category)
        
    resp = query.order("created_at", desc=True).limit(limit).execute()
    
    if not resp.data:
        return []
    
    devices = []
    for row in resp.data:
        device_id = row["id"]
        # Fetch specs for each device to populate the 'chip' (processor) field
        # In a real app, this would be a single join query or a more efficient batch fetch
        specs_resp = (
            supabase.table("device_specs")
            .select("spec_key, spec_value")
            .eq("device_id", device_id)
            .execute()
        )
        
        specs_map = {row["spec_key"]: row["spec_value"] for row in (specs_resp.data or [])}
        
        devices.append(Device(
            id=row["id"],
            name=row["name"],
            slug=row["slug"],
            brand_id=row.get("brand_id"),
            category_id=row.get("category_id"),
            image_url=row.get("image_url"),
            is_published=row.get("is_published", False),
            specs=specs_map
        ))
        
    return devices

@router.get("/{device_id}", response_model=Device)
async def get_device(device_id: str) -> Device:
    """
    Get a single device by its ID.
    """
    resp = supabase.table("devices").select("*").eq("id", device_id).maybe_single().execute()
    
    if resp is None or not resp.data:
        raise HTTPException(status_code=404, detail="Device not found")
        
    specs_resp = (
        supabase.table("device_specs")
        .select("spec_key, spec_value")
        .eq("device_id", device_id)
        .execute()
    )
    
    specs_map = {row["spec_key"]: row["spec_value"] for row in (specs_resp.data or [])}
    
    return Device(
        id=resp.data["id"],
        name=resp.data["name"],
        slug=resp.data["slug"],
        brand_id=resp.data.get("brand_id"),
        category_id=resp.data.get("category_id"),
        image_url=resp.data.get("image_url"),
        is_published=resp.data.get("is_published", False),
        specs=specs_map
    )

@router.get("/{device_id}/decision")
async def get_device_decision(device_id: str) -> dict:
    """
    Get the decision intelligence score for a device.
    Used by TrendingDevices and other UI components to show the Tech Nest Score.
    """
    resp = (
        supabase.table("device_scores")
        .select("overall_score, performance_score, camera_score, battery_score")
        .eq("device_id", device_id)
        .maybe_single()
        .execute()
    )
    
    if resp is None or not resp.data:
        # Return default scores if not computed yet
        return {
            "device_id": device_id,
            "tech_nest_score": 5.0,
            "overall_score": 5.0,
            "performance_score": 5.0,
            "camera_score": 5.0,
            "battery_score": 5.0
        }
    
    data = resp.data
    # Map 'overall_score' to 'tech_nest_score' for frontend compatibility
    data["tech_nest_score"] = float(data.get("overall_score", 5.0))
    data["device_id"] = device_id
    
    return data

