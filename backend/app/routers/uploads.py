from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from typing import Dict, Any, List
import aiofiles
import os
from app.schemas import UploadResponse
from app.replit_auth import get_current_user
from app.replit_db import DB, Collections
from app.config import settings

router = APIRouter(prefix="/api/uploads", tags=["Uploads"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/pdfs", exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/audio", exist_ok=True)


@router.post("/pdf", response_model=UploadResponse)
async def upload_pdf(
    file: UploadFile = File(...),
    room_id: str = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Upload a PDF reference document
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=400, detail="Only PDF files are allowed")

    if file.size and file.size > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=400, detail=f"File too large. Max size: {settings.MAX_FILE_SIZE_MB}MB")

    file_path = f"{UPLOAD_DIR}/pdfs/{room_id}_{file.filename}"

    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)

    uploaded_file = {
        "room_id": room_id,
        "file_name": file.filename,
        "file_path": file_path,
        "file_type": "pdf",
        "file_size": len(content)
    }

    file_record = DB.insert(Collections.UPLOADED_FILES, uploaded_file)

    if room_id:
        room = DB.get(Collections.ROOMS, room_id)
        if room:
            resources = room.get("resources", [])
            resources.append(
                {"file_id": file_record["id"], "type": "pdf", "name": file.filename})
            DB.update(Collections.ROOMS, room_id, {"resources": resources})

    return file_record


@router.post("/audio", response_model=UploadResponse)
async def upload_audio(
    file: UploadFile = File(...),
    room_id: str = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Upload audio file
    """
    allowed_extensions = ['.mp3', '.wav', '.ogg', '.m4a']
    if not any(file.filename.endswith(ext) for ext in allowed_extensions):
        raise HTTPException(status_code=400, detail="Invalid audio format")

    if file.size and file.size > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=400, detail=f"File too large. Max size: {settings.MAX_FILE_SIZE_MB}MB")

    file_path = f"{UPLOAD_DIR}/audio/{room_id}_{file.filename}"

    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)

    uploaded_file = {
        "room_id": room_id,
        "file_name": file.filename,
        "file_path": file_path,
        "file_type": "audio",
        "file_size": len(content)
    }

    file_record = DB.insert(Collections.UPLOADED_FILES, uploaded_file)

    return file_record


@router.post("/url")
async def upload_url(
    url: str,
    room_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Add a URL reference to a room
    """
    room = DB.get(Collections.ROOMS, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    if str(room["host_id"]) != str(current_user["id"]):
        raise HTTPException(
            status_code=403, detail="Only the host can add resources")

    uploaded_file = {
        "room_id": room_id,
        "file_name": url,
        "file_path": url,
        "file_type": "url",
        "file_size": 0
    }

    file_record = DB.insert(Collections.UPLOADED_FILES, uploaded_file)

    resources = room.get("resources", [])
    resources.append({"file_id": file_record["id"], "type": "url", "url": url})
    DB.update(Collections.ROOMS, room_id, {"resources": resources})

    return {"message": "URL added", "file": file_record}


@router.get("/{room_id}", response_model=List[UploadResponse])
async def get_room_uploads(room_id: str):
    """
    Get all uploaded files for a room
    """
    files = DB.find(Collections.UPLOADED_FILES, {"room_id": room_id})
    return files


@router.delete("/{file_id}")
async def delete_file(
    file_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Delete an uploaded file
    """
    file_record = DB.get(Collections.UPLOADED_FILES, file_id)
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")

    room = DB.get(Collections.ROOMS, str(file_record["room_id"]))
    if room and str(room["host_id"]) != str(current_user["id"]):
        raise HTTPException(
            status_code=403, detail="Only the host can delete files")

    if file_record["file_type"] != "url" and os.path.exists(file_record["file_path"]):
        os.remove(file_record["file_path"])

    DB.delete(Collections.UPLOADED_FILES, file_id)

    return {"message": "File deleted successfully"}
