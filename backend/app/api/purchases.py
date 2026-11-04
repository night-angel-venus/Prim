from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from typing import List, Optional
from app.models import Purchases, PurchaseSourceEnum
from app.schemas import PurchaseCreate, PurchaseResponse, PurchaseUpdate


router = APIRouter(prefix="/purchases", tags=["Purchase History"])


@router.get("/history", response_model=List[PurchaseResponse], status_code=status.HTTP_200_OK)
def get_purchases(
    source: Optional[PurchaseSourceEnum] = Query(None, description="Search for items based on source"),
    item: Optional[str] = Query(None, description="Search for items"),
    beneficiary: Optional[str] = Query(None, description="Search for Beneficiaries"),   
    db:Session = Depends(get_db)
):

    query = db.query(Purchases)


    if source:
        query = query.filter(Purchases.source == source)
    
    if item:
        query = query.filter(Purchases.item.like(f"%{item}%"))
    
    if beneficiary:
        query = query.filter(Purchases.beneficiary.like(f"%{beneficiary}%"))

    purchases = query.all()

    if not purchases:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Purchases Found"
        )

    return purchases


@router.post("/history", response_model=PurchaseResponse, status_code=status.HTTP_201_CREATED)
def create_purchase(
    purchase: PurchaseCreate,
    db:Session = Depends(get_db)
):

    new_purchase = Purchases(
        source = purchase.source,
        item = purchase.item,
        price = purchase.price,
        beneficiary = purchase.beneficiary,
        purchase_date = purchase.purchase_date
    )

    db.add(new_purchase)
    db.commit()
    db.refresh(new_purchase)

    return new_purchase


@router.put("/history/{purchase_id}", response_model=PurchaseResponse, status_code=status.HTTP_200_OK)
def update_purchase(
    purchase_id:int,
    purchase_update: PurchaseUpdate,
    db:Session = Depends(get_db)
):

    purchase_to_update = db.query(Purchases).filter(Purchases.id == purchase_id).first()

    if not purchase_to_update:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Purchase Found"
        )


    update_data = purchase_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(purchase_to_update, key, value)


    db.commit()
    db.refresh(purchase_to_update)
    return purchase_to_update