from fastapi import APIRouter, Depends, Query, status, HTTPException
from app.database import get_db
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models import Report
from app.schemas import ReportCreate, ReportUpdate, ReportResponse 
from sqlalchemy import func



router = APIRouter(prefix="/reports", tags=["Report Logs"])


@router.get("/logs", response_model=List[ReportResponse], status_code=status.HTTP_200_OK)
def get_reports(
    reported_by: Optional[str] = Query(None, description="Search who reported"),
    problem: Optional[str] = Query(None, description="Search for a keyword in PROBLEM"),
    solution: Optional[str] = Query(None, description="Search for a keyword in SOLUTION"),
    db:Session = Depends(get_db)
):

    query = db.query(Report)

    if reported_by:
        query = query.filter(Report.reported_by.ilike(f"%{reported_by}%"))
    
    if problem:
        query = query.filter(Report.problem.ilike(f"%{problem}%"))
    
    if solution:
        query = query.filter(Report.solution.ilike(f"%{solution}%"))

    reports = query.all()

    if not reports:
        return [] 

    return reports


@router.post("/logs", response_model = ReportResponse, status_code = status.HTTP_201_CREATED)
def create_report(
    report: ReportCreate,
    db:Session = Depends(get_db)
):

    new_report = Report(
        problem = report.problem,
        description = report.description,
        solution = report.solution,
        reported_by=report.reported_by,
    )

    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return new_report


@router.put("/logs/{report_id}", response_model=ReportResponse, status_code=status.HTTP_200_OK)
def update_log(
    report_id: int,
    report_update: ReportUpdate,
    db:Session = Depends(get_db)
):

    report_to_update = db.query(Report).filter(
        Report.id == report_id
    ).first()

    if not report_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No Report Found"
        )

    update_data = report_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(report_to_update, key, value)

    db.commit()
    db.refresh(report_to_update)

    return report_to_update
    
