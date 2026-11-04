from sqlalchemy import func, Column, Integer, String, Enum, Date, Time, JSON, Numeric, Text
from app.database import Base


class Fedex(Base):
    __tablename__ = "fedex"

    id = Column(Integer, primary_key=True, autoincrement=True)
    visit_date = Column(Date, default=func.now())
    visit_reason = Column(String(255), nullable=False)
    companions = Column(String(255), nullable=False)
    departure_office = Column(String(30), nullable=False)
    arrival_fedex = Column(String(30), nullable=False)
    departure_fedex = Column(String(30), nullable=False)
    arrival_office = Column(String(30), nullable=False)