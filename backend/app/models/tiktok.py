from sqlalchemy import func, Column, Integer, String, Enum, Date, Time, JSON, Numeric, Text
from app.database import Base

class Tiktok(Base):
    __tablename__ = "tiktok"

    id = Column(Integer, primary_key=True, autoincrement=True)
    live_date = Column(Date, default=func.now())
    hosts = Column(String(255))
    no_applicants = Column(Integer, nullable=False)
