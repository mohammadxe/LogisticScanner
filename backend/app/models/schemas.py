from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class ShipmentTypeEnum(str, Enum):
    OCEAN_FCL = "Ocean (FCL)"
    OCEAN_LCL = "Ocean (LCL)"
    AIR_CARGO = "Air Cargo"
    FTL_TRUCKING = "FTL Trucking"
    LTL_TRUCKING = "LTL Trucking"

class WeightUnit(str, Enum):
    KG = "kg"
    TONS = "tons"

class IncotermsEnum(str, Enum):
    EXW = "EXW"
    FOB = "FOB"
    CIF = "CIF"
    DDP = "DDP"

class ShipmentDetailsRequest(BaseModel):
    shipmentTypes: List[str]
    weight: float = Field(..., gt=0)
    weightUnit: WeightUnit = WeightUnit.KG
    volume: float = Field(..., ge=0)
    commodity: str
    hsCode: Optional[str] = None
    hazardous: bool = False
    temperatureControlled: bool = False
    origin: str
    destination: str
    departureWindow: Optional[str] = None
    incoterms: IncotermsEnum = IncotermsEnum.CIF
    customsClearance: bool = False
    insurance: bool = False
    lastMileDelivery: bool = False
    warehousing: bool = False

class TransportLegResponse(BaseModel):
    mode: str
    origin: str
    destination: str
    duration: str
    carrier: Optional[str] = None
    distance_km: Optional[float] = None

class ShippingOptionResponse(BaseModel):
    mode: str
    price: float
    transitDays: int
    route: List[TransportLegResponse]
    carbonFootprint: Optional[float] = None
    reliability: Optional[float] = None

class QuoteResponse(BaseModel):
    cheapest: ShippingOptionResponse
    fastest: ShippingOptionResponse
    bestValue: ShippingOptionResponse
    options: List[ShippingOptionResponse]
    aiSummary: str
    requestId: str

class ValidationResponse(BaseModel):
    valid: bool
    normalized: ShipmentDetailsRequest
    warnings: List[str]
    errors: List[str]

class RecommendationRequest(BaseModel):
    shipmentDetails: ShipmentDetailsRequest
    options: List[ShippingOptionResponse]
    priorities: Optional[dict] = None

class RecommendationResponse(BaseModel):
    recommendations: List[dict]
    analysis: str
    selectedOption: ShippingOptionResponse
