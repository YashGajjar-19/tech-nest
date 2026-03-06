from pydantic import BaseModel, Field, condecimal
from typing import Optional, List, Dict, Any, Union
from datetime import date, datetime
from enum import Enum
from uuid import UUID

# 1. Brands
class BrandBase(BaseModel):
    name: str
    slug: str
    logo_url: Optional[str] = None
    country: Optional[str] = None
    is_active: bool = True

class BrandCreate(BrandBase):
    pass

class BrandInDB(BrandBase):
    id: UUID
    created_at: datetime

# 2. Devices
class DeviceType(str, Enum):
    SMARTPHONE = 'smartphone'
    TABLET = 'tablet'
    LAPTOP = 'laptop'
    WEARABLE = 'wearable'

class DeviceStatus(str, Enum):
    RELEASED = 'released'
    UPCOMING = 'upcoming'
    RUMORED = 'rumored'

class DeviceBase(BaseModel):
    brand_id: UUID
    name: str
    slug: str
    device_type: DeviceType
    release_date: Optional[date] = None
    status: Optional[DeviceStatus] = None
    hero_image: Optional[str] = None

class DeviceCreate(DeviceBase):
    pass

class DeviceInDB(DeviceBase):
    id: UUID
    created_at: datetime
    
# 3. Device Variants
class DeviceVariantBase(BaseModel):
    device_id: UUID
    ram_gb: Optional[int] = None
    storage_gb: Optional[int] = None
    price: Optional[float] = None
    currency: str = 'USD'
    sku_name: Optional[str] = None

class DeviceVariantCreate(DeviceVariantBase):
    pass

class DeviceVariantInDB(DeviceVariantBase):
    id: UUID

# 4. Specification Categories
class SpecCategoryBase(BaseModel):
    name: str
    display_order: int = 0

class SpecCategoryCreate(SpecCategoryBase):
    pass

class SpecCategoryInDB(SpecCategoryBase):
    id: UUID

# 5. Specification Definitions
class SpecValueType(str, Enum):
    NUMBER = 'number'
    STRING = 'string'
    BOOLEAN = 'boolean'

class SpecDefinitionBase(BaseModel):
    key: str
    label: str
    category_id: UUID
    unit: Optional[str] = None
    value_type: Optional[SpecValueType] = None

class SpecDefinitionCreate(SpecDefinitionBase):
    pass

class SpecDefinitionInDB(SpecDefinitionBase):
    id: UUID

# 6. Device Specification Values
class DeviceSpecValueBase(BaseModel):
    device_id: UUID
    spec_id: UUID
    value_number: Optional[float] = None
    value_text: Optional[str] = None

class DeviceSpecValueCreate(DeviceSpecValueBase):
    pass

class DeviceSpecValueInDB(DeviceSpecValueBase):
    pass

# 7. Device Intelligence Scores
class DeviceScoreBase(BaseModel):
    device_id: UUID
    display_score: int = 0
    performance_score: int = 0
    camera_score: int = 0
    battery_score: int = 0
    design_score: int = 0
    software_score: int = 0
    overall_score: int = 0

class DeviceScoreCreate(DeviceScoreBase):
    pass

class DeviceScoreInDB(DeviceScoreBase):
    updated_at: datetime

# 8. AI Insights
class DeviceAIInsightBase(BaseModel):
    device_id: UUID
    summary: Optional[str] = None
    pros: List[str] = Field(default_factory=list)
    cons: List[str] = Field(default_factory=list)
    best_for: Optional[str] = None
    avoid_if: Optional[str] = None

class DeviceAIInsightCreate(DeviceAIInsightBase):
    pass

class DeviceAIInsightInDB(DeviceAIInsightBase):
    generated_at: datetime

# 9. Device Images
class ImageType(str, Enum):
    HERO = 'hero'
    GALLERY = 'gallery'
    COLOR_VARIANT = 'color_variant'

class DeviceImageBase(BaseModel):
    device_id: UUID
    image_url: str
    image_type: Optional[ImageType] = None
    display_order: int = 0

class DeviceImageCreate(DeviceImageBase):
    pass

class DeviceImageInDB(DeviceImageBase):
    id: UUID

# 10. Device Relationships
class RelationType(str, Enum):
    COMPETITOR = 'competitor'
    PREVIOUS_GENERATION = 'previous_generation'
    UPGRADE_TO = 'upgrade_to'
    ALTERNATIVE = 'alternative'

class DeviceRelationshipBase(BaseModel):
    device_id: UUID
    related_device_id: UUID
    relation_type: RelationType

class DeviceRelationshipCreate(DeviceRelationshipBase):
    pass

class DeviceRelationshipInDB(DeviceRelationshipBase):
    pass

# 11. Network Intelligence
class DeviceNetworkStatBase(BaseModel):
    device_id: UUID
    views: int = 0
    comparisons: int = 0
    recommendations: int = 0
    selections: int = 0
    trend_score: float = 0.0

class DeviceNetworkStatCreate(DeviceNetworkStatBase):
    pass

class DeviceNetworkStatInDB(DeviceNetworkStatBase):
    updated_at: datetime

# 12. Decision Sessions
class DecisionSessionBase(BaseModel):
    query: Optional[str] = None
    parsed_intent: Optional[Dict[str, Any]] = None
    filters: Optional[Dict[str, Any]] = None

class DecisionSessionCreate(DecisionSessionBase):
    pass

class DecisionSessionInDB(DecisionSessionBase):
    id: UUID
    created_at: datetime

