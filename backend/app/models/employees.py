from sqlalchemy import Column, Integer, String, Enum, Date, Time, JSON, Numeric, Text
from app.database import Base
import enum


class DepartmentEnum(str, enum.Enum):
    DEFAULT = "None"
    ADMIN = "Admin/HR"
    OPERATIONS = "Operations"
    ACCOUNTING = "Accounting"
    RECRUITMENT = "Recruitment"
    IT = "IT"

class StatusEnum(str, enum.Enum):
    ACTIVE =  "Active"
    ARCHIVED = "Archived"

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_name = Column(String(50), nullable=False)
    employee_department = Column(Enum(DepartmentEnum), default=DepartmentEnum.DEFAULT, nullable=False)
    employee_email = Column(String(50), unique=True, nullable=False)
    contact_no = Column(String(50), nullable=False)
    employee_password = Column(String(255), nullable=False)
    status  = Column(Enum(StatusEnum), default=StatusEnum.ACTIVE, nullable=False)

