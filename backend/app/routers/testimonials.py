from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_admin
from app.models import Testimonial
from app.schemas import (
    ReorderPayload,
    TestimonialCreate,
    TestimonialOut,
    TestimonialUpdate,
)

router = APIRouter(prefix="/api/testimonials", tags=["testimonials"])


@router.get("", response_model=list[TestimonialOut])
def list_testimonials(db: Session = Depends(get_db)):
    return db.query(Testimonial).order_by(Testimonial.order, Testimonial.id).all()


@router.post("", response_model=TestimonialOut, dependencies=[Depends(get_current_admin)])
def create_testimonial(payload: TestimonialCreate, db: Session = Depends(get_db)):
    obj = Testimonial(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/reorder", dependencies=[Depends(get_current_admin)])
def reorder(payload: ReorderPayload, db: Session = Depends(get_db)):
    for item in payload.items:
        db.query(Testimonial).filter(Testimonial.id == item.id).update({"order": item.order})
    db.commit()
    return {"status": "ok"}


@router.put("/{tid}", response_model=TestimonialOut, dependencies=[Depends(get_current_admin)])
def update_testimonial(tid: int, payload: TestimonialUpdate, db: Session = Depends(get_db)):
    obj = db.get(Testimonial, tid)
    if not obj:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{tid}", dependencies=[Depends(get_current_admin)])
def delete_testimonial(tid: int, db: Session = Depends(get_db)):
    obj = db.get(Testimonial, tid)
    if not obj:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(obj)
    db.commit()
    return {"status": "deleted"}
