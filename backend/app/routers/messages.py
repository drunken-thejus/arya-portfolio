from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_admin
from app.models import Message
from app.schemas import MessageCreate, MessageOut

router = APIRouter(prefix="/api/messages", tags=["messages"])


@router.post("", response_model=MessageOut, status_code=201)
def submit_message(payload: MessageCreate, db: Session = Depends(get_db)):
    """Public endpoint — used by the contact form."""
    obj = Message(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("", response_model=list[MessageOut], dependencies=[Depends(get_current_admin)])
def list_messages(db: Session = Depends(get_db)):
    return db.query(Message).order_by(Message.created_at.desc()).all()


@router.put("/{mid}/read", response_model=MessageOut, dependencies=[Depends(get_current_admin)])
def mark_read(mid: int, is_read: bool = True, db: Session = Depends(get_db)):
    obj = db.get(Message, mid)
    if not obj:
        raise HTTPException(status_code=404, detail="Message not found")
    obj.is_read = is_read
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/{mid}", dependencies=[Depends(get_current_admin)])
def delete_message(mid: int, db: Session = Depends(get_db)):
    obj = db.get(Message, mid)
    if not obj:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(obj)
    db.commit()
    return {"status": "deleted"}
