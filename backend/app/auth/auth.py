from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.config import settings

from app.database import get_db
from sqlalchemy.orm import Session
from app.models import User
from app.schemas import Token


password_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto",
    pbkdf_sha256__default_rounds=100000
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/v1/login")


def get_password_hash(password:str):
    return password_context.hash(password)

def verify_password(
        plain_password: str,
        hashed_password: str
    ):
    return password_context.verify(plain_password, hashed_password)


def create_access_token(
        data: dict,
        expires_delta: Optional[timedelta] = None
):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta

    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.TOKEN_EXPIRATION_MINUTES)

    to_encode.update(
        {"exp":expire}
    )

    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return encoded_jwt



async def get_current_user(
        token:str = Depends(oauth2_scheme),
        db:Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail = "Unable to Validate Credentials",
        headers={"WWW-Authenticate":"Bearer"}
    )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        username:str = payload.get("sub")

        if username is None:
            raise credentials_exception

    
    except JWTError:
        raise credentials_exception



    user = db.query(User).filter(User.username == username).first()

    if user is None:
        raise credentials_exception

    return user