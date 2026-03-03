from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from app.api.deps import get_current_user, require_admin

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
async def update_intelligence_context(payload: UserSignalPayload):
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
async def get_intelligence_metrics(admin_info: dict = Depends(require_admin)):
    """
    Protected Admin Endpoint.
    Only users with 'admin' or 'super_admin' roles can access this.
    Returns global system intelligence metrics.
    """
    user = admin_info["user"]
    role = admin_info["role"]
    
    # Real logic would fetch metrics from DB/Redis here
    return {
        "status": "success",
        "actor": user.email,
        "role": role,
        "metrics": {
            "active_sessions": 245,
            "intelligence_ops_per_minute": 182,
            "decision_confidence_average": 0.87
        }
    }
