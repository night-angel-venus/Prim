from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date


class DeadlineCreate(BaseModel):
    due_date: date
    title: str
    beneficiary: str

class DeadlineResponse(BaseModel):
    id: int
    due_date: date
    title: str
    beneficiary: str
    completed: bool

    model_config = ConfigDict(from_attributes=True)

class DeadlineUpdate(BaseModel):
    due_date: Optional[date] = None
    title: Optional[str] = None
    beneficiary: Optional[str] = None

class DeadlineComplete(BaseModel):
    completed: bool