from typing import List
from app.database import supabase
from app.services.upgrade_predictor import UpgradePredictor
from app.services.preference_engine import PreferenceEngine

class AdvisorEngine:
    def __init__(self):
        self.supabase = supabase
        self.predictor = UpgradePredictor()
        
    async def process_user_events(self, user_id: str):
        """
        Idempotent background job to gather insights for a user and inject into advisor_events.
        """
        # Fetch user profile and primary device
        profile_resp = self.supabase.table('user_profiles').select('*').eq('user_id', user_id).single().execute()
        if not profile_resp.data:
            return
            
        profile = profile_resp.data
        primary_device_id = profile.get('primary_device_id')
        
        events_to_create = []
        
        # 1. Upgrade Prediction
        if primary_device_id:
            prediction = await self.predictor.predict_upgrade_timing(user_id, primary_device_id)
            if prediction['upgrade_probability'] >= 0.70:
                events_to_create.append({
                    "user_id": user_id,
                    "event_type": "UPGRADE_ALERT",
                    "device_id": primary_device_id,
                    "message": f"Your current device is severely underperforming modern standards. We recommend exploring upgrades in the next {prediction['recommended_window']}.",
                    "priority": 10  # Highest Priority
                })
        
        # 2. Better Alternative / New Releases Based on Preferences
        # (This is a simplified approach, usually we query knowledge graph or similar devices)
        if profile.get('preferred_brands') and len(profile.get('preferred_brands')) > 0:
            top_brand = profile['preferred_brands'][0]
            # Fetch highest rated recent device from top brand
            new_device_resp = self.supabase.table('devices') \
                .select('id, name, base_price, device_intelligence(tech_nest_score)') \
                .eq('brand', top_brand) \
                .order('release_date', desc=True) \
                .limit(1) \
                .execute()
                
            if new_device_resp.data:
                newest = new_device_resp.data[0]
                # Avoid recommending their own device
                if newest['id'] != primary_device_id:
                    events_to_create.append({
                        "user_id": user_id,
                        "event_type": "NEW_RELEASE",
                        "device_id": newest['id'],
                        "message": f"New {top_brand} device released: {newest['name']}. It strongly aligns with your ecosystem preferences.",
                        "priority": 5
                    })

        # Insert Events idempotently
        # Because we have an ON CONFLICT (user_id, event_type, device_id) setup, 
        # duplicate insertions act as DO NOTHING or updates. Next step implements it via Supabase RPC or Python.
        
        successful_inserts = 0
        for event in events_to_create:
            # Check existing to prevent error logs, or use upsert
            existing = self.supabase.table('advisor_events') \
                .select('id') \
                .eq('user_id', event['user_id']) \
                .eq('event_type', event['event_type']) \
                .eq('device_id', event['device_id']) \
                .execute()
                
            if not existing.data:
                self.supabase.table('advisor_events').insert(event).execute()
                successful_inserts += 1
                
        return {"inserted": successful_inserts}

    async def get_feed(self, user_id: str) -> List[dict]:
        """
        Fetch the sorted feed for the client API.
        """
        response = self.supabase.table('advisor_events') \
            .select('*') \
            .eq('user_id', user_id) \
            .order('priority', desc=True) \
            .order('created_at', desc=True) \
            .limit(10) \
            .execute()
            
        return response.data
