from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.models import Fedex
from app.schemas import FedexCreate, FedexResponse, FedexUpdate
from app.database import get_db
from typing import List, Optional
from sqlalchemy.orm import Session


"""

Current Route ideas for fedex history:

GET /fedex/history
POST /fedex/history
PUT /fedex/history/{event_id}

"""

router = APIRouter(prefix="/fedex", tags=["FedEx History Logs"])


@router.get("/history", response_model=List[FedexResponse], status_code=status.HTTP_200_OK)
def get_fedex_history(
    companions: Optional[str] = Query(None, description="Search for a specific Companion"),
    reason: Optional[str] = Query(None, description="Search for a reason"),
    db:Session = Depends(get_db)
): 
    query = db.query(Fedex)

    if companions:
        query = query.filter(Fedex.companions.like(f"%{companions}%"))

    if reason:
        query = query.filter(Fedex.visit_reason.like(f"%{reason}%"))


    fedex_history = query.all()

    if not fedex_history:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No FedEx Events found."
        )

    return fedex_history


@router.post("/history", response_model=FedexResponse, status_code=status.HTTP_201_CREATED)
def create_fedex_history_log(
    event: FedexCreate,
    db:Session = Depends(get_db) 
):
    
    new_event = Fedex(
        visit_date = event.visit_date,
        visit_reason = event.visit_reason,
        companions = event.companions,
        departure_office = event.departure_office,
        arrival_fedex = event.arrival_fedex,
        departure_fedex = event.departure_fedex,
        arrival_office = event.arrival_office 
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event


@router.put("/history/{event_id}", response_model=FedexResponse, status_code=status.HTTP_200_OK)
def update_fedex_event(
    event_id: int,
    event_update: FedexUpdate,
    db:Session = Depends(get_db)
):

    event_to_update = db.query(Fedex).filter(
        Fedex.id == event_id
    ).first()

    if not event_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail = "No Event found"
        )


    update_data = event_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(event_to_update, key, value )


    db.commit()
    db.refresh(event_to_update)

    return event_to_update

     


     
    

    

