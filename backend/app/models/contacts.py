from sqlalchemy import Column, Integer, String, Enum, Date, Time, JSON, Numeric, Text
from app.database import Base


class Contacts(Base):
    __tablename__ = "contacts"

    id = Column(Integer, autoincrement=True, primary_key=True)
    contact_name = Column(String(100), nullable=False)
    contact_number = Column(String(255), nullable=False)
    purpose = Column(String(100), nullable=False)