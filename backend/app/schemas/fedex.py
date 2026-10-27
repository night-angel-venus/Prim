from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import date
from typing import Optional

class FedexCreate(BaseModel):
    visit_date: date
    visit_reason: str
    companions: str
    departure_office: str
    arrival_fedex: str
    departure_fedex: str
    arrival_office: str

class FedexResponse(BaseModel):
    id: int
    visit_date: date
    visit_reason: str
    companions: str
    departure_office: str
    arrival_fedex: str
    departure_fedex: str
    arrival_office: str

    model_config = ConfigDict(from_attributes=True)

class FedexUpdate(BaseModel):
    visit_date: Optional[date] = None
    visit_reason: Optional[str] = None
    companions: Optional[str] = None
    departure_office: Optional[str] = None
    arrival_fedex: Optional[str] = None
    departure_fedex: Optional[str] = None
    arrival_office: Optional[str] = None

