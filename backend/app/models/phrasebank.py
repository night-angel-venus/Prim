from sqlalchemy import Column, Integer, String, Enum, Date, Time, JSON, Numeric, Text
from app.database import Base

class Phrasebank(Base):
    __tablename__ = "phrasebank"

    id = Column(Integer, primary_key=True, autoincrement=True)
    phrase_title = Column(String(100), nullable=False)
    phrase = Column(String(255), nullable=False)