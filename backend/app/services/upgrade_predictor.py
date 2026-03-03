from datetime import datetime, timezone

from app.db.supabase import supabase
from typing import Dict, Any, Optional

class UpgradePredictor:
    def __init__(self):
        self.supabase = supabase
        
    async def predict_upgrade_timing(self, user_id: str, device_id: str) -> Dict[str, Any]:
        """
        Calculates the probability a user is ready to upgrade their primary device, based on:
        1. Device Age (Lifespan curve)
        2. Performance Gap vs Current Market Average
        3. Battery Degradation Estimation
        Returns deterministic probability.
        """
        device_resp = self.supabase.table('devices').select('release_date, base_price').eq('id', device_id).single().execute()
        if not device_resp.data:
            return {"upgrade_probability": 0.0, "recommended_window": "Unknown"}
            
        device = device_resp.data
        release_date = datetime.strptime(device['release_date'], '%Y-%m-%d').replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        
        # 1. Device Age (Months)
        age_months = (now.year - release_date.year) * 12 + now.month - release_date.month
        
        # Base probability curve for smartphones (typically 24-36 months)
        if age_months < 12:
            base_prob = 0.05
        elif age_months < 24:
            # Starts rising significantly year 2 (Linear from 5% up to 40%)
            base_prob = 0.05 + 0.35 * ((age_months - 12) / 12)
        elif age_months < 36:
            # Year 3 is peak upgrade window (40% to 80%)
            base_prob = 0.40 + 0.40 * ((age_months - 24) / 12)
        else:
            # 3+ years old -> 80% to 95%
            base_prob = min(0.95, 0.80 + 0.05 * (age_months - 36))
            
        # 2. Battery Generation Difference (Rule of thumb: -15% capacity per year)
        battery_health_multiplier = max(1.0, age_months / 12.0 * 0.15)
        # Bumps probability by up to 20%
        battery_modifier = min(0.20, battery_health_multiplier * 0.20)
        
        # 3. Performance Gap vs Modern Devices
        # Fetch current device score, and average market score of recent 12 months
        intel_resp = self.supabase.table('device_intelligence').select('score_hardware, tech_nest_score').eq('device_id', device_id).single().execute()
        
        perf_modifier = 0.0
        if intel_resp.data:
            score = float(intel_resp.data.get('score_hardware', 7.0))
            # Assume market average grows by ~0.5 'score' per year
            expected_current_market_score = min(10.0, 7.5 + (0.5 * (age_months / 12)))
            gap = max(0, expected_current_market_score - score)
            
            # For every 1.0 point of gap, increase prob by 10%
            perf_modifier = min(0.30, gap * 0.10)
            
        # 4. User Preference Alignment
        # If user strongly prioritizes Battery, and their battery degradation is high, add multiplier constraint
        prof_resp = self.supabase.table('user_profiles').select('priority_battery, priority_performance').eq('user_id', user_id).single().execute()
        user_modifier = 0.0
        if prof_resp.data:
            battery_pref = float(prof_resp.data.get('priority_battery', 0.5))
            perf_pref = float(prof_resp.data.get('priority_performance', 0.5))
            
            if battery_pref > 0.7:
                # Highly sensitive to battery drain
                user_modifier += battery_modifier * 0.5 
            if perf_pref > 0.7:
                # Highly sensitive to lag
                user_modifier += perf_modifier * 0.5

        # Final Calculation
        upgrade_probability = min(0.99, base_prob + battery_modifier + perf_modifier + user_modifier)
        
        # Calculate Window
        if upgrade_probability > 0.80:
            window = "Immediate (0-1 month)"
        elif upgrade_probability > 0.60:
            window = "Soon (1-3 months)"
        elif upgrade_probability > 0.40:
            window = "Upcoming (3-6 months)"
        else:
            window = f"Stable ({int((0.6 - upgrade_probability) * 24)} months)"
            
        return {
            "upgrade_probability": round(upgrade_probability, 2),
            "recommended_window": window
        }
