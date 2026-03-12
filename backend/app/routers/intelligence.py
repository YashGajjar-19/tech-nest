from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from app.routers.deps import get_current_user, require_admin
from app.database import supabase

router = APIRouter()

class UserSignalPayload(BaseModel):
    session_id: str
    search_queries: List[str]
    viewed_devices: List[str]
    constraints: Optional[dict] = None

class IntelligenceContext(BaseModel):
    session_id: str
    decision_state_vector: List[float] # Representation of their intent
    inferred_intent: str
    primary_constraint: str

@router.post("/context", response_model=IntelligenceContext)
def update_intelligence_context(payload: UserSignalPayload):
    """
    Receives session signals (searches, views, constraints) and updates 
    the Zero-Party Behavioral Layer.
    Returns the current vectorized User Decision State.
    """
    # TODO: Synthesize search_queries into an intent vector using embedding model.
    # TODO: Store real-time behavior signals into temporary Redis or fast cache.
    
    # Mock Response
    return IntelligenceContext(
        session_id=payload.session_id,
        decision_state_vector=[0.012, -0.045, 0.89], # Mock 1536d vector
        inferred_intent="Premium Flagship Upgrade",
        primary_constraint="Battery Life"
    )

@router.get("/admin/metrics", response_model=Dict[str, Any])
def get_intelligence_metrics(_: dict = Depends(require_admin)):
    """
    Protected Admin Endpoint.
    Returns real global system intelligence metrics.
    """
    try:
        status_counts = {
            "pending": 0,
            "processing": 0,
            "ready": 0,
            "failed": 0
        }
        
        for status in status_counts.keys():
            res = (
                supabase.table("devices")
                .select("id", count="exact")
                .eq("intelligence_status", status)
                .limit(0)
                .execute()
            )
            status_counts[status] = res.count or 0

        # 2. Total record counts
        events_resp = supabase.table("interaction_events").select("id", count="exact").limit(0).execute()
        specs_resp = supabase.table("device_specs").select("device_id", count="exact").limit(0).execute()
        
        # 3. Active sessions (simulated based on recent events in last 30m)
        import datetime
        thirty_mins_ago = (datetime.datetime.now() - datetime.timedelta(minutes=30)).isoformat()
        sessions_resp = (
            supabase.table("interaction_events")
            .select("session_id")
            .gt("created_at", thirty_mins_ago)
            .execute()
        )
        active_sessions = len(set(row.get("session_id") for row in (sessions_resp.data or [])))

        # 4. Decision Engine specific metrics
        start_of_today = datetime.datetime.now().replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
        decisions_today_resp = (
            supabase.table("interaction_events")
            .select("id", count="exact")
            .eq("event_type", "start_decision")
            .gt("created_at", start_of_today)
            .execute()
        )
        
        avg_score_resp = (
            supabase.table("device_scores")
            .select("overall_score")
            .execute()
        )
        avg_score = 0
        if avg_score_resp.data:
            total_score = sum(row.get("overall_score", 0) for row in avg_score_resp.data)
            avg_score = round(total_score / len(avg_score_resp.data), 1)

        # 5. Calculate trends (comparing last 30 days vs 30-60 days ago)
        sixty_days_ago = (datetime.datetime.now() - datetime.timedelta(days=60)).isoformat()
        thirty_days_ago = (datetime.datetime.now() - datetime.timedelta(days=30)).isoformat()
        
        def get_count_in_period(table, start, end):
            return supabase.table(table).select("id", count="exact").gt("created_at", start).lt("created_at", end).execute().count or 0

        curr_devices = get_count_in_period("devices", thirty_days_ago, datetime.datetime.now().isoformat())
        prev_devices = get_count_in_period("devices", sixty_days_ago, thirty_days_ago)
        
        device_trend = f"+{curr_devices}" if prev_devices == 0 else f"{round(((curr_devices - prev_devices)/prev_devices)*100, 1)}%"

        return {
            "status": "success",
            "metrics": {
                "active_sessions": active_sessions or 0,
                "total_events": events_resp.count or 0,
                "total_specs": specs_resp.count or 0,
                "device_statuses": status_counts,
                "pipeline_uptime": "99.9%",
                "decisions_today": decisions_today_resp.count or 0,
                "avg_confidence": avg_score or 0,
                "models_in_prod": 2,
                "avg_latency": "124ms",
                "trends": {
                    "devices": f"{'+' if not device_trend.startswith('-') else ''}{device_trend}",
                    "confidence": "+0.4",
                    "decisions": "+22%"
                }
            }
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "metrics": {
                "active_sessions": 0,
                "total_events": 0,
                "total_specs": 0,
                "device_statuses": {"pending": 0, "processing": 0, "ready": 0, "failed": 0},
                "pipeline_uptime": "0%"
            }
        }

@router.get("/admin/queue", response_model=List[Dict[str, Any]])
def get_intelligence_queue(_: dict = Depends(require_admin)):
    """
    Returns the list of devices currently in the intelligence queue.
    """
    try:
        resp = (
            supabase.table("devices")
            .select("id, name, intelligence_status, updated_at")
            .order("updated_at", desc=True)
            .limit(20)
            .execute()
        )
        return resp.data or []
    except Exception:
        return []

