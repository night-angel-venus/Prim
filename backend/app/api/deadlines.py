from fastapi import APIRouter, Depends, Query, HTTPException, status
from app.database import get_db
from sqlalchemy.orm import Session
from app.models import Deadline
from app.schemas import DeadlineComplete, DeadlineResponse, DeadlineCreate, DeadlineUpdate
from typing import List, Optional


router = APIRouter(prefix="/deadlines", tags=["Deadlines"])

@router.get("/items", response_model=List[DeadlineResponse], status_code=status.HTTP_200_OK)
def get_deadlines(
    completed: Optional[bool] = Query(None, description="Filter Completed"),
    keyword: Optional[str] = Query(None, description="Filter Keywords"),
    beneficiary: Optional[str] = Query(None, description="Filter Benef"),
    db:Session = Depends(get_db)
):

    query = db.query(Deadline)

    if completed == True:
        query = query.filter(Deadline.completed == True)
    elif completed == False:
        query = query.filter(Deadline.completed == False)


    if keyword:
        query = query.filter(Deadline.title.ilike(f"%{keyword}%"))

    if beneficiary:
        query = query.filter(Deadline.beneficiary.ilike(f"%{beneficiary}%"))

    deadlines = query.all()

    if not deadlines:
        return []

    return deadlines



@router.post("/items", response_model=DeadlineResponse, status_code=status.HTTP_201_CREATED)
def create_deadline(
    deadline: DeadlineCreate,
    db:Session = Depends(get_db)
):

    new_deadline = Deadline(
        due_date = deadline.due_date,
        title = deadline.title,
        beneficiary = deadline.beneficiary
    )


    db.add(new_deadline)
    db.commit()
    db.refresh(new_deadline)

    return new_deadline

@router.put("/items/{deadline_id}", response_model = DeadlineResponse, status_code=status.HTTP_200_OK)
def update_deadline(
    deadline_id: int,
    deadline_update: DeadlineUpdate,
    db:Session = Depends(get_db)
):
    deadline_to_update = db.query(Deadline).filter(
        Deadline.id == deadline_id
    ).first()

    if not deadline_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Deadline Found"
        )


    update_data = deadline_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(deadline_to_update, key, value)

    db.commit()
    db.refresh(deadline_to_update)
    return deadline_to_update


@router.put("/complete/{deadline_id}", response_model=DeadlineResponse, status_code=status.HTTP_200_OK)
def complete_deadline(
    deadline_id: int,
    deadline_complete: DeadlineComplete,
    db:Session = Depends(get_db)
):

    deadline = db.query(Deadline).filter(
        Deadline.id == deadline_id
    ).first()

    if not deadline:
        raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No Deadline Found"
            )


    deadline.completed = deadline_complete.completed

    db.commit()
    db.refresh(deadline)

    return deadline

