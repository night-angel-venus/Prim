from pydantic import BaseModel, ConfigDict
from datetime import date as date_type
from typing import Optional


class ReportCreate(BaseModel):
    problem: str
    description:str
    solution:str
    reported_by:str

class ReportResponse(BaseModel):
    id: int 
    problem: str
    description:str
    solution:str
    reported_by:str
    date: date_type

    model_config = ConfigDict(from_attributes=True)

class ReportUpdate(BaseModel):
    problem: Optional[str] = None
    description:Optional[str] = None
    solution:Optional[str] = None
    reported_by:Optional[str] = None
    date: Optional[date_type] = None
   

