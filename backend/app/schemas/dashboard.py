from pydantic import BaseModel
from typing import Optional, Dict

class DashboardEmployees(BaseModel):
    count_active: int
    count_per_dept: Dict[str, int]

class DashboardTiktok(BaseModel):
    count_tiktok_lives: int
    count_applicants: int
    count_applicants_per_month: Dict[str, int]
    count_applicants_current_month: int

class DashboardFedex(BaseModel):
    count_visits: int
    recent_visit_date: Optional[str] = None
    recent_visit_reason: Optional[str] = None

class DashboardReports(BaseModel):
    count_reports: int
    count_purchases: int
    pending: int