from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.config import settings

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse, Token
from app.auth.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user
)

from app.utils.rate_limit import limiter

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit(settings.RATE_LIMIT)
def register(
    request: Request,
    user: UserCreate,
    db:Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.username == user.username
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )

    hashed_password = get_password_hash(user.password)

    new_user = User(
        username = user.username,
        email = user.email,
        name = user.name,
        password = hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login",response_model=Token, status_code=status.HTTP_200_OK)
@limiter.limit(settings.RATE_LIMIT)
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db:Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.username == form_data.username
    ).first()

    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},)


    access_token = create_access_token(
        data = {"sub": user.username}
    )

    return {
        "access_token": access_token,
        "token_type" : "bearer",
        "user": user
    }
