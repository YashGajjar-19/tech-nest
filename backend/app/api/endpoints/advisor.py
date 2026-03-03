from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
from app.models.advisor import AdvisorFeedResponse
from app.services.advisor_engine import AdvisorEngine

router = APIRouter()

class ForceRefreshRequest(BaseModel):
    user_id: str

def get_current_user_id() -> str:
    # In production, uses auth dependencies to retrieve the token's User UUID.
    return "example-user-uuid"

@router.get("/feed", response_model=AdvisorFeedResponse)
async def get_advisor_feed(user_id: str = Depends(get_current_user_id)):
    """
    Retrieve the sorted, pre-computed Advisor Feed.
    This feed represents proactive insights (Upgrades, Prices, Recommendations).
    """
    engine = AdvisorEngine()
    
    try:
        events = await engine.get_feed(user_id)
        unread = sum(1 for e in events if not e.get('is_read', False))
        return AdvisorFeedResponse(events=events, unread_count=unread)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refresh")
async def manual_trigger_advisor(
    payload: ForceRefreshRequest, 
    background_tasks: BackgroundTasks
):
    """
    Manually kick off the background re-computation of preference weights,
    upgrade predictions, and event feed generation.
    """
    engine = AdvisorEngine()
    background_tasks.add_task(engine.process_user_events, payload.user_id)
    
    return {"message": "Advisor background processing triggered successfully."}
