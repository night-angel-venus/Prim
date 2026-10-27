from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import date
from app.models.purchases import PurchaseSourceEnum
from typing import Optional

class PurchaseCreate(BaseModel):
    purchase_date:date
    source: PurchaseSourceEnum
    item:str
    price:int
    beneficiary:str


class PurchaseResponse(BaseModel):
    id:int
    purchase_date:date
    source: PurchaseSourceEnum
    item:str
    price:int
    beneficiary:str

    model_config=ConfigDict(from_attributes=True)

class PurchaseUpdate(BaseModel):
    purchase_date:  Optional[date] = None
    source:  Optional[PurchaseSourceEnum] = None
    item: Optional[str] = None
    price: Optional[int] = None
    beneficiary: Optional[str] = None