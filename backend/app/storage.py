import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile

from app.config import settings

# Lazily-created Supabase client (only when credentials are present).
_client = None


def _get_client():
    global _client
    if _client is None:
        if not settings.supabase_url or not settings.supabase_service_key:
            return None
        from supabase import create_client

        _client = create_client(settings.supabase_url, settings.supabase_service_key)
    return _client


# Local fallback used when Supabase is not configured (e.g. local dev).
LOCAL_DIR = Path(__file__).resolve().parent.parent / "uploads"


def _safe_name(filename: str, folder: str) -> str:
    ext = Path(filename or "file").suffix.lower() or ".bin"
    return f"{folder}/{uuid.uuid4().hex}{ext}"


async def upload_file(file: UploadFile, folder: str = "media") -> str:
    """Store an uploaded file and return its public URL."""
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 10MB)")

    key = _safe_name(file.filename or "file", folder)
    client = _get_client()

    if client is not None:
        bucket = client.storage.from_(settings.supabase_bucket)
        bucket.upload(
            key,
            content,
            {"content-type": file.content_type or "application/octet-stream",
             "upsert": "true"},
        )
        return bucket.get_public_url(key)

    # ── Local fallback ──
    dest = LOCAL_DIR / key
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(content)
    return f"/uploads/{key}"


def delete_file(url: str) -> None:
    """Best-effort delete of a previously uploaded file."""
    client = _get_client()
    if client is not None and settings.supabase_bucket in url:
        # extract the object key after the bucket name
        try:
            key = url.split(f"{settings.supabase_bucket}/")[1].split("?")[0]
            client.storage.from_(settings.supabase_bucket).remove([key])
        except (IndexError, Exception):
            pass
        return

    if url.startswith("/uploads/"):
        target = LOCAL_DIR / url.replace("/uploads/", "", 1)
        if target.exists():
            target.unlink()
