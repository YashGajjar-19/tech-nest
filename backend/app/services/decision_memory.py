from app.db.supabase import supabase
from typing import Optional

class DecisionMemoryService:
    def __init__(self):
        self.supabase = supabase
        
    async def log_decision(self, user_id: str, session_id: str, chosen_device_id: str, decision_type: str = 'general_search'):
        """
        Record a decision path from the core Decision AI API to the user's permanent memory.
        This provides the dataset for the Preference Engine later.
        """
        # Save decision event
        event_data = {
            "user_id": user_id,
            "decision_session_id": session_id,
            "chosen_device_id": chosen_device_id,
            "decision_type": decision_type
        }
        self.supabase.table('user_decisions').insert(event_data).execute()
        
        # Consider the device "considering" in ownership graph (but ideally only if requested to save, 
        # or we assume taking a decision implies high interest).
        ownership_data = {
            "user_id": user_id,
            "device_id": chosen_device_id,
            "ownership_status": "considering"
        }
        
        # Upsert ownership
        self.supabase.table('user_devices').upsert(
            ownership_data, on_conflict="user_id,device_id,ownership_status"
        ).execute()

        return True
