from enum import Enum
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

class IntentEnum(str, Enum):
    GENERAL_QUERY = "general_query"
    HOURS_INQUIRY = "hours_inquiry"
    PRICING_INQUIRY = "pricing_inquiry"
    BOOKING_REQUEST = "booking_request"
    CONTACT_REQUEST = "contact_request"

class ExtractedEntities(BaseModel):
    service_name: Optional[str] = None
    item_name: Optional[str] = None
    requested_date: Optional[str] = None
    requested_time: Optional[str] = None
    customer_phone: Optional[str] = None

class StructuredLLMOutput(BaseModel):
    intent: IntentEnum = Field(..., description="Classified intent of user query")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0 and 1")
    entities: ExtractedEntities = Field(default_factory=ExtractedEntities)
    reply_text: str = Field(..., description="Friendly customer-facing response text")
    requires_human: bool = Field(default=False, description="Flag if request requires human front-desk intervention")

