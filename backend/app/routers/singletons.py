"""Hero & About are single-row sections edited in the dashboard."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_admin
from app.models import About, Hero
from app.schemas import AboutBase, AboutOut, HeroBase, HeroOut

hero_router = APIRouter(prefix="/api/hero", tags=["hero"])
about_router = APIRouter(prefix="/api/about", tags=["about"])


def _get_or_create(db: Session, model):
    obj = db.query(model).first()
    if obj is None:
        obj = model()
        db.add(obj)
        db.commit()
        db.refresh(obj)
    return obj


# ── Hero ──────────────────────────────────────────────────────────
@hero_router.get("", response_model=HeroOut)
def get_hero(db: Session = Depends(get_db)):
    return _get_or_create(db, Hero)


@hero_router.put("", response_model=HeroOut, dependencies=[Depends(get_current_admin)])
def update_hero(payload: HeroBase, db: Session = Depends(get_db)):
    obj = _get_or_create(db, Hero)
    for field, value in payload.model_dump().items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


# ── About ─────────────────────────────────────────────────────────
@about_router.get("", response_model=AboutOut)
def get_about(db: Session = Depends(get_db)):
    return _get_or_create(db, About)


@about_router.put("", response_model=AboutOut, dependencies=[Depends(get_current_admin)])
def update_about(payload: AboutBase, db: Session = Depends(get_db)):
    obj = _get_or_create(db, About)
    for field, value in payload.model_dump().items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj
