from __future__ import annotations

from typing import Any, List, Optional
from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel
from uuid import UUID

from app.database import supabase

router = APIRouter()

class DeviceSpec(BaseModel):
    spec_key: str
    spec_value: str

class Device(BaseModel):
    id: str
    name: str
    slug: str
    brand_id: Optional[str] = None
    brand: Optional[str] = None
    category_id: Optional[str] = None
    image_url: Optional[str] = None
    is_published: bool
    specs: Optional[dict] = None

@router.get("", response_model=List[Device])
def list_devices(
    category: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
) -> List[Device]:
    """
    List devices from the database.
    Used by the frontend to display trending devices and browsing lists.
    """
    # Use join to fetch brand name
    query = supabase.table("devices").select("*, brands(name)").eq("is_published", True)
    
    if category:
        query = query.eq("category_id", category)
        
    resp = query.order("created_at", desc=True).limit(limit).execute()
    
    if not resp.data:
        return []
    
    device_ids = [row["id"] for row in resp.data]
    
    devices = []
    
    # Bulk fetch specs
    all_specs = []
    try:
        specs_resp_data = (
            supabase.table("device_specs")
            .select("device_id, spec_key, spec_value")
            .in_("device_id", device_ids)
            .execute()
        )
        all_specs = specs_resp_data.data or []
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.warning(f"Failed to fetch specs for devices: {e}")
        
    # Group specs by device_id
    specs_by_device = {}
    for spec in all_specs:
        did = spec["device_id"]
        if did not in specs_by_device:
            specs_by_device[did] = {}
        if spec.get("spec_key") and spec.get("spec_value") is not None:
            specs_by_device[did][spec["spec_key"]] = str(spec["spec_value"])

    for row in resp.data:
        device_id = row["id"]
        specs_map = specs_by_device.get(device_id, {})
        
        # Extracted brand name from join result
        brand_name = None
        if "brands" in row and row["brands"]:
            brand_name = row["brands"].get("name")

        devices.append(Device(
            id=row["id"],
            name=row["name"],
            slug=row["slug"],
            brand_id=row.get("brand_id"),
            brand=brand_name,
            category_id=row.get("category_id"),
            image_url=row.get("image_url"),
            is_published=row.get("is_published", False),
            specs=specs_map
        ))
        
    return devices

@router.get("/{device_id}", response_model=Device)
def get_device(identifier: str) -> Device:
    """
    Get a single device by its ID or slug.
    """
    try:
        UUID(identifier, version=4)
        is_uuid = True
    except ValueError:
        is_uuid = False
        
    query = supabase.table("devices").select("*, brands(name)")
    if is_uuid:
        query = query.eq("id", identifier)
    else:
        query = query.eq("slug", identifier)
        
    resp = query.maybe_single().execute()
    
    if resp is None or not resp.data:
        raise HTTPException(status_code=404, detail="Device not found")
        
    specs_resp = []
    try:
        specs_resp_data = (
            supabase.table("device_specs")
            .select("spec_key, spec_value")
            .eq("device_id", resp.data["id"])
            .execute()
        )
        specs_resp = specs_resp_data.data or []
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.warning(f"Failed to fetch specs for {identifier}: {e}")
    
    specs_map = {item["spec_key"]: item["spec_value"] for item in specs_resp}
    
    brand_name = None
    if "brands" in resp.data and resp.data["brands"]:
        brand_name = resp.data["brands"].get("name")

    return Device(
        id=resp.data["id"],
        name=resp.data["name"],
        slug=resp.data["slug"],
        brand_id=resp.data.get("brand_id"),
        brand=brand_name,
        category_id=resp.data.get("category_id"),
        image_url=resp.data.get("image_url"),
        is_published=resp.data.get("is_published", False),
        specs=specs_map
    )

@router.get("/{identifier}/decision")
def get_device_decision(identifier: str) -> dict:
    """
    Get the decision intelligence score for a device.
    Used by TrendingDevices and other UI components to show the Tech Nest Score.
    """
    try:
        UUID(identifier, version=4)
        is_uuid = True
    except ValueError:
        is_uuid = False
        
    if is_uuid:
        device_id = identifier
    else:
        dev_resp = supabase.table("devices").select("id").eq("slug", identifier).maybe_single().execute()
        device_id = dev_resp.data["id"] if dev_resp and dev_resp.data else None
        
    if not device_id:
        return {
            "device_id": identifier,
            "tech_nest_score": 5.0,
            "overall_score": 5.0,
            "performance_score": 5.0,
            "camera_score": 5.0,
            "battery_score": 5.0
        }

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

