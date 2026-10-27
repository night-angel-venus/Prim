from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional

class PhraseCreate(BaseModel):
    phrase_title:str
    phrase:str

class PhraseResponse(BaseModel):
    id:int
    phrase_title:str
    phrase:str

    model_config=ConfigDict(from_attributes=True)

class PhraseUpdate(BaseModel):
    phrase_title:Optional[str] = None
    phrase:Optional[str] = None