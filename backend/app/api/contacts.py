from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Contacts
from app.schemas import ContactCreate, ContactResponse, ContactUpdate


router = APIRouter(prefix="/contacts", tags=["Contact Numbers"])


@router.get("/items", response_model=List[ContactResponse], status_code= status.HTTP_200_OK)
def get_contacts(
    name: Optional[str] = Query(None, description="Search for contact name"),
    purpose: Optional[str] = Query(None, description="Search for contact purpose"),
    db: Session = Depends(get_db)
):

    query = db.query(Contacts)

    if name:
        query = query.filter(
            Contacts.contact_name.like(f"%{name}%")
        )

    if purpose:
        query = query.filter(
            Contacts.purpose.like(F"%{purpose}%")
        )

    contacts = query.all()

    if not contacts:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Contacts Found"
        )

    return contacts



@router.post("/items", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def create_contact(
    contact: ContactCreate,
    db:Session = Depends(get_db)
):

    new_contact = Contacts(
        contact_name = contact.contact_name,
        contact_number = contact.contact_number,
        purpose = contact.purpose
    )

    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)

    return new_contact


@router.put("/items/{contact_id}", response_model=ContactResponse, status_code=status.HTTP_200_OK)
def update_contact(
    contact_id: int,
    contact_update: ContactUpdate,
    db:Session = Depends(get_db)
):

    contact_to_update = db.query(Contacts).filter(
        Contacts.id == contact_id
    ).first()

    if not contact_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Contact Found"
        )


    update_data = contact_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(contact_to_update, key, value)

    db.commit()
    db.refresh(contact_to_update)

    return contact_to_update

