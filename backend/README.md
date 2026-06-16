# Backend — Content Writer Portfolio API

FastAPI + SQLAlchemy + JWT + Supabase Storage.

## Run locally
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python seed.py
uvicorn app.main:app --reload
```
Docs: http://localhost:8000/docs

> No `DATABASE_URL` → SQLite (`dev.db`). No Supabase creds → uploads saved to
> `./uploads` and served at `/uploads/...`. So it runs fully offline for dev.

## Structure
```
app/
├── main.py            # app factory, router wiring, CORS, static uploads
├── config.py          # pydantic-settings env config
├── database.py        # engine + session + Base
├── security.py        # bcrypt hashing + JWT encode/decode
├── deps.py            # get_db, get_current_user, get_current_admin
├── storage.py         # Supabase Storage upload/delete (+ local fallback)
├── models/            # SQLAlchemy ORM models (all tables)
├── schemas/           # Pydantic request/response models
└── routers/           # auth, singletons (hero/about), services, works,
                       # experience, testimonials, messages, social, upload, dashboard
alembic/               # migrations (autogenerate-ready env.py)
seed.py                # first admin user + demo content
```

## Migrations
```bash
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```

## Database schema

`users`, `hero`, `about`, `services`, `categories`, `works`, `work_images`
(FK → works), `experience`, `testimonials`, `messages`, `social_links`.

Relationships: `works.category_id → categories.id` (SET NULL),
`work_images.work_id → works.id` (CASCADE).
