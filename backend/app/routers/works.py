from fastapi import APIRouter, Depends, HTTPException, Query
from slugify import slugify
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_admin
from app.models import Category, Work, WorkImage
from app.schemas import (
    CategoryBase,
    CategoryOut,
    ReorderPayload,
    WorkCreate,
    WorkOut,
    WorkUpdate,
)

router = APIRouter(prefix="/api/works", tags=["works"])
cat_router = APIRouter(prefix="/api/categories", tags=["categories"])


def _unique_slug(db: Session, title: str, exclude_id: int | None = None) -> str:
    base = slugify(title) or "untitled"
    slug = base
    i = 2
    while True:
        q = db.query(Work).filter(Work.slug == slug)
        if exclude_id:
            q = q.filter(Work.id != exclude_id)
        if not q.first():
            return slug
        slug = f"{base}-{i}"
        i += 1


def _sync_images(db: Session, work: Work, images) -> None:
    work.images.clear()
    db.flush()
    for idx, img in enumerate(images):
        work.images.append(
            WorkImage(url=img.url, caption=img.caption, order=img.order or idx)
        )


# ── Categories ────────────────────────────────────────────────────
@cat_router.get("", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.name).all()


@cat_router.post("", response_model=CategoryOut, dependencies=[Depends(get_current_admin)])
def create_category(payload: CategoryBase, db: Session = Depends(get_db)):
    slug = slugify(payload.name)
    existing = db.query(Category).filter(Category.slug == slug).first()
    if existing:
        return existing
    obj = Category(name=payload.name, slug=slug)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@cat_router.delete("/{cat_id}", dependencies=[Depends(get_current_admin)])
def delete_category(cat_id: int, db: Session = Depends(get_db)):
    obj = db.get(Category, cat_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(obj)
    db.commit()
    return {"status": "deleted"}


# ── Works ─────────────────────────────────────────────────────────
@router.get("", response_model=list[WorkOut])
def list_works(
    db: Session = Depends(get_db),
    category: str | None = Query(None, description="filter by category slug"),
    featured: bool | None = None,
    include_unpublished: bool = False,
):
    q = db.query(Work)
    if not include_unpublished:
        q = q.filter(Work.is_published.is_(True))
    if category:
        q = q.join(Category).filter(Category.slug == category)
    if featured is not None:
        q = q.filter(Work.is_featured.is_(featured))
    return q.order_by(Work.order, Work.created_at.desc()).all()


@router.get("/{slug}", response_model=WorkOut)
def get_work(slug: str, db: Session = Depends(get_db)):
    obj = db.query(Work).filter(Work.slug == slug).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Work not found")
    return obj


@router.post("", response_model=WorkOut, dependencies=[Depends(get_current_admin)])
def create_work(payload: WorkCreate, db: Session = Depends(get_db)):
    data = payload.model_dump(exclude={"images"})
    work = Work(**data, slug=_unique_slug(db, payload.title))
    db.add(work)
    db.flush()
    _sync_images(db, work, payload.images)
    db.commit()
    db.refresh(work)
    return work


@router.put("/reorder", dependencies=[Depends(get_current_admin)])
def reorder(payload: ReorderPayload, db: Session = Depends(get_db)):
    for item in payload.items:
        db.query(Work).filter(Work.id == item.id).update({"order": item.order})
    db.commit()
    return {"status": "ok"}


@router.put("/{work_id}", response_model=WorkOut, dependencies=[Depends(get_current_admin)])
def update_work(work_id: int, payload: WorkUpdate, db: Session = Depends(get_db)):
    work = db.get(Work, work_id)
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")
    data = payload.model_dump(exclude_unset=True, exclude={"images"})
    if "title" in data and data["title"] != work.title:
        work.slug = _unique_slug(db, data["title"], exclude_id=work.id)
    for field, value in data.items():
        setattr(work, field, value)
    if payload.images is not None:
        _sync_images(db, work, payload.images)
    db.commit()
    db.refresh(work)
    return work


@router.delete("/{work_id}", dependencies=[Depends(get_current_admin)])
def delete_work(work_id: int, db: Session = Depends(get_db)):
    work = db.get(Work, work_id)
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")
    db.delete(work)
    db.commit()
    return {"status": "deleted"}
