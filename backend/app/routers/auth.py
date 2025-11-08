from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
from app.schemas import UserCreate, UserLogin, UserResponse, UserUpdate, Token
from app.replit_auth import ReplitAuth, get_current_user, REPLIT_AUTH_AVAILABLE
from app.database import get_db
from app.repositories import Repository
from app.models import User

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Register a new user
    """
    try:
        result = ReplitAuth.simple_auth_register(
            username=user_data.username,
            email=user_data.email,
            password=user_data.password
        )
        return {"access_token": result["token"], "token_type": "bearer"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """
    Login user and return access token
    """
    try:
        result = ReplitAuth.simple_auth_login(
            email=credentials.email,
            password=credentials.password
        )
        return {"access_token": result["token"], "token_type": "bearer"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get current authenticated user
    """
    user = await Repository.get_by_id(db, User, int(current_user["id"]))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/update", response_model=UserResponse)
async def update_user(
    user_update: UserUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update current user's profile
    """
    user_id = int(current_user["id"])

    update_data = user_update.model_dump(exclude_unset=True)

    updated_user = await Repository.update_record(db, User, user_id, update_data)

    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")

    return updated_user


@router.delete("/logout")
async def logout(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Logout user (invalidate token)
    """
    return {"message": "Logged out successfully"}
