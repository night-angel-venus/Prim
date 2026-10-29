from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from app.models.employees import DepartmentEnum, StatusEnum


class EmployeeCreate(BaseModel):
    employee_name: str
    employee_department: DepartmentEnum
    employee_email: EmailStr
    contact_no: str
    employee_password: str
    status: StatusEnum = StatusEnum.ACTIVE

class EmployeeResponse(BaseModel):
    id: int
    employee_name: str
    employee_department: DepartmentEnum
    employee_email: EmailStr
    contact_no: str
    status: StatusEnum = StatusEnum.ACTIVE

    model_config = ConfigDict(from_attributes=True)

class EmployeeUpdate(BaseModel):
    employee_name: Optional[str] = None
    employee_department: Optional[DepartmentEnum] = None
    employee_email: Optional[EmailStr] = None
    contact_no: Optional[str] =  None
    employee_password: Optional[str] = None
    status: Optional[StatusEnum] = None