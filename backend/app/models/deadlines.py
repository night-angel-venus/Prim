from sqlalchemy import Column, Integer, String, Date, Boolean
from app.database import Base


class Deadline(Base):
    __tablename__ = "deadlines"

    id = Column(Integer, primary_key=True, autoincrement=True)
    due_date = Column(Date, nullable=False)
    title = Column(String(100), nullable=False)
    beneficiary = Column(String(50), nullable=False)
    completed = Column(Boolean, default=False)