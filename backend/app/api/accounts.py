from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.database import get_db
from app.models import Accounts, CategoryEnum
from app.schemas import AccountsCreate, AccountsResponse, AccountsUpdate
from typing import List, Optional
from sqlalchemy.orm import Session


router = APIRouter(prefix="/accounts", tags=["Admin Accounts"])



@router.get("/admin", response_model=List[AccountsResponse], status_code=status.HTTP_200_OK)
def get_accounts(
    category: Optional[CategoryEnum] = Query(None, description="Filter by category"),
    db:Session = Depends(get_db)
):

    query = db.query(Accounts)

    if category:
        query = query.filter(Accounts.category == category)

    accounts = query.all()

    if not accounts:
        return []

    return accounts



@router.post("/admin", response_model=AccountsResponse, status_code=status.HTTP_201_CREATED)
def add_account(
    account: AccountsCreate,
    db:Session = Depends(get_db)
):

    new_account = Accounts(
        account = account.account,
        username_email = account.username_email,
        password = account.password,
        category = account.category
    )

    db.add(new_account)
    db.commit()
    db.refresh(new_account)

    return new_account


@router.put("/admin/{account_id}", response_model=AccountsResponse, status_code=status.HTTP_200_OK)
def update_account(
    account_id: int,
    account_update: AccountsUpdate,
    db:Session = Depends(get_db)
):

    account_to_update = db.query(Accounts).filter(
        Accounts.id == account_id
    ).first()

    if not account_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Account not found"
        )

    update_data = account_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(account_to_update, key, value)

    db.commit()
    db.refresh(account_to_update)

    return account_to_update