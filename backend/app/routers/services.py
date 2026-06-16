from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_admin
from app.models import Service
from app.schemas import (
    ReorderPayload,
    ServiceCreate,
    ServiceOut,
    ServiceUpdate,
)

router = APIRouter(prefix="/api/services", tags=["services"])


@router.get("", response_model=list[ServiceOut])
def list_services(db: Session = Depends(get_db)):
    return db.query(Service).order_by(Service.order, Service.id).all()


@router.post("", response_model=ServiceOut, dependencies=[Depends(get_current_admin)])
def create_service(payload: ServiceCreate, db: Session = Depends(get_db)):
    obj = Service(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/reorder", dependencies=[Depends(get_current_admin)])
def reorder(payload: ReorderPayload, db: Session = Depends(get_db)):
    for item in payload.items:
        db.query(Service).filter(Service.id == item.id).update({"order": item.order})
    db.commit()
    return {"status": "ok"}


@router.put("/{service_id}", response_model=ServiceOut, dependencies=[Depends(get_current_admin)])
def update_service(service_id: int, payload: ServiceUpdate, db: Session = Depends(get_db)):
    obj = db.get(Service, service_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Service not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{service_id}", dependencies=[Depends(get_current_admin)])
def delete_service(service_id: int, db: Session = Depends(get_db)):
    obj = db.get(Service, service_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(obj)
    db.commit()
    return {"status": "deleted"}
