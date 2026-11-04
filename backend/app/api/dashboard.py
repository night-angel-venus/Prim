from fastapi import APIRouter, Depends, Query, HTTPException, status
from app.models import (
    Employee, StatusEnum,
    Tiktok,
    Fedex,
    Purchases,
    Deadline,
    Report,
    User
) 

from app.schemas import (
    DashboardEmployees,
    DashboardTiktok,
    DashboardFedex,
    DashboardReports
)

from typing import List, Optional
from app.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime

"""
GET /dashboard/employees
GET /dashboard/employees-per-dept

GET /dashboard/tiktok-lives
GET /dashboard/tiktok-applicants (with query param)

GET /dashboard/fedex

GET /dashboard/reports (query param ?month=October)
GET /dashboard/purchases
GET /dashboard/pending-deadlines

"""

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/employees", response_model=DashboardEmployees)
def get_employee_stats(
    db:Session = Depends(get_db)
):
    active_count = db.query(func.count(Employee.id)).filter(
        Employee.status == StatusEnum.ACTIVE
    ).scalar() or 0

    count_per_dept = db.query(
        Employee.employee_department,
        func.count(Employee.id)
    ).filter(
        Employee.status == StatusEnum.ACTIVE
    ).group_by(
        Employee.employee_department
    ).all()

    count_per_dept = {dept.value if hasattr(dept, 'value') else str(dept): count for dept, count in count_per_dept}


    return DashboardEmployees(
        count_active=active_count,
        count_per_dept=count_per_dept
    )

@router.get("/tiktok", response_model=DashboardTiktok)
def get_tiktok_live_stats(db:Session = Depends(get_db)):

    total_lives = db.query(func.count(
        Tiktok.id
    )).filter(
        Tiktok.no_applicants > 0
    ).scalar() or 0

    curr_month = datetime.now().month
    curr_year = datetime.now().year

    curr_month_applicants = db.query(func.sum(
        Tiktok.no_applicants
    )).filter(
        extract('month', Tiktok.live_date) == curr_month,
        extract('year', Tiktok.live_date) == curr_year
    ).scalar() or 0

    monthly_applicants_query = db.query(
        extract('month', Tiktok.live_date).label('month'),
        func.sum(Tiktok.no_applicants)
    ).filter(
        extract('year', Tiktok.live_date) == curr_year
    ).group_by('month').all()

    month_names = [
        "Jan", "Feb", "Mar", 
        "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", 
        "Oct", "Nov", "Dec"
    ]

    monthly_applicants = {month_names[int(m_num) - 1]: total for m_num, total in monthly_applicants_query}

    return DashboardTiktok(
        count_tiktok_lives=total_lives,
        count_applicants=sum(monthly_applicants.values()),
        count_applicants_per_month=monthly_applicants,
        count_applicants_current_month=curr_month_applicants
    )


@router.get("/fedex", response_model=DashboardFedex)
def get_fedex_stats(db:Session = Depends(get_db)):

    count_visits = db.query(func.count(Fedex.id)).scalar() or 0

    recent_visit = db.query(Fedex).order_by(Fedex.visit_date.desc()).first()

    if recent_visit:
        recent_date = str(recent_visit.visit_date)
        recent_reason = recent_visit.visit_reason
    else:
        recent_date = None
        recent_reason = None

    return DashboardFedex(
        count_visits=count_visits,
        recent_visit_date=recent_date,
        recent_visit_reason=recent_reason
    )


@router.get("/reports", response_model=DashboardReports)
def get_reports(db:Session = Depends(get_db)):

    reports_resolved = db.query(func.count(Report.id)).scalar()

    purchases = db.query(func.count(Purchases.id)).scalar()

    pending_deadlines = db.query(func.count(Deadline.id)).filter(
        Deadline.completed == False
    ).scalar() or 0

    return DashboardReports(
        count_reports = reports_resolved,
        count_purchases = purchases,
        pending = pending_deadlines,
    )

    