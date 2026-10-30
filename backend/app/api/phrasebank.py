from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.models import Phrasebank
from app.schemas import PhraseCreate, PhraseResponse, PhraseUpdate
from app.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional


router = APIRouter(prefix="/phrasebank", tags=["Copy-Paste Phrasebank"])


"""
GET /phrasebank/items
POST /phrasebank/items
PUT /phrasebank/items
"""


@router.get("/items", response_model=List[PhraseResponse], status_code = status.HTTP_200_OK)
def get_phrasebank(
    keyword:Optional[str] = Query(None, description="Search for a specific word"),
    db:Session = Depends(get_db)
):

    query = db.query(Phrasebank)

    if keyword:
        query = query.filter(
            or_(
                Phrasebank.phrase_title.ilike(f"%{keyword}%"),
                Phrasebank.phrase.ilike(f"%{keyword}%")
            )
        )
        

    phrasebank = query.all()

    return phrasebank


@router.post("/items", response_model=PhraseResponse, status_code=status.HTTP_201_CREATED)
def create_phrase(
    phrase: PhraseCreate,
    db:Session = Depends(get_db)
):

    new_phrase = Phrasebank(
        phrase_title = phrase.phrase_title,
        phrase = phrase.phrase
    )

    db.add(new_phrase)
    db.commit()
    db.refresh(new_phrase)

    return new_phrase


@router.put("/items/{phrase_id}", response_model=PhraseResponse, status_code=status.HTTP_200_OK)
def update_phrase(
    phrase_id: int,
    phrase_update:PhraseUpdate,
    db:Session = Depends(get_db)
):
    phrase_to_update = db.query(Phrasebank).filter(
        Phrasebank.id == phrase_id
    ).first()

    if not phrase_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Phrase Found"
        )


    update_data = phrase_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(phrase_to_update, key, value)

    db.commit()
    db.refresh(phrase_to_update)

    return phrase_to_update