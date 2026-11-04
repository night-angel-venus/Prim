from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import date
from typing import Optional


class TiktokCreate(BaseModel):
    live_date: date
    hosts: str
    no_applicants: int

class TiktokResponse(BaseModel):
    id: int
    live_date: date
    hosts: str
    no_applicants: int

    model_config = ConfigDict(from_attributes=True)

class TiktokUpdate(BaseModel):
    live_date: Optional[date] = None
    hosts: Optional[str] = None
    no_applicants: Optional[int] = None