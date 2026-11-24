from sqlalchemy import Column, Integer, String, Enum, Date, Time, JSON, Numeric, Text
from app.database import Base
import enum


class PurchaseSourceEnum(str, enum.Enum):
    DEFAULT = "None"
    SHOPEE = "Shopee"
    TIKTOK_SHOP = "TikTok Shop"

class Purchases(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, autoincrement=True)
    purchase_date = Column(Date)
    source = Column(Enum(PurchaseSourceEnum), default=PurchaseSourceEnum.DEFAULT, nullable=False)
    item = Column(String(100), nullable=False)
    price = Column(Integer, nullable=False)
    beneficiary = Column(String(255), nullable=False)
