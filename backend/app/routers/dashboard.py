from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_admin
from app.models import Experience, Message, Service, Testimonial, Work
from app.schemas import DashboardStats

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardStats, dependencies=[Depends(get_current_admin)])
def stats(db: Session = Depends(get_db)):
    return DashboardStats(
        total_works=db.query(Work).count(),
        total_services=db.query(Service).count(),
        total_messages=db.query(Message).count(),
        unread_messages=db.query(Message).filter(Message.is_read.is_(False)).count(),
        total_testimonials=db.query(Testimonial).count(),
        total_experience=db.query(Experience).count(),
        recent_messages=db.query(Message)
        .order_by(Message.created_at.desc())
        .limit(5)
        .all(),
        recent_works=db.query(Work).order_by(Work.created_at.desc()).limit(5).all(),
    )
