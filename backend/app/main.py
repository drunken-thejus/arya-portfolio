from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import Base, engine
from app.routers import (
    auth,
    dashboard,
    experience,
    messages,
    services,
    singletons,
    social,
    testimonials,
    upload,
    works,
)

# Create tables on startup (Alembic is available for real migrations).
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Content Writer Portfolio API",
    version="1.0.0",
    description="Backend powering a content-writer portfolio + CMS dashboard.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve locally-uploaded files when Supabase Storage is not configured.
local_uploads = Path(__file__).resolve().parent.parent / "uploads"
local_uploads.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=local_uploads), name="uploads")

app.include_router(auth.router)
app.include_router(singletons.hero_router)
app.include_router(singletons.about_router)
app.include_router(services.router)
app.include_router(works.router)
app.include_router(works.cat_router)
app.include_router(experience.router)
app.include_router(testimonials.router)
app.include_router(messages.router)
app.include_router(social.router)
app.include_router(upload.router)
app.include_router(dashboard.router)


@app.get("/", tags=["health"])
def root():
    return {"status": "ok", "service": "portfolio-api"}


@app.get("/health", tags=["health"])
def health():
    return {"status": "healthy"}
