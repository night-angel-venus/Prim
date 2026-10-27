from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


class ContactCreate(BaseModel):
    contact_name:str
    contact_email:str
    purpose:str

class ContactResponse(BaseModel):
    id:int
    contact_name:str
    contact_email:str
    purpose:str

    model_config = ConfigDict(from_attributes=True)

class ContactUpdate(BaseModel):
    contact_name:Optional[str]
    contact_email:Optional[str]
    purpose:Optional[str]