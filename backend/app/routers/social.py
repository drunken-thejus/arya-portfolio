from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_admin
from app.models import SocialLink
from app.schemas import (
    ReorderPayload,
    SocialLinkCreate,
    SocialLinkOut,
    SocialLinkUpdate,
)

router = APIRouter(prefix="/api/social", tags=["social"])


@router.get("", response_model=list[SocialLinkOut])
def list_social(db: Session = Depends(get_db)):
    return db.query(SocialLink).order_by(SocialLink.order, SocialLink.id).all()


@router.post("", response_model=SocialLinkOut, dependencies=[Depends(get_current_admin)])
def create_social(payload: SocialLinkCreate, db: Session = Depends(get_db)):
    obj = SocialLink(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/reorder", dependencies=[Depends(get_current_admin)])
def reorder(payload: ReorderPayload, db: Session = Depends(get_db)):
    for item in payload.items:
        db.query(SocialLink).filter(SocialLink.id == item.id).update({"order": item.order})
    db.commit()
    return {"status": "ok"}


@router.put("/{sid}", response_model=SocialLinkOut, dependencies=[Depends(get_current_admin)])
def update_social(sid: int, payload: SocialLinkUpdate, db: Session = Depends(get_db)):
    obj = db.get(SocialLink, sid)
    if not obj:
        raise HTTPException(status_code=404, detail="Social link not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{sid}", dependencies=[Depends(get_current_admin)])
def delete_social(sid: int, db: Session = Depends(get_db)):
    obj = db.get(SocialLink, sid)
    if not obj:
        raise HTTPException(status_code=404, detail="Social link not found")
    db.delete(obj)
    db.commit()
    return {"status": "deleted"}
