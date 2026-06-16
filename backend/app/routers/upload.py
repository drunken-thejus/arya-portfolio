from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.deps import get_current_admin
from app.schemas import UploadOut
from app.storage import delete_file, upload_file

router = APIRouter(prefix="/api/upload", tags=["media"])

ALLOWED_FOLDERS = {"profile", "works", "thumbnails", "certificates", "media", "logos"}


@router.post("", response_model=UploadOut, dependencies=[Depends(get_current_admin)])
async def upload(
    file: UploadFile = File(...),
    folder: str = Form("media"),
):
    folder = folder if folder in ALLOWED_FOLDERS else "media"
    url = await upload_file(file, folder=folder)
    return UploadOut(url=url)


@router.delete("", dependencies=[Depends(get_current_admin)])
def remove(url: str):
    delete_file(url)
    return {"status": "deleted"}
