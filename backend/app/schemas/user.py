from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    name:str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    name:str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

    model_config = ConfigDict(from_attributes=True)