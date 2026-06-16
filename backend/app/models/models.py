from datetime import date, datetime, timezone

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def _now() -> datetime:
    return datetime.now(timezone.utc)


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_now, onupdate=_now
    )


# ──────────────────────────────────────────────────────────────────
# Auth
# ──────────────────────────────────────────────────────────────────
class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120), default="Admin")
    hashed_password: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=True)


# ──────────────────────────────────────────────────────────────────
# Singletons (one row, edited in the dashboard)
# ──────────────────────────────────────────────────────────────────
class Hero(Base, TimestampMixin):
    __tablename__ = "hero"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), default="")
    headline: Mapped[str] = mapped_column(Text, default="")
    intro: Mapped[str] = mapped_column(Text, default="")
    profile_image: Mapped[str | None] = mapped_column(Text, nullable=True)
    background_image: Mapped[str | None] = mapped_column(Text, nullable=True)
    # CTA buttons stored as JSON-ish list: [{label, href, variant}]
    cta_primary_label: Mapped[str | None] = mapped_column(String(80), nullable=True)
    cta_primary_href: Mapped[str | None] = mapped_column(Text, nullable=True)
    cta_secondary_label: Mapped[str | None] = mapped_column(String(80), nullable=True)
    cta_secondary_href: Mapped[str | None] = mapped_column(Text, nullable=True)


class About(Base, TimestampMixin):
    __tablename__ = "about"

    id: Mapped[int] = mapped_column(primary_key=True)
    biography: Mapped[str] = mapped_column(Text, default="")
    philosophy: Mapped[str] = mapped_column(Text, default="")
    experience_summary: Mapped[str] = mapped_column(Text, default="")
    profile_image: Mapped[str | None] = mapped_column(Text, nullable=True)
    years_experience: Mapped[int] = mapped_column(Integer, default=0)
    articles_published: Mapped[int] = mapped_column(Integer, default=0)
    clients_count: Mapped[int] = mapped_column(Integer, default=0)


# ──────────────────────────────────────────────────────────────────
# Collections (CRUD + reorder)
# ──────────────────────────────────────────────────────────────────
class Service(Base, TimestampMixin):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(160))
    description: Mapped[str] = mapped_column(Text, default="")
    icon: Mapped[str | None] = mapped_column(String(80), nullable=True)
    order: Mapped[int] = mapped_column(Integer, default=0, index=True)


class Category(Base, TimestampMixin):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True)
    slug: Mapped[str] = mapped_column(String(140), unique=True, index=True)

    works: Mapped[list["Work"]] = relationship(back_populates="category")


class Work(Base, TimestampMixin):
    __tablename__ = "works"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(220))
    slug: Mapped[str] = mapped_column(String(240), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text, default="")
    cover_image: Mapped[str | None] = mapped_column(Text, nullable=True)
    content: Mapped[str] = mapped_column(Text, default="")  # rich HTML
    external_link: Mapped[str | None] = mapped_column(Text, nullable=True)
    published_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    tags: Mapped[str] = mapped_column(String(500), default="")  # comma-separated
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    order: Mapped[int] = mapped_column(Integer, default=0, index=True)

    category_id: Mapped[int | None] = mapped_column(
        ForeignKey("categories.id", ondelete="SET NULL"), nullable=True
    )
    category: Mapped["Category | None"] = relationship(back_populates="works")
    images: Mapped[list["WorkImage"]] = relationship(
        back_populates="work", cascade="all, delete-orphan", order_by="WorkImage.order"
    )


class WorkImage(Base, TimestampMixin):
    __tablename__ = "work_images"

    id: Mapped[int] = mapped_column(primary_key=True)
    work_id: Mapped[int] = mapped_column(
        ForeignKey("works.id", ondelete="CASCADE"), index=True
    )
    url: Mapped[str] = mapped_column(Text)
    caption: Mapped[str | None] = mapped_column(String(255), nullable=True)
    order: Mapped[int] = mapped_column(Integer, default=0)

    work: Mapped["Work"] = relationship(back_populates="images")


class Experience(Base, TimestampMixin):
    __tablename__ = "experience"

    id: Mapped[int] = mapped_column(primary_key=True)
    company: Mapped[str] = mapped_column(String(180))
    role: Mapped[str] = mapped_column(String(180))
    description: Mapped[str] = mapped_column(Text, default="")
    start_date: Mapped[str | None] = mapped_column(String(40), nullable=True)
    end_date: Mapped[str | None] = mapped_column(String(40), nullable=True)
    logo: Mapped[str | None] = mapped_column(Text, nullable=True)
    order: Mapped[int] = mapped_column(Integer, default=0, index=True)


class Testimonial(Base, TimestampMixin):
    __tablename__ = "testimonials"

    id: Mapped[int] = mapped_column(primary_key=True)
    client_name: Mapped[str] = mapped_column(String(160))
    profile_image: Mapped[str | None] = mapped_column(Text, nullable=True)
    company: Mapped[str | None] = mapped_column(String(180), nullable=True)
    role: Mapped[str | None] = mapped_column(String(180), nullable=True)
    message: Mapped[str] = mapped_column(Text)
    order: Mapped[int] = mapped_column(Integer, default=0, index=True)


class Message(Base, TimestampMixin):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(160))
    email: Mapped[str] = mapped_column(String(255))
    subject: Mapped[str | None] = mapped_column(String(255), nullable=True)
    body: Mapped[str] = mapped_column(Text)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, index=True)


class SocialLink(Base, TimestampMixin):
    __tablename__ = "social_links"

    id: Mapped[int] = mapped_column(primary_key=True)
    platform: Mapped[str] = mapped_column(String(80))
    url: Mapped[str] = mapped_column(Text)
    icon: Mapped[str | None] = mapped_column(String(80), nullable=True)
    order: Mapped[int] = mapped_column(Integer, default=0, index=True)
