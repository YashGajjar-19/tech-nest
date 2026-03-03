from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime
from uuid import UUID

# User Profile
class UserProfileBase(BaseModel):
    user_id: str
    primary_device_id: Optional[str] = None
    budget_range: Optional[Literal['budget', 'mid-range', 'flagship']] = None
    priority_camera: float = Field(default=0.5, ge=0.0, le=1.0)
    priority_battery: float = Field(default=0.5, ge=0.0, le=1.0)
    priority_performance: float = Field(default=0.5, ge=0.0, le=1.0)
    preferred_brands: List[str] = []

class UserProfileInDB(UserProfileBase):
    last_updated: datetime
    created_at: datetime

# Ownership Graph
class UserDeviceCreate(BaseModel):
    user_id: str
    device_id: str
    purchase_date: Optional[datetime] = None
    ownership_status: Literal['current', 'previous', 'wishlist', 'considering']

class UserDeviceInDB(UserDeviceCreate):
    id: UUID
    created_at: datetime

# Decision Memory
class DecisionMemoryCreate(BaseModel):
    user_id: str
    decision_session_id: str
    chosen_device_id: str
    decision_type: Literal['upgrade_phone', 'gift', 'switch_brand', 'general_search']

# Advisor Event
class AdvisorEventBase(BaseModel):
    user_id: str
    event_type: Literal['UPGRADE_ALERT', 'PRICE_DROP', 'BETTER_ALTERNATIVE', 'NEW_RELEASE']
    device_id: Optional[str] = None
    message: str
    priority: int = 1
    expires_at: Optional[datetime] = None

class AdvisorEventInDB(AdvisorEventBase):
    id: UUID
    is_read: bool
    created_at: datetime

class AdvisorFeedResponse(BaseModel):
    events: List[AdvisorEventInDB]
    unread_count: int
