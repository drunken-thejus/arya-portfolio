# Content Writer Portfolio — Full-Stack CMS Platform

A premium, editorial-style portfolio for a professional content writer, with a
headless CMS dashboard so the owner can edit **everything** without touching code.

Design language is inspired by the *Strata* Framer template (dark, minimal,
large-type editorial) and rebuilt cleanly with Next.js components.

```
Portfolio/
├── frontend/   → Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion   → Vercel
├── backend/    → FastAPI + SQLAlchemy + JWT + Supabase Storage                       → Render
└── page.html   → original design reference (not used at runtime)
```

## Tech stack

| Layer    | Tech |
|----------|------|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Lenis smooth scroll, Tiptap rich-text editor |
| Backend  | FastAPI, SQLAlchemy 2.0, Pydantic v2, Alembic, JWT (python-jose), bcrypt |
| Database | PostgreSQL (Supabase) |
| Storage  | Supabase Storage (profile images, portfolio images, thumbnails, certificates, media) |
| Auth     | JWT-based admin authentication |
| Deploy   | Frontend → Vercel · Backend → Render |

## Sections (all editable from `/admin`)

Hero · About (with animated stats) · Services · Works/Portfolio (with detail
pages at `/works/[slug]`) · Experience timeline · Testimonials · Contact form
(submissions land in the dashboard inbox).

## Quick start (local)

### 1. Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # edit values (or leave DATABASE_URL blank to use SQLite)
python seed.py                # creates admin user + demo content
uvicorn app.main:app --reload # → http://localhost:8000  (docs at /docs)
```
> With no `DATABASE_URL` it falls back to a local SQLite file, and with no
> `SUPABASE_URL` uploads are stored on disk under `backend/uploads/` — so you can
> run the whole stack locally with zero cloud setup.

### 2. Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev                        # → http://localhost:3000
```

Visit `http://localhost:3000` for the site and `http://localhost:3000/admin`
for the dashboard. Log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your
backend `.env`.

## Deployment

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for full Supabase + Render + Vercel steps.

## API overview

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/auth/login` | – | Get JWT (form: `username`=email, `password`) |
| GET | `/auth/me` | ✓ | Current admin |
| GET/PUT | `/api/hero`, `/api/about` | read/✓ | Singleton sections |
| GET/POST/PUT/DELETE | `/api/services` | read/✓ | Services CRUD (+ `/reorder`) |
| GET/POST/PUT/DELETE | `/api/works` | read/✓ | Works CRUD (`GET /api/works/{slug}`) |
| GET/POST/DELETE | `/api/categories` | read/✓ | Work categories |
| GET/POST/PUT/DELETE | `/api/experience` | read/✓ | Experience CRUD |
| GET/POST/PUT/DELETE | `/api/testimonials` | read/✓ | Testimonials CRUD |
| GET/POST/PUT/DELETE | `/api/social` | read/✓ | Social links CRUD |
| POST | `/api/messages` | – | Contact form submit |
| GET/PUT/DELETE | `/api/messages` | ✓ | Inbox management |
| POST/DELETE | `/api/upload` | ✓ | Media upload to Supabase Storage |
| GET | `/api/dashboard` | ✓ | Aggregate stats |

Interactive docs are auto-generated at `/docs` (Swagger) and `/redoc`.
