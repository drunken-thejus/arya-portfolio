from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ── Auth ──────────────────────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(ORMModel):
    id: int
    email: EmailStr
    name: str
    is_admin: bool


# ── Hero ──────────────────────────────────────────────────────────
class HeroBase(BaseModel):
    name: str = ""
    headline: str = ""
    intro: str = ""
    profile_image: str | None = None
    background_image: str | None = None
    cta_primary_label: str | None = None
    cta_primary_href: str | None = None
    cta_secondary_label: str | None = None
    cta_secondary_href: str | None = None


class HeroOut(HeroBase, ORMModel):
    id: int


# ── About ─────────────────────────────────────────────────────────
class AboutBase(BaseModel):
    biography: str = ""
    philosophy: str = ""
    experience_summary: str = ""
    profile_image: str | None = None
    years_experience: int = 0
    articles_published: int = 0
    clients_count: int = 0


class AboutOut(AboutBase, ORMModel):
    id: int


# ── Service ───────────────────────────────────────────────────────
class ServiceBase(BaseModel):
    title: str
    description: str = ""
    icon: str | None = None
    order: int = 0


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    icon: str | None = None
    order: int | None = None


class ServiceOut(ServiceBase, ORMModel):
    id: int


# ── Category ──────────────────────────────────────────────────────
class CategoryBase(BaseModel):
    name: str


class CategoryOut(ORMModel):
    id: int
    name: str
    slug: str


# ── Work images ───────────────────────────────────────────────────
class WorkImageIn(BaseModel):
    url: str
    caption: str | None = None
    order: int = 0


class WorkImageOut(WorkImageIn, ORMModel):
    id: int


# ── Work ──────────────────────────────────────────────────────────
class WorkBase(BaseModel):
    title: str
    description: str = ""
    cover_image: str | None = None
    content: str = ""
    external_link: str | None = None
    published_date: date | None = None
    tags: str = ""
    is_featured: bool = False
    is_published: bool = True
    order: int = 0
    category_id: int | None = None


class WorkCreate(WorkBase):
    images: list[WorkImageIn] = Field(default_factory=list)


class WorkUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    cover_image: str | None = None
    content: str | None = None
    external_link: str | None = None
    published_date: date | None = None
    tags: str | None = None
    is_featured: bool | None = None
    is_published: bool | None = None
    order: int | None = None
    category_id: int | None = None
    images: list[WorkImageIn] | None = None


class WorkOut(WorkBase, ORMModel):
    id: int
    slug: str
    created_at: datetime
    category: CategoryOut | None = None
    images: list[WorkImageOut] = Field(default_factory=list)


# ── Experience ────────────────────────────────────────────────────
class ExperienceBase(BaseModel):
    company: str
    role: str
    description: str = ""
    start_date: str | None = None
    end_date: str | None = None
    logo: str | None = None
    order: int = 0


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    company: str | None = None
    role: str | None = None
    description: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    logo: str | None = None
    order: int | None = None


class ExperienceOut(ExperienceBase, ORMModel):
    id: int


# ── Testimonial ───────────────────────────────────────────────────
class TestimonialBase(BaseModel):
    client_name: str
    profile_image: str | None = None
    company: str | None = None
    role: str | None = None
    message: str
    order: int = 0


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    client_name: str | None = None
    profile_image: str | None = None
    company: str | None = None
    role: str | None = None
    message: str | None = None
    order: int | None = None


class TestimonialOut(TestimonialBase, ORMModel):
    id: int


# ── Message ───────────────────────────────────────────────────────
class MessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str | None = None
    body: str


class MessageOut(ORMModel):
    id: int
    name: str
    email: EmailStr
    subject: str | None
    body: str
    is_read: bool
    created_at: datetime


# ── Social link ───────────────────────────────────────────────────
class SocialLinkBase(BaseModel):
    platform: str
    url: str
    icon: str | None = None
    order: int = 0


class SocialLinkCreate(SocialLinkBase):
    pass


class SocialLinkUpdate(BaseModel):
    platform: str | None = None
    url: str | None = None
    icon: str | None = None
    order: int | None = None


class SocialLinkOut(SocialLinkBase, ORMModel):
    id: int


# ── Reorder + uploads + dashboard ─────────────────────────────────
class ReorderItem(BaseModel):
    id: int
    order: int


class ReorderPayload(BaseModel):
    items: list[ReorderItem]


class UploadOut(BaseModel):
    url: str


class DashboardStats(BaseModel):
    total_works: int
    total_services: int
    total_messages: int
    unread_messages: int
    total_testimonials: int
    total_experience: int
    recent_messages: list[MessageOut]
    recent_works: list[WorkOut]
