from typing import Dict, Any, List
# Hypothetical db module import based on the architecture, using the supabase client
from app.database import supabase
from app.models.advisor import UserProfileBase

class PreferenceEngine:
    def __init__(self):
        self.supabase = supabase
        
    async def recalculate_user_preferences(self, user_id: str) -> Dict[str, Any]:
        """
        Deterministically recalculate user preferences based on past decisions and owned devices.
        This avoids using expensive LLM calls by extracting implicit signals from structured data.
        """
        
        # 1. Fetch user devices (current and previous) and decisions
        devices_resp = self.supabase.table('user_devices').select('device_id, ownership_status').eq('user_id', user_id).execute()
        decisions_resp = self.supabase.table('user_decisions').select('chosen_device_id').eq('user_id', user_id).execute()
        
        device_ids = set()
        for d in devices_resp.data:
            device_ids.add(d['device_id'])
        for d in decisions_resp.data:
            device_ids.add(d['chosen_device_id'])
            
        if not device_ids:
            # Baseline fallback
            return {"camera": 0.5, "battery": 0.5, "performance": 0.5, "brand_affinity": []}
            
        # 2. Fetch intelligence data for these devices (battery scores, camera scores, brand)
        # Assuming `device_intelligence` contains base scores, and `devices` has brand
        intel_resp = self.supabase.table('device_intelligence') \
            .select('score_hardware, score_experience, score_value, devices(brand)') \
            .in_('device_id', list(device_ids)) \
            .execute()
            
        if not intel_resp.data:
            return {"camera": 0.5, "battery": 0.5, "performance": 0.5, "brand_affinity": []}

        # 3. Aggregate implicitly deterministic scores
        total_hardware = 0
        total_value = 0
        brand_counts = {}
        
        for record in intel_resp.data:
            bh = float(record.get('score_hardware', 5))
            bv = float(record.get('score_value', 5))
            total_hardware += bh
            total_value += bv
            
            # Count Brands for affinity
            brand = record.get('devices', {}).get('brand')
            if brand:
                brand_counts[brand] = brand_counts.get(brand, 0) + 1
                
        num_devices = len(intel_resp.data)
        
        # Heuristics for priorities based on scores (normalized to 0.0 - 1.0)
        # E.g., if they consistently buy devices with high hardware scores, performance is high.
        avg_hardware = total_hardware / num_devices
        avg_value = total_value / num_devices
        
        performance_pref = min(1.0, max(0.0, avg_hardware / 10.0))
        # Hypothetical: battery priority correlates with high value / experience scores
        battery_pref = min(1.0, max(0.0, avg_value / 10.0))
        # Hypothetical: camera priority highly correlates with flagship tier, we assume 0.5 for now
        # until camera-specific sub-scores are added to intelligence.
        camera_pref = 0.5
        
        # Top Brands (Affinity)
        sorted_brands = sorted(brand_counts.items(), key=lambda item: item[1], reverse=True)
        top_brands = [b[0] for b in sorted_brands[:3]] # Keep top 3 brands
        
        # 4. Upsert User Profile
        prefs = {
            "user_id": user_id,
            "priority_camera": round(camera_pref, 2),
            "priority_battery": round(battery_pref, 2),
            "priority_performance": round(performance_pref, 2),
            "preferred_brands": top_brands
        }
        
        self.supabase.table('user_profiles').upsert(prefs).execute()
        
        return prefs
