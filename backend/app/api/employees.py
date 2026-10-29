from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.models import Employee, DepartmentEnum, StatusEnum
from app.schemas import EmployeeCreate, EmployeeResponse, EmployeeUpdate
from typing import List, Optional
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(prefix="/directory", tags=["Employee Directory"])


"""
GET /employees - all employees
POST /employees - create employee
PUT /employees - update employee info
PUT /archive - set employee status to archive

question: do i make routes for filtering?
example:
/employees/recruitemnt
/employees/accounting
etc.

"""


# ! /directory/employees
@router.get(
    "/employees", response_model=List[EmployeeResponse], status_code=status.HTTP_200_OK
)
def get_employees(

    # Query Parameter
    department: Optional[DepartmentEnum] = Query(None, description="Filters by de"),
    db: Session = Depends(get_db)
    ):

    query = db.query(Employee)

    if department:
        query = query.filter(
            Employee.employee_department == department
        )

    employees = query.all()

    if not employees:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No Employees Found"
        )

    return employees

    # Todo: Implement filtering


# ! /directory/employees
@router.post("/employees", response_model=EmployeeResponse)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    existing_employee = (
        db.query(Employee)
        .filter(Employee.employee_email == employee.employee_email)
        .first()
    )

    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee {existing_employee.employee_name} already exists",
        )

    new_employee = Employee(
        employee_name=employee.employee_name,
        employee_department=employee.employee_department,
        employee_email=employee.employee_email,
        employee_password=employee.employee_password,
        contact_no = employee.contact_no,
        status=StatusEnum.ACTIVE,
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return new_employee


# ! /directory/employees
@router.put(
    "/employees/{employee_id}",
    response_model=EmployeeResponse,
    status_code=status.HTTP_200_OK,
)
def update_employee(
    employee_id: int, 
    employee_update: EmployeeUpdate, 
    db: Session = Depends(get_db)
):

    employee_to_update = db.query(Employee).filter(Employee.id == employee_id).first()

    if not employee_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="No Employees Found"
        )


    # ! This takes in the columns in employee_update (uses EmployeeUpdate Schema)
    update_data = employee_update.model_dump(exclude_unset=True)

    # ! this iterates the values to update, then
    # ! overwrites the CURRENT employee data
    for key, value in update_data.items():
        setattr(employee_to_update, key, value)


    db.commit()
    db.refresh(employee_to_update)

    return employee_to_update


@router.put("/archive/{employee_id}", response_model=EmployeeResponse, status_code=status.HTTP_200_OK)
def archive_employee(
    employee_id: int,
    db:Session = Depends(get_db)
):
    employee_to_archive = db.query(Employee).filter(Employee.id == employee_id).first()
    
    if not employee_to_archive:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Employee not found"
        )

    employee_to_archive.status = StatusEnum.ARCHIVED

    db.commit()
    db.refresh(employee_to_archive)

    return employee_to_archive