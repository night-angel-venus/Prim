from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from app.models.accounts import CategoryEnum


class AccountsCreate(BaseModel):
    account: str
    username_email: str
    password: str
    category: CategoryEnum 


class AccountsResponse(BaseModel):
    id: int
    account: str
    username_email: str
    password: str
    category: CategoryEnum 

    model_config = ConfigDict(from_attributes=True)



class AccountsUpdate(BaseModel):
    account: Optional[str] = None
    username_email: Optional[str] = None
    password: Optional[str] = None
    category: Optional[CategoryEnum] = None 
