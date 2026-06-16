# Deployment Guide

Three free-tier services power production: **Supabase** (Postgres + Storage),
**Render** (FastAPI backend), **Vercel** (Next.js frontend).

---

## 1. Supabase — database + storage

1. Create a project at [supabase.com](https://supabase.com).
2. **Database URL:** Project Settings → Database → *Connection string* → URI.
   Copy it for `DATABASE_URL` (change the scheme from `postgres://` to
   `postgresql://` — the backend also does this automatically).
3. **Storage:** Storage → *New bucket* → name it `portfolio-media` and mark it
   **Public** (so images load on the site).
4. **Service key:** Project Settings → API → copy the `service_role` key for
   `SUPABASE_SERVICE_KEY`. *Keep this server-side only — never expose it to the frontend.*
5. Copy the project URL (`https://xxxx.supabase.co`) for `SUPABASE_URL`.

---

## 2. Render — FastAPI backend

1. Push this repo to GitHub.
2. On Render → *New* → *Web Service* → point at the repo, root directory `backend`.
   (A [`render.yaml`](./backend/render.yaml) blueprint is included.)
   - **Build:** `pip install -r requirements.txt`
   - **Start:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Health check path:** `/health`
3. Set environment variables (see `backend/.env.example`):
   `DATABASE_URL`, `SECRET_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`,
   `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_BUCKET`, `CORS_ORIGINS`
   (set this to your Vercel domain, e.g. `https://your-portfolio.vercel.app`).
4. **Run migrations / seed** once from the Render Shell:
   ```bash
   alembic revision --autogenerate -m "init"   # generate schema migration
   alembic upgrade head                          # apply it
   python seed.py                                # create admin + demo data
   ```
   > The app also calls `Base.metadata.create_all()` on boot, so tables exist
   > even before you wire up Alembic — but Alembic is the recommended path for
   > schema changes over time.

Note the deployed URL, e.g. `https://portfolio-api.onrender.com`.

---

## 3. Vercel — Next.js frontend

1. Vercel → *New Project* → import the repo, root directory `frontend`.
2. Environment variable:
   `NEXT_PUBLIC_API_URL = https://portfolio-api.onrender.com`
3. Deploy. Framework preset is auto-detected (Next.js).
4. Back on Render, make sure `CORS_ORIGINS` includes the final Vercel URL, then redeploy.

---

## Post-deploy checklist

- [ ] `GET https://<backend>/health` returns `{"status":"healthy"}`
- [ ] Site loads at the Vercel URL with seeded demo content
- [ ] `/admin/login` works with your `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- [ ] Uploading an image in the dashboard returns a `supabase.co` URL
- [ ] Submitting the contact form makes a message appear in `/admin/messages`

## Security notes

- Change `ADMIN_PASSWORD` from the default before going live.
- `SECRET_KEY` should be long and random (`python -c "import secrets; print(secrets.token_urlsafe(48))"`).
- The Supabase **service_role** key lives only on Render; the frontend never sees it.
- All write endpoints require a valid JWT; only the contact form and public reads are open.
