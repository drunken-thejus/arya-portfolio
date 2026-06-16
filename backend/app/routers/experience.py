from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_admin
from app.models import Experience
from app.schemas import (
    ExperienceCreate,
    ExperienceOut,
    ExperienceUpdate,
    ReorderPayload,
)

router = APIRouter(prefix="/api/experience", tags=["experience"])


@router.get("", response_model=list[ExperienceOut])
def list_experience(db: Session = Depends(get_db)):
    return db.query(Experience).order_by(Experience.order, Experience.id).all()


@router.post("", response_model=ExperienceOut, dependencies=[Depends(get_current_admin)])
def create_experience(payload: ExperienceCreate, db: Session = Depends(get_db)):
    obj = Experience(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/reorder", dependencies=[Depends(get_current_admin)])
def reorder(payload: ReorderPayload, db: Session = Depends(get_db)):
    for item in payload.items:
        db.query(Experience).filter(Experience.id == item.id).update({"order": item.order})
    db.commit()
    return {"status": "ok"}


@router.put("/{exp_id}", response_model=ExperienceOut, dependencies=[Depends(get_current_admin)])
def update_experience(exp_id: int, payload: ExperienceUpdate, db: Session = Depends(get_db)):
    obj = db.get(Experience, exp_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Experience not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{exp_id}", dependencies=[Depends(get_current_admin)])
def delete_experience(exp_id: int, db: Session = Depends(get_db)):
    obj = db.get(Experience, exp_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Experience not found")
    db.delete(obj)
    db.commit()
    return {"status": "deleted"}
