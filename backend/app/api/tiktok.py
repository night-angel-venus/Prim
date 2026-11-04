from fastapi import APIRouter, Depends, status, Query, HTTPException
from app.models import Tiktok
from app.schemas import TiktokCreate, TiktokUpdate, TiktokResponse
from app.database import get_db
from typing import List, Optional
from sqlalchemy.orm import Session


router = APIRouter(prefix="/tiktok", tags=["TikTok Live History"])

"""
route ideas:

GET /tiktok/history
POST /tiktok/history
PUT /tiktok/history

"""


@router.get("/history", response_model=List[TiktokResponse])
def get_tiktok_live_history(
    hosts: Optional[str]  = Query(None, description="Search for a host"),
    no_live_day: Optional[bool] = Query(None, description="Search for a day with No Applicants"),
    db:Session = Depends(get_db) 
):

    query = db.query(Tiktok) 


    if hosts:
        query = query.filter(Tiktok.hosts.like(f"%{hosts}%"))

    if no_live_day == True:
        query = query.filter(Tiktok.no_applicants == 0)
    elif no_live_day == False:
        query = query.filter(Tiktok.no_applicants > 0)



    tiktok_history = query.order_by(
        Tiktok.live_date.desc()
    ).all()

    return tiktok_history


@router.post("/history", response_model=TiktokResponse, status_code=status.HTTP_201_CREATED)
def create_tiktok_live_log(
    tiktok_live: TiktokCreate,
    db:Session = Depends(get_db)
):

    new_tiktok_live = Tiktok(
        live_date = tiktok_live.live_date,
        hosts = tiktok_live.hosts,
        no_applicants = tiktok_live.no_applicants,
    )

    db.add(new_tiktok_live)
    db.commit()
    db.refresh(new_tiktok_live)

    return new_tiktok_live


@router.put("/history/{event_id}", response_model=TiktokResponse, status_code=status.HTTP_200_OK)
def update_tiktok_live_log(
    event_id: int,
    tiktok_update: TiktokUpdate,
    db:Session = Depends(get_db)
):
    
    tiktok_live_to_update = db.query(Tiktok).filter(
        Tiktok.id == event_id
    ).first()

    if not tiktok_live_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="TikTok Live event not found"
        )

    update_data = tiktok_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(tiktok_live_to_update, key, value)


    db.commit()
    db.refresh(tiktok_live_to_update)

    return tiktok_live_to_update 

