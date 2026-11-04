from sqlalchemy import Column, Integer, String, Enum
from app.database import Base
import enum


class CategoryEnum(str, enum.Enum):
    GENERAL = "General"
    NETWORK = "Network"
    ACCOUNTING = "Accounting"
    RECRUITMENT = "Recruitment"
    CCTV = "CCTV"
    ANYDESK = "Anydesk"


class Accounts(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    account = Column(String(100), nullable=False)
    username_email = Column(String(100), nullable=False)
    password = Column(String(100), nullable=False)
    category = Column(Enum(CategoryEnum), default=CategoryEnum.GENERAL, nullable=False)