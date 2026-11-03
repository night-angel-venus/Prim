from sqlalchemy import Column, Integer, String, Date, func, Text
from app.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, autoincrement=True, primary_key=True)
    problem = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    solution = Column(Text, nullable=False)
    reported_by = Column(String(50), nullable=False)
    date = Column(Date, default=func.now())
